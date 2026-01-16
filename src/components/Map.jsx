import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import TerrainTileService from '../services/terrainTileService'
import { generateFloodPolygons, styleFloodPolygons } from '../utils/floodPolygonGenerator'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function Map({ seaLevel }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const isTerrainLoaded = useRef(false)
  const terrainService = useRef(null)
  const updateTimeout = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update flood visualization based on current map view and sea level
  const updateFloodZones = useCallback(async () => {
    if (!map.current || !terrainService.current || !isTerrainLoaded.current) return

    // Clear any pending update
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current)
    }

    // Debounce updates to avoid excessive calculations
    updateTimeout.current = setTimeout(async () => {
      try {
        setIsLoading(true)

        const bounds = map.current.getBounds()
        const zoom = Math.min(14, Math.floor(map.current.getZoom())) // Cap at zoom 14 (terrain-rgb maxzoom)

        // Get tiles in current view
        const tileCoords = terrainService.current.getTilesInBounds(bounds, zoom)
        console.log(`Zoom: ${zoom}, Found ${tileCoords.length} tiles in view`)

        // Limit number of tiles to avoid performance issues
        const maxTiles = 4 // 2x2 grid max for better performance
        const tilesToFetch = tileCoords.slice(0, maxTiles)
        console.log('Fetching tiles:', tilesToFetch.map(t => `${t.z}/${t.x}/${t.y}`).join(', '))

        // Fetch tiles
        const tilePromises = tilesToFetch.map(async ({ x, y, z }) => {
          const imageData = await terrainService.current.fetchTile(x, y, z)
          return { imageData, x, y, z }
        })

        const tiles = await Promise.all(tilePromises)

        // Debug: Analyze elevation data across all tiles
        if (tiles.length > 0) {
          console.group('🔍 Elevation Analysis')

          let minElev = Infinity
          let maxElev = -Infinity
          let elevationCounts = { belowZero: 0, zeroToOne: 0, oneToThree: 0, aboveThree: 0 }
          let totalSamples = 0

          tiles.forEach((tile, tileIdx) => {
            // Sample grid across entire tile
            for (let y = 0; y < 512; y += 64) {
              for (let x = 0; x < 512; x += 64) {
                const index = (y * 512 + x) * 4
                const r = tile.imageData.data[index]
                const g = tile.imageData.data[index + 1]
                const b = tile.imageData.data[index + 2]
                const elevation = -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1)

                totalSamples++
                minElev = Math.min(minElev, elevation)
                maxElev = Math.max(maxElev, elevation)

                if (elevation < 0) elevationCounts.belowZero++
                else if (elevation < 1) elevationCounts.zeroToOne++
                else if (elevation < 3) elevationCounts.oneToThree++
                else elevationCounts.aboveThree++
              }
            }
          })

          console.log(`📊 Elevation range: ${minElev.toFixed(2)}m to ${maxElev.toFixed(2)}m`)
          console.log(`📍 Sea level threshold: ${seaLevel}m`)
          console.log(`🏝️ Elevation distribution (${totalSamples} samples):`)
          console.log(`   < 0m (ocean): ${elevationCounts.belowZero} (${(elevationCounts.belowZero/totalSamples*100).toFixed(1)}%)`)
          console.log(`   0-1m (low land): ${elevationCounts.zeroToOne} (${(elevationCounts.zeroToOne/totalSamples*100).toFixed(1)}%)`)
          console.log(`   1-3m (mid land): ${elevationCounts.oneToThree} (${(elevationCounts.oneToThree/totalSamples*100).toFixed(1)}%)`)
          console.log(`   > 3m (high land): ${elevationCounts.aboveThree} (${(elevationCounts.aboveThree/totalSamples*100).toFixed(1)}%)`)
          console.groupEnd()
        }

        // Generate flood polygons
        const floodGeoJSON = generateFloodPolygons(tiles, seaLevel)

        // Apply styling
        const styledGeoJSON = styleFloodPolygons(floodGeoJSON)

        // Update map source
        const source = map.current.getSource('flood-zones')
        if (source) {
          source.setData(styledGeoJSON)
        }
      } catch (error) {
        console.error('Failed to update flood zones:', error)
      } finally {
        setIsLoading(false)
      }
    }, 500) // 500ms debounce for smoother performance
  }, [seaLevel]) // Re-create function when seaLevel changes

  useEffect(() => {
    if (map.current) return // Initialize map only once

    // Initialize terrain service
    terrainService.current = new TerrainTileService(mapboxgl.accessToken)

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [179.1962, -8.5211], // Funafuti, Tuvalu
      zoom: 13
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Load map resources
    map.current.on('load', () => {
      // Add flood visualization source and layer
      map.current.addSource('flood-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      map.current.addLayer({
        id: 'flood-overlay',
        type: 'fill',
        source: 'flood-zones',
        paint: {
          // Use property-based styling for depth-based colors
          'fill-color': ['get', 'fill'],
          'fill-opacity': ['get', 'fill-opacity']
        }
      })

      isTerrainLoaded.current = true

      // Update flood zones on map move (debounced)
      map.current.on('moveend', () => {
        updateFloodZones()
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update flood visualization when sea level changes
  useEffect(() => {
    updateFloodZones()

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current)
      }
    }
  }, [updateFloodZones])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000,
          }}
        >
          Calculating flood zones...
        </div>
      )}
    </div>
  )
}

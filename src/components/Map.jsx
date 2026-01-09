import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function Map({ seaLevel }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const isTerrainLoaded = useRef(false)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [179.1962, -8.5211], // Funafuti, Tuvalu
      zoom: 13,
      pitch: 60, // Tilt the camera to see elevation
      bearing: 0
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Enable 3D terrain when map loads
    map.current.on('load', () => {
      // Add terrain source
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14
      })

      // Add 3D terrain layer
      map.current.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.5 // Exaggerate elevation for visibility
      })

      // Wait for terrain to be ready
      map.current.once('idle', () => {
        isTerrainLoaded.current = true

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
            'fill-color': '#2196F3',
            'fill-opacity': 0.5
          }
        })
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
    if (!map.current || !isTerrainLoaded.current) return

    const updateFloodZones = () => {
      const bounds = map.current.getBounds()
      const gridSize = 50 // Number of sample points per dimension

      // Create a grid of points across the visible area
      const lngStep = (bounds.getEast() - bounds.getWest()) / gridSize
      const latStep = (bounds.getNorth() - bounds.getSouth()) / gridSize

      const features = []

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const lng = bounds.getWest() + i * lngStep
          const lat = bounds.getSouth() + j * latStep

          // Query terrain elevation at this point
          const elevation = map.current.queryTerrainElevation([lng, lat], { exaggerated: false })

          // If elevation is below sea level, create a cell polygon
          if (elevation !== null && elevation <= seaLevel) {
            const cellPolygon = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [lng, lat],
                  [lng + lngStep, lat],
                  [lng + lngStep, lat + latStep],
                  [lng, lat + latStep],
                  [lng, lat]
                ]]
              },
              properties: {
                elevation: elevation
              }
            }
            features.push(cellPolygon)
          }
        }
      }

      // Update the flood zones layer
      const source = map.current.getSource('flood-zones')
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: features
        })
      }
    }

    // Update flood zones immediately
    updateFloodZones()

    // Also update when map moves
    const handleMove = () => updateFloodZones()
    map.current.on('moveend', handleMove)

    return () => {
      if (map.current) {
        map.current.off('moveend', handleMove)
      }
    }
  }, [seaLevel])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}

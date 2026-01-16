/**
 * Flood Polygon Generator
 *
 * Generates GeoJSON polygons for areas below a given sea level threshold
 * based on terrain elevation data
 */

import { getElevationAtPixel, tilePixelToLngLat } from './elevationUtils'

const SAMPLE_STEP = 32 // Sample every 32 pixels (balance between quality and performance)
const MIN_POLYGON_AREA = 0.00000001 // Filter out very small polygons

/**
 * Generate flood polygons for a single tile
 * @param {ImageData} imageData - Decoded terrain tile
 * @param {number} tileX - Tile X coordinate
 * @param {number} tileY - Tile Y coordinate
 * @param {number} zoom - Zoom level
 * @param {number} seaLevel - Sea level threshold in meters
 * @param {number} tileSize - Tile size in pixels (default 512)
 * @returns {Array<object>} Array of GeoJSON polygon features
 */
export function generateFloodPolygonsForTile(
  imageData,
  tileX,
  tileY,
  zoom,
  seaLevel,
  tileSize = 512
) {
  const features = []
  const visited = new Set()
  let debugCounts = { checked: 0, tooLow: 0, tooHigh: 0, flooded: 0 }

  // Sample the tile at regular intervals
  for (let y = 0; y < tileSize; y += SAMPLE_STEP) {
    for (let x = 0; x < tileSize; x += SAMPLE_STEP) {
      const key = `${x},${y}`
      if (visited.has(key)) continue

      const elevation = getElevationAtPixel(imageData, x, y)
      debugCounts.checked++

      // Only show land that would be newly flooded:
      // - Currently ABOVE 0.05m (excludes lagoon/ocean at ~0m, but includes low-lying land)
      // - Below the sea level rise threshold
      // This shows dry land that would be inundated, not existing water bodies
      const minLandElevation = 0.05 // Minimum elevation to consider as "land" vs "water"
      const isDryLand = elevation > minLandElevation
      const wouldBeFlooded = elevation <= seaLevel

      if (!isDryLand) {
        debugCounts.tooLow++
      } else if (!wouldBeFlooded) {
        debugCounts.tooHigh++
      }

      if (isDryLand && wouldBeFlooded) {
        debugCounts.flooded++
        visited.add(key)

        // Get the bounds of this sample cell
        const { lng: lng1, lat: lat1 } = tilePixelToLngLat(tileX, tileY, zoom, x, y, tileSize)
        const { lng: lng2, lat: lat2 } = tilePixelToLngLat(
          tileX,
          tileY,
          zoom,
          x + SAMPLE_STEP,
          y + SAMPLE_STEP,
          tileSize
        )

        // Create a rectangular polygon for this cell
        const polygon = {
          type: 'Feature',
          properties: {
            elevation,
            depth: seaLevel - elevation,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [lng1, lat1],
                [lng2, lat1],
                [lng2, lat2],
                [lng1, lat2],
                [lng1, lat1],
              ],
            ],
          },
        }

        features.push(polygon)
      }
    }
  }

  // Debug logging for this tile
  if (debugCounts.checked > 0) {
    console.log(`   Tile ${tileX}/${tileY} @ zoom ${zoom}: checked ${debugCounts.checked} cells`)
    console.log(`      ${debugCounts.tooLow} below 0.05m (water/lagoon - excluded)`)
    console.log(`      ${debugCounts.tooHigh} above ${seaLevel}m (dry land - stays dry)`)
    console.log(`      ${debugCounts.flooded} would be flooded (${(debugCounts.flooded/debugCounts.checked*100).toFixed(1)}%)`)
  }

  return features
}

/**
 * Generate flood polygons for multiple tiles
 * @param {Array<{imageData: ImageData, x: number, y: number, z: number}>} tiles
 * @param {number} seaLevel - Sea level threshold in meters
 * @returns {object} GeoJSON FeatureCollection
 */
export function generateFloodPolygons(tiles, seaLevel) {
  const allFeatures = []
  let totalChecked = 0
  let flooded = 0
  let filteredOut = 0

  for (const tile of tiles) {
    const features = generateFloodPolygonsForTile(
      tile.imageData,
      tile.x,
      tile.y,
      tile.z,
      seaLevel
    )
    allFeatures.push(...features)
  }

  // Count what was filtered
  console.log(`🌊 Flood polygon generation:`)
  console.log(`   Generated ${allFeatures.length} initial flood cells`)

  // Filter out very small polygons
  const filtered = allFeatures.filter((feature) => {
    const coords = feature.geometry.coordinates[0]
    const area = calculatePolygonArea(coords)
    return area > MIN_POLYGON_AREA
  })

  console.log(`   After filtering: ${filtered.length} polygons`)

  if (filtered.length > 0) {
    const depths = filtered.map(f => f.properties.depth)
    console.log(`   Depth range: ${Math.min(...depths).toFixed(2)}m - ${Math.max(...depths).toFixed(2)}m`)
  }

  return {
    type: 'FeatureCollection',
    features: filtered,
  }
}

/**
 * Calculate approximate area of a polygon (simple box approximation)
 * @param {Array<Array<number>>} coordinates - Polygon coordinates
 * @returns {number} Approximate area
 */
function calculatePolygonArea(coordinates) {
  if (coordinates.length < 4) return 0

  const lngs = coordinates.map((c) => c[0])
  const lats = coordinates.map((c) => c[1])

  const width = Math.max(...lngs) - Math.min(...lngs)
  const height = Math.max(...lats) - Math.min(...lats)

  return width * height
}

/**
 * Optimize flood polygons by merging adjacent cells (simplified version)
 * This is a basic implementation - could be enhanced with proper polygon union
 * @param {object} featureCollection - GeoJSON FeatureCollection
 * @returns {object} Optimized GeoJSON FeatureCollection
 */
export function optimizeFloodPolygons(featureCollection) {
  // For now, just return the input
  // In a production implementation, you could:
  // 1. Use a library like turf.js for polygon union
  // 2. Implement marching squares for smoother contours
  // 3. Simplify geometries to reduce vertex count
  return featureCollection
}

/**
 * Create a flood visualization with depth-based styling
 * @param {object} featureCollection - GeoJSON FeatureCollection
 * @returns {object} FeatureCollection with styled properties
 */
export function styleFloodPolygons(featureCollection) {
  return {
    ...featureCollection,
    features: featureCollection.features.map((feature) => {
      const depth = feature.properties.depth || 0

      // Calculate color based on depth (darker blue for deeper water)
      let opacity = 0.4
      let color = '#2196F3' // Light blue

      if (depth > 1.5) {
        color = '#0D47A1' // Dark blue
        opacity = 0.6
      } else if (depth > 0.5) {
        color = '#1976D2' // Medium blue
        opacity = 0.5
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          fill: color,
          'fill-opacity': opacity,
        },
      }
    }),
  }
}

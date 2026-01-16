/**
 * Elevation utility functions for decoding Mapbox Terrain-RGB data
 *
 * Mapbox Terrain-RGB encodes elevation in RGB values:
 * height (meters) = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
 *
 * References:
 * - https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
 * - https://docs.mapbox.com/data/tilesets/guides/access-elevation-data/
 */

/**
 * Decode elevation from RGB pixel values
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {number} Elevation in meters
 */
export function rgbToElevation(r, g, b) {
  return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1)
}

/**
 * Decode elevation from ImageData
 * @param {ImageData} imageData - Canvas ImageData from terrain-rgb tile
 * @param {number} x - X coordinate in the image
 * @param {number} y - Y coordinate in the image
 * @returns {number} Elevation in meters at the given pixel
 */
export function getElevationAtPixel(imageData, x, y) {
  const index = (y * imageData.width + x) * 4
  const r = imageData.data[index]
  const g = imageData.data[index + 1]
  const b = imageData.data[index + 2]
  return rgbToElevation(r, g, b)
}

/**
 * Get tile coordinates for a given lng/lat at zoom level
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} zoom - Zoom level
 * @returns {{ x: number, y: number, z: number }} Tile coordinates
 */
export function getTileCoordinates(lng, lat, zoom) {
  const n = Math.pow(2, zoom)
  const x = Math.floor((lng + 180) / 360 * n)
  const latRad = lat * Math.PI / 180
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
  return { x, y, z: zoom }
}

/**
 * Get lng/lat from tile pixel coordinates
 * @param {number} x - Tile X coordinate
 * @param {number} y - Tile Y coordinate
 * @param {number} z - Zoom level
 * @param {number} pixelX - Pixel X within tile (0-511 for 512px tiles)
 * @param {number} pixelY - Pixel Y within tile (0-511 for 512px tiles)
 * @param {number} tileSize - Tile size in pixels (default 512)
 * @returns {{ lng: number, lat: number }} Geographic coordinates
 */
export function tilePixelToLngLat(x, y, z, pixelX, pixelY, tileSize = 512) {
  const n = Math.pow(2, z)
  const lng = ((x + pixelX / tileSize) / n) * 360 - 180

  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + pixelY / tileSize) / n)))
  const lat = latRad * 180 / Math.PI

  return { lng, lat }
}

/**
 * Get pixel coordinates within a tile for given lng/lat
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} z - Zoom level
 * @param {number} tileSize - Tile size in pixels (default 512)
 * @returns {{ tileX: number, tileY: number, pixelX: number, pixelY: number }}
 */
export function lngLatToTilePixel(lng, lat, z, tileSize = 512) {
  const n = Math.pow(2, z)

  const xTile = (lng + 180) / 360 * n
  const tileX = Math.floor(xTile)
  const pixelX = Math.floor((xTile - tileX) * tileSize)

  const latRad = lat * Math.PI / 180
  const yTile = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n
  const tileY = Math.floor(yTile)
  const pixelY = Math.floor((yTile - tileY) * tileSize)

  return { tileX, tileY, pixelX, pixelY }
}

/**
 * Calculate tile bounds in lng/lat coordinates
 * @param {number} x - Tile X coordinate
 * @param {number} y - Tile Y coordinate
 * @param {number} z - Zoom level
 * @returns {{ west: number, south: number, east: number, north: number }}
 */
export function getTileBounds(x, y, z) {
  const n = Math.pow(2, z)

  const west = (x / n) * 360 - 180
  const east = ((x + 1) / n) * 360 - 180

  const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI
  const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI

  return { west, south, east, north }
}

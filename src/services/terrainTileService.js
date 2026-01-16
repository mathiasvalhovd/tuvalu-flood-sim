/**
 * Terrain Tile Service
 *
 * Handles fetching, caching, and decoding Mapbox Terrain-RGB tiles
 */

import { getTileCoordinates, getElevationAtPixel } from '../utils/elevationUtils'

const TILE_SIZE = 512
const MAX_CACHE_SIZE = 50

class TerrainTileService {
  constructor(accessToken) {
    this.accessToken = accessToken
    this.tileCache = new Map()
    this.pendingRequests = new Map()
  }

  /**
   * Get terrain-rgb tile URL
   * @param {number} x - Tile X coordinate
   * @param {number} y - Tile Y coordinate
   * @param {number} z - Zoom level
   * @returns {string} Tile URL
   */
  getTileUrl(x, y, z) {
    return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=${this.accessToken}`
  }

  /**
   * Get cache key for a tile
   * @param {number} x - Tile X coordinate
   * @param {number} y - Tile Y coordinate
   * @param {number} z - Zoom level
   * @returns {string}
   */
  getTileKey(x, y, z) {
    return `${z}/${x}/${y}`
  }

  /**
   * Fetch and decode a terrain tile
   * @param {number} x - Tile X coordinate
   * @param {number} y - Tile Y coordinate
   * @param {number} z - Zoom level
   * @returns {Promise<ImageData>} Decoded tile image data
   */
  async fetchTile(x, y, z) {
    const key = this.getTileKey(x, y, z)

    // Check cache
    if (this.tileCache.has(key)) {
      return this.tileCache.get(key)
    }

    // Check if already fetching
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }

    // Fetch tile
    const promise = this._fetchTileInternal(x, y, z)
    this.pendingRequests.set(key, promise)

    try {
      const imageData = await promise
      this._addToCache(key, imageData)
      return imageData
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  /**
   * Internal tile fetching and decoding
   * @private
   */
  async _fetchTileInternal(x, y, z) {
    const url = this.getTileUrl(x, y, z)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          // Create canvas and decode tile
          const canvas = document.createElement('canvas')
          canvas.width = TILE_SIZE
          canvas.height = TILE_SIZE
          const ctx = canvas.getContext('2d')

          ctx.drawImage(img, 0, 0, TILE_SIZE, TILE_SIZE)
          const imageData = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE)

          resolve(imageData)
        } catch (error) {
          reject(new Error(`Failed to decode tile ${x}/${y}/${z}: ${error.message}`))
        }
      }

      img.onerror = () => {
        reject(new Error(`Failed to load tile ${x}/${y}/${z}`))
      }

      img.src = url
    })
  }

  /**
   * Add tile to cache with LRU eviction
   * @private
   */
  _addToCache(key, imageData) {
    // If cache is full, remove oldest entry (LRU)
    if (this.tileCache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.tileCache.keys().next().value
      this.tileCache.delete(firstKey)
    }

    this.tileCache.set(key, imageData)
  }

  /**
   * Get elevation at a specific lng/lat coordinate
   * @param {number} lng - Longitude
   * @param {number} lat - Latitude
   * @param {number} zoom - Zoom level to use for tile fetching
   * @returns {Promise<number>} Elevation in meters
   */
  async getElevation(lng, lat, zoom) {
    const { x, y, z } = getTileCoordinates(lng, lat, zoom)
    const imageData = await this.fetchTile(x, y, z)

    // Calculate pixel position within tile
    const n = Math.pow(2, zoom)
    const xTile = (lng + 180) / 360 * n
    const pixelX = Math.floor((xTile - x) * TILE_SIZE)

    const latRad = lat * Math.PI / 180
    const yTile = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n
    const pixelY = Math.floor((yTile - y) * TILE_SIZE)

    // Clamp to tile bounds
    const clampedX = Math.max(0, Math.min(TILE_SIZE - 1, pixelX))
    const clampedY = Math.max(0, Math.min(TILE_SIZE - 1, pixelY))

    return getElevationAtPixel(imageData, clampedX, clampedY)
  }

  /**
   * Get tiles needed for current map bounds
   * @param {object} bounds - Mapbox bounds object
   * @param {number} zoom - Current zoom level
   * @returns {Array<{x: number, y: number, z: number}>} Array of tile coordinates
   */
  getTilesInBounds(bounds, zoom) {
    const tiles = []

    const nwTile = getTileCoordinates(bounds.getWest(), bounds.getNorth(), zoom)
    const seTile = getTileCoordinates(bounds.getEast(), bounds.getSouth(), zoom)

    // Clamp to reasonable bounds
    const minX = Math.max(0, Math.min(nwTile.x, seTile.x))
    const maxX = Math.min(Math.pow(2, zoom) - 1, Math.max(nwTile.x, seTile.x))
    const minY = Math.max(0, Math.min(nwTile.y, seTile.y))
    const maxY = Math.min(Math.pow(2, zoom) - 1, Math.max(nwTile.y, seTile.y))

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        tiles.push({ x, y, z: zoom })
      }
    }

    return tiles
  }

  /**
   * Prefetch tiles for given bounds
   * @param {object} bounds - Mapbox bounds object
   * @param {number} zoom - Current zoom level
   * @returns {Promise<void>}
   */
  async prefetchTiles(bounds, zoom) {
    const tiles = this.getTilesInBounds(bounds, zoom)
    const promises = tiles.map(({ x, y, z }) => this.fetchTile(x, y, z).catch(() => null))
    await Promise.all(promises)
  }

  /**
   * Clear tile cache
   */
  clearCache() {
    this.tileCache.clear()
    this.pendingRequests.clear()
  }
}

export default TerrainTileService

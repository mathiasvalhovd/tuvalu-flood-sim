import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function LandingMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [179.1962, -8.5211], // Tuvalu coordinates
      zoom: 1.2, // Much wider view showing entire Pacific region
      interactive: true,
    })

    // Add navigation controls (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      // Add a source for Tuvalu highlight circle
      map.current.addSource('tuvalu-highlight', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [179.1962, -8.5211]
          }
        }
      })

      // Add a pulsing circle layer for Tuvalu
      map.current.addLayer({
        id: 'tuvalu-circle',
        type: 'circle',
        source: 'tuvalu-highlight',
        paint: {
          'circle-radius': 8,
          'circle-color': '#667eea',
          'circle-opacity': 0.7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 1
        }
      })

      // Add a pulsing outer circle
      map.current.addLayer({
        id: 'tuvalu-pulse',
        type: 'circle',
        source: 'tuvalu-highlight',
        paint: {
          'circle-radius': 14,
          'circle-color': '#667eea',
          'circle-opacity': 0.3,
        }
      })

      // Add marker with label positioned above
      const el = document.createElement('div')
      el.className = 'tuvalu-marker'
      el.innerHTML = `
        <div style="
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          white-space: nowrap;
          pointer-events: none;
          transform: translateY(-60px);
        ">
          Tuvalu
        </div>
      `

      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([179.1962, -8.5211])
        .addTo(map.current)

      // Add pulse animation
      let pulseRadius = 14
      let direction = 1
      const animatePulse = () => {
        pulseRadius += direction * 0.2
        if (pulseRadius > 18 || pulseRadius < 14) {
          direction *= -1
        }

        if (map.current.getLayer('tuvalu-pulse')) {
          map.current.setPaintProperty('tuvalu-pulse', 'circle-radius', pulseRadius)
        }

        requestAnimationFrame(animatePulse)
      }
      animatePulse()
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
}

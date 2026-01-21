import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function LandingPage({ onContinue }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [started, setStarted] = useState(false)
  const [zoomComplete, setZoomComplete] = useState(false)

  useEffect(() => {
    // Reset scroll position when component mounts - scroll both window and parent container
    window.scrollTo(0, 0)
    const scrollContainer = mapContainer.current?.closest('.page-transition')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }

    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [160, -5], // Start wider in Pacific
      zoom: 2,
      interactive: false,
      attributionControl: false,
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const handleStart = () => {
    if (started || !map.current) return
    setStarted(true)

    // Reset scroll position to top - scroll the parent container
    const scrollContainer = mapContainer.current?.closest('.page-transition')
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
    window.scrollTo(0, 0)

    // Start zoom animation
    map.current.flyTo({
      center: [179.1962, -8.5211],
      zoom: 14,
      duration: 6000,
      essential: true,
      curve: 1.2,
    })

    // Mark zoom complete after animation
    setTimeout(() => {
      setZoomComplete(true)
    }, 6000)
  }

  return (
    <div className="landing-fullscreen">
      {/* Full-screen map background */}
      <div ref={mapContainer} className="landing-map-bg" />

      {/* Gradient overlay for readability */}
      <div className="landing-overlay" />

      {/* Click to start overlay */}
      {!started && (
        <div className="start-overlay" onClick={handleStart}>
          <div className="start-content">
            <h1>Tuvalu</h1>
            <p>A Nation at the Frontline of Climate Change</p>
            <button className="start-button">
              <span>Click to Start</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrolling content - only visible after started */}
      <div className={`landing-scroll-container ${started ? 'visible' : 'hidden'}`}>
        {/* Title card */}
        <section className="landing-card landing-card-title">
          <h1>Tuvalu</h1>
          <p className="subtitle">A Nation at the Frontline of Climate Change</p>
          <div className={`scroll-indicator ${zoomComplete ? 'visible' : ''}`}>
            <span>Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        {/* Card 1: About Tuvalu */}
        <section className="landing-card">
          <div className="card-content">
            <h2>A Disappearing Nation</h2>
            <p>
              Tuvalu is a Polynesian island nation in the Pacific Ocean, midway between
              Hawaii and Australia. With a maximum elevation of just 4.6 meters above sea level,
              it is one of the world's most vulnerable nations to rising seas.
            </p>
            <div className="stats-row">
              <div className="stat">
                <span className="stat-value">~11,000</span>
                <span className="stat-label">Population</span>
              </div>
              <div className="stat">
                <span className="stat-value">26 km²</span>
                <span className="stat-label">Total Land Area</span>
              </div>
              <div className="stat">
                <span className="stat-value">4.6m</span>
                <span className="stat-label">Highest Point</span>
              </div>
            </div>
            <p className="highlight-text">
              By 2100, most of Tuvalu could be underwater. Where will its people go?
            </p>
          </div>
        </section>

        {/* Card 2: Climate Refugees */}
        <section className="landing-card">
          <div className="card-content">
            <h2>The Climate Refugee Problem</h2>
            <p>
              Climate displacement is one of the defining challenges of our era. Yet
              "climate refugee" has no legal status under international law. The 1951
              Refugee Convention only recognizes those fleeing persecution—not those
              fleeing rising seas, droughts, or extreme weather.
            </p>
            <div className="legal-box">
              <h3>The Legal Gap</h3>
              <p>
                In 2020, the UN Human Rights Committee ruled on the case of Ioane Teitiota
                from Kiribati, who sought asylum in New Zealand due to climate change. While
                his claim was denied, the Committee concluded that climate change could
                eventually make conditions so severe that returning people would violate their
                right to life.
              </p>
              <p className="verdict">A landmark ruling—but still no legal pathway.</p>
            </div>
          </div>
        </section>

        {/* Card 3: The Question */}
        <section className="landing-card landing-card-question">
          <div className="card-content">
            <h2>A New Path Forward</h2>
            <p>
              Without legal recognition, climate-displaced people have few options.
              International frameworks move slowly. Climate change does not.
            </p>
            <p>
              But in November 2023, something unprecedented happened. Australia and
              Tuvalu signed a bilateral agreement that creates a new pathway entirely
              outside the refugee system.
            </p>
            <button className="explore-button" onClick={onContinue}>
              <span>Enter the Ballot</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

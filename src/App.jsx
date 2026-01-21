import { useState, useRef, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LandingPage from './components/LandingPage'
import BallotRegistration from './components/BallotRegistration'
import './styles/main.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [landingKey, setLandingKey] = useState(0)
  const [ballotKey, setBallotKey] = useState(0)
  const landingRef = useRef(null)
  const ballotRef = useRef(null)

  // Scroll containers to top when page changes
  useEffect(() => {
    if (landingRef.current) landingRef.current.scrollTop = 0
    if (ballotRef.current) ballotRef.current.scrollTop = 0
  }, [currentPage])

  const navigateTo = (page) => {
    if (isTransitioning || page === currentPage) return

    setIsTransitioning(true)

    // Reset pages when navigating to them
    if (page === 'landing') {
      setLandingKey(prev => prev + 1)
    }
    if (page === 'ballot') {
      setBallotKey(prev => prev + 1)
    }

    setTimeout(() => {
      setCurrentPage(page)
      // Scroll containers to top after transition
      if (landingRef.current) landingRef.current.scrollTop = 0
      if (ballotRef.current) ballotRef.current.scrollTop = 0
      setIsTransitioning(false)
    }, 400)
  }

  const getPageClass = (page) => {
    if (isTransitioning) return 'hidden'
    return currentPage === page ? 'visible' : 'hidden'
  }

  return (
    <div className="app-wrapper">
      <Analytics />
      <div ref={landingRef} className={`page-transition ${getPageClass('landing')}`}>
        <LandingPage key={landingKey} onContinue={() => navigateTo('ballot')} />
      </div>
      <div ref={ballotRef} className={`page-transition ${getPageClass('ballot')}`}>
        <BallotRegistration
          key={ballotKey}
          onBack={() => navigateTo('landing')}
          onComplete={() => navigateTo('landing')}
        />
      </div>
    </div>
  )
}

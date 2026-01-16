import { useState, useEffect } from 'react'

export default function VisualPanel({ visualSrc, visualAlt }) {
  const [currentSrc, setCurrentSrc] = useState(visualSrc)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    if (visualSrc !== currentSrc) {
      // Trigger fade out
      setIsTransitioning(true)

      // Wait for fade out, then change image and fade in
      const timer = setTimeout(() => {
        setCurrentSrc(visualSrc)
        setIsTransitioning(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [visualSrc, currentSrc])

  const handleImageError = () => {
    setImageErrors(prev => ({ ...prev, [currentSrc]: true }))
  }

  const hasError = imageErrors[currentSrc]

  return (
    <div className="visual-panel">
      <div className={`visual-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {currentSrc && !hasError ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={visualAlt || 'Story visual'}
            onError={handleImageError}
          />
        ) : (
          <div className="visual-placeholder">
            <p>Add image here</p>
            <span style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>
              {currentSrc?.split('/').pop()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

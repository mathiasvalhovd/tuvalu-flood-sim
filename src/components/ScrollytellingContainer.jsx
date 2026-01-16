import { useState, useEffect, useRef, createContext } from 'react'
import VisualPanel from './VisualPanel'
import ContentPanel from './ContentPanel'

export const ScrollContext = createContext()

export default function ScrollytellingContainer({ sections }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id)
  const observerRef = useRef(null)

  useEffect(() => {
    // Create Intersection Observer to track which section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.sectionId
            setActiveSection(sectionId)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px',
      }
    )

    // Observe all story sections
    const sectionElements = document.querySelectorAll('[data-section-id]')
    sectionElements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [sections])

  // Find the current active section's visual
  const currentVisual = sections.find((s) => s.id === activeSection)

  return (
    <ScrollContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="scrollytelling-container">
        <VisualPanel
          visualSrc={currentVisual?.visualSrc}
          visualAlt={currentVisual?.visualAlt}
        />
        <ContentPanel sections={sections} />
      </div>
    </ScrollContext.Provider>
  )
}

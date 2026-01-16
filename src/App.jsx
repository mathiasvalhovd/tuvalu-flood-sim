import { useState } from 'react'
import LandingPage from './components/LandingPage'
import ScrollytellingContainer from './components/ScrollytellingContainer'
import './styles/main.css'

const storySections = [
  {
    id: 'intro',
    title: 'Life in Paradise',
    content: [
      'The sun rises over the turquoise waters of Funafuti Atoll, painting the sky in shades of pink and gold.',
      'For generations, families have called these low-lying islands home, living in harmony with the ocean that surrounds them.',
    ],
    visualSrc: '/images/story/P1.jpg',
    visualAlt: 'Sunrise over Tuvalu waters',
  },
  {
    id: 'family',
    title: 'The Family',
    content: [
      'Meet the Talia family - parents and their young daughter who have lived on this atoll for their entire lives.',
      'Their home sits just meters above sea level, built in the traditional style with modern adaptations.',
    ],
    visualSrc: '/images/story/02-family.jpg',
    visualAlt: 'Traditional Tuvaluan family home',
  },
  {
    id: 'rising-waters',
    title: 'The Rising Tide',
    content: [
      'Over recent years, the family has noticed changes. High tides reach further inland than before.',
      'Storm surges flood their garden more frequently. The water table rises, making fresh water scarce.',
      'Climate change is no longer an abstract concept - it is their daily reality.',
    ],
    visualSrc: '/images/story/03-flooding.jpg',
    visualAlt: 'Coastal flooding in Tuvalu',
  },
  {
    id: 'impact',
    title: 'A Changing Home',
    content: [
      'The saltwater intrusion damages crops. Fish migration patterns shift. Infrastructure crumbles under the constant assault of water.',
      'Their daughter asks questions they struggle to answer: "Will our island disappear? Where will we go?"',
    ],
    visualSrc: '/images/story/04-impact.jpg',
    visualAlt: 'Agricultural impact of sea level rise',
  },
  {
    id: 'treaty',
    title: 'A New Hope',
    content: [
      'News arrives of a groundbreaking treaty with Australia - the Australia-Tuvalu Falepili Union.',
      'For the first time, there is a pathway. A chance for climate migrants to relocate with dignity and support.',
      'The family faces an impossible choice: stay in their ancestral home or seek safety for their daughter\'s future.',
    ],
    visualSrc: '/images/story/05-treaty.jpg',
    visualAlt: 'Community gathering to discuss the treaty',
  },
  {
    id: 'decision',
    title: 'The Ballot',
    content: [
      'After sleepless nights and tearful conversations, they decide to enter the ballot.',
      'The announcement comes: they have been selected. A new chapter awaits in Australia.',
      'They pack their belongings, carrying memories of an island that will always be home.',
    ],
    visualSrc: '/images/story/06-departure.jpg',
    visualAlt: 'Family preparing for relocation',
  },
  {
    id: 'future',
    title: 'Looking Forward',
    content: [
      'The Talia family is now building a new life, carrying their culture and heritage with them.',
      'Their story is one of thousands - a testament to resilience in the face of climate change.',
      'Tuvalu may be small, but its people and their struggle represent one of the great challenges of our time.',
    ],
    visualSrc: '/images/story/07-hope.jpg',
    visualAlt: 'New horizons',
  },
]

export default function App() {
  const [showStory, setShowStory] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleEnterStory = () => {
    setIsTransitioning(true)
    // Scroll to top immediately
    window.scrollTo(0, 0)
    // Delay showing story until fade out completes
    setTimeout(() => {
      setShowStory(true)
      window.scrollTo(0, 0) // Ensure we're at top when story appears
    }, 400)
  }

  return (
    <div className="app-wrapper">
      <div className={`page-transition ${!showStory && !isTransitioning ? 'visible' : 'hidden'}`}>
        <LandingPage onEnterStory={handleEnterStory} />
      </div>
      <div className={`page-transition ${showStory ? 'visible' : 'hidden'}`}>
        <ScrollytellingContainer sections={storySections} />
      </div>
    </div>
  )
}

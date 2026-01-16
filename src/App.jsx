import { useState } from 'react'
import LandingPage from './components/LandingPage'
import ScrollytellingContainer from './components/ScrollytellingContainer'
import './styles/main.css'

const storySections = [
  {
    id: 'intro',
    title: 'Life before the rising sea',
    content: [
      'Many years ago, Tavita and Mele Apinelu lived a peaceful life in Tuvalu. Their small home stood safely on the land, untouched by the sea. High tides came and went, but the water never reached their house.',
      'Tavita fished close to shore and returned each day with full nets. Mele kept the home and shared evenings with him, listening to the ocean and talking about the future. Life felt stable, and the island felt permanent. At that time, they never imagined a day when the sea would threaten the place they called home.',
    ],
    visualSrc: '/images/story/P1.jpg',
    visualAlt: 'Sunrise over Tuvalu waters',
  },
  {
    id: 'family',
    title: 'A new opportunity - Falepili Union treaty',
    content: [
 
      'One afternoon, Mele overheard people talking in town about a new agreement with Australia. Curious and desperate for hope, she searched for more information. What she found made her heart race. Tuvalu and Australia had created a migration agreement that allowed Tuvaluans to apply for a special visa.',
      'For the first time in months, Mele felt hope. She waited anxiously for Tavita to return home and told him everything as soon as he arrived. Tavita listened carefully, then nodded with determination. “We have to try,” he said. “For Litia.',
      'As they read further, their excitement dimmed slightly. Only 280 people per year would be accepted. The chances were small. Even registering for the ballot required a 25 Australian Dollar fee, a significant amount for a family already struggling. Still, they knew they had no other option. With trembling hands and quiet prayers, they registered.'
      ,
    ],
    visualSrc: '/images/story/P31.jpg',
    visualAlt: 'Traditional Tuvaluan family home',
  }
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

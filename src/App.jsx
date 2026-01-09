import { useState } from 'react'
import Map from './components/Map'
import SeaLevelSlider from './components/SeaLevelSlider'
import InfoPanel from './components/InfoPanel'
import './styles/main.css'

export default function App() {
  const [seaLevel, setSeaLevel] = useState(0)

  return (
    <div className="app-container">
      <div className="map-container">
        <Map seaLevel={seaLevel} />
        <SeaLevelSlider seaLevel={seaLevel} setSeaLevel={setSeaLevel} />
      </div>
      <div className="controls-container">
        <InfoPanel />
      </div>
    </div>
  )
}

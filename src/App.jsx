import Map from './components/Map'
import SeaLevelSlider from './components/SeaLevelSlider'
import InfoPanel from './components/InfoPanel'
import './styles/main.css'

export default function App() {
  return (
    <div className="app-container">
      <div className="map-container">
        <Map />
      </div>
      <div className="controls-container">
        <InfoPanel />
        <SeaLevelSlider />
      </div>
    </div>
  )
}

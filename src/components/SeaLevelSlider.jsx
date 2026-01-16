import '../styles/slider.css'

export default function SeaLevelSlider({ seaLevel, setSeaLevel }) {
  const handleChange = (e) => {
    setSeaLevel(parseFloat(e.target.value))
  }

  return (
    <div className="sea-level-slider">
      <div className="slider-content">
        <label htmlFor="sea-level" className="slider-label">
          Sea Level Rise: <span className="slider-value">+{seaLevel.toFixed(1)}m</span>
        </label>
        <input
          type="range"
          id="sea-level"
          min="0"
          max="5"
          step="0.1"
          value={seaLevel}
          onChange={handleChange}
          className="slider-input"
        />
        <div className="slider-markers">
          <span>0m</span>
          <span>1m</span>
          <span>2m</span>
          <span>3m</span>
          <span>4m</span>
          <span>5m</span>
        </div>
      </div>
    </div>
  )
}

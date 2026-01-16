import LandingMap from './LandingMap'

export default function LandingPage({ onEnterStory }) {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <header className="landing-header">
          <h1 className="landing-title">Tuvalu</h1>
          <p className="landing-subtitle">A Nation at the Frontline of Climate Change</p>
        </header>

        <div className="landing-grid">
          <div className="landing-info">
            <section className="info-section">
              <h2>About Tuvalu</h2>
              <p>
                Tuvalu is a Polynesian island nation located in the Pacific Ocean, midway between
                Hawaii and Australia. Formerly known as the Ellice Islands, Tuvalu gained
                independence in 1978 and consists of nine coral atolls.
              </p>
            </section>

            <section className="info-section">
              <h2>The Challenge</h2>
              <p>
                With a maximum elevation of just 4.6 meters above sea level, Tuvalu is one of the
                world's most vulnerable nations to rising seas. Most of the land sits between 1-3
                meters above current sea level, making the entire population of approximately 11,000
                people highly susceptible to climate change impacts.
              </p>
            </section>

            <section className="info-section">
              <h2>Key Facts</h2>
              <ul className="facts-list">
                <li><strong>Population:</strong> ~11,000 people</li>
                <li><strong>Land Area:</strong> 26 km² (10 sq mi)</li>
                <li><strong>Highest Point:</strong> 4.6 meters above sea level</li>
                <li><strong>Capital:</strong> Funafuti</li>
                <li><strong>Language:</strong> Tuvaluan and English</li>
              </ul>
            </section>
          </div>

          <div className="landing-map">
            <div className="map-container-landing">
              <LandingMap />
            </div>

            <section className="info-section">
              <h2>The Australia-Tuvalu Falepili Union</h2>
              <p>
                In 2023, Australia and Tuvalu signed the Falepili Union treaty, offering a pathway
                for Tuvaluans facing displacement due to climate change. The agreement provides
                special visa access for up to 280 Tuvaluan citizens per year to live, work, and
                study in Australia.
              </p>
            </section>
          </div>
        </div>

        <div className="enter-story-container">
          <button className="enter-story-button" onClick={onEnterStory}>
            <span>Enter the Story</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <p className="enter-story-hint">Follow the fictional journey of a Tuvaluan family</p>
        </div>
      </div>
    </div>
  )
}

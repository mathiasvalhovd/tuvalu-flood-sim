export default function AgreementSection({ onContinue, onBack }) {
  return (
    <div className="agreement-page">
      <div className="agreement-content">
        <button className="back-button" onClick={onBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <header className="agreement-header">
          <h1>The Falepili Union</h1>
          <p className="agreement-subtitle">
            Australia-Tuvalu Treaty, November 2023
          </p>
        </header>

        <div className="agreement-grid">
          <section className="agreement-section">
            <h2>A First-of-Its-Kind Agreement</h2>
            <p>
              The Australia-Tuvalu Falepili Union is one of the first bilateral agreements
              to explicitly create a legal pathway for climate-affected populations. Rather
              than waiting for international law to catch up, it's a diplomatic workaround
              that bypasses the limitations of the 1951 Refugee Convention entirely.
            </p>
          </section>

          <section className="agreement-section">
            <h2>What It Offers</h2>
            <p>
              The agreement provides Tuvaluan citizens with a special visa pathway to live,
              work, and study in Australia. This grants permanent residency—not temporary
              protection, but a genuine new home.
            </p>
            <div className="key-stats">
              <div className="stat-item">
                <span className="stat-number">280</span>
                <span className="stat-label">Visas per year</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Permanent</span>
                <span className="stat-label">Residency status</span>
              </div>
            </div>
          </section>

          <section className="agreement-section">
            <h2>The Reality</h2>
            <p>
              While groundbreaking, this pathway comes with significant limitations.
              Only 280 people can be accepted each year through a lottery system.
              All costs—registration, visa fees, health checks, travel, and
              resettlement—must be paid by the applicants themselves. None of the
              fees are refundable, even if not selected.
            </p>
          </section>

          <section className="agreement-section highlight-box">
            <h2>How Does It Actually Work?</h2>
            <p>
              The process involves multiple steps: registration, a lottery ballot,
              visa application, and self-funded relocation. Each step has costs
              and requirements that families must navigate.
            </p>
            <p>
              Let's walk through exactly what it takes for a Tuvaluan family to
              use this pathway.
            </p>
          </section>
        </div>

        <div className="continue-container">
          <button className="continue-button" onClick={onContinue}>
            <span>See How It Works</span>
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
          <p className="continue-hint">Interactive breakdown of the visa process</p>
        </div>
      </div>
    </div>
  )
}

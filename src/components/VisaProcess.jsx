import { useState } from 'react'

const steps = [
  {
    id: 'intro',
    title: 'The Falepili Union',
    subtitle: 'Australia-Tuvalu Treaty, November 2023',
    content: (
      <>
        <p>
          The Australia-Tuvalu Falepili Union is one of the first bilateral agreements
          to explicitly create a legal pathway for climate-affected populations.
        </p>
        <p>
          Rather than waiting for international law to catch up, it's a diplomatic workaround
          that bypasses the limitations of the 1951 Refugee Convention entirely.
        </p>
        <div className="key-points">
          <div className="key-point">
            <span className="point-number">280</span>
            <span className="point-label">Visas per year</span>
          </div>
          <div className="key-point">
            <span className="point-number">Permanent</span>
            <span className="point-label">Residency status</span>
          </div>
        </div>
        <p className="caveat">
          But this pathway comes with significant costs and limitations.
          Let's follow the Apinelu family through the process.
        </p>
      </>
    ),
    familyStory: null,
    cost: null,
    runningTotal: 0,
  },
  {
    id: 'registration',
    title: 'Step 1: Registration',
    subtitle: 'Enter the ballot lottery',
    content: (
      <>
        <div className="requirements">
          <h4>Requirements</h4>
          <ul>
            <li>Valid Tuvaluan passport</li>
            <li>18 years or older</li>
            <li>Can include dependants</li>
          </ul>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Window</span>
            <span className="info-value">June - July (1 month)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fee</span>
            <span className="info-value cost">$25 AUD</span>
          </div>
        </div>
        <p className="warning">Non-refundable, even if not selected.</p>
      </>
    ),
    familyStory: {
      text: "Tavita and Mele register their family of three, paying $25 AUD. They wait anxiously for results, knowing only 280 families will be selected from thousands of applicants.",
      emotion: 'hopeful'
    },
    cost: 25,
    runningTotal: 25,
  },
  {
    id: 'ballot',
    title: 'Step 2: The Ballot',
    subtitle: '280 slots drawn randomly',
    content: (
      <>
        <div className="requirements">
          <h4>How it works</h4>
          <ul>
            <li>Random selection from all registrants</li>
            <li>Only 280 visas available per year</li>
            <li>No priority for previous attempts</li>
            <li>Results announced after ballot closes</li>
          </ul>
        </div>
        <div className="info-row single">
          <div className="info-item">
            <span className="info-label">Odds</span>
            <span className="info-value">~1 in 40 (estimated)</span>
          </div>
        </div>
        <p className="note">If not selected, must wait a year and pay $25 again to re-enter.</p>
      </>
    ),
    familyStory: {
      text: "The family checks results online. Their hearts race as they search for their registration number among the 280 selected. This time—they find it.",
      emotion: 'anxious'
    },
    cost: 0,
    runningTotal: 25,
  },
  {
    id: 'visa',
    title: 'Step 3: Visa Application',
    subtitle: 'Submit documents and fees',
    content: (
      <>
        <div className="requirements">
          <h4>Requirements</h4>
          <ul>
            <li>Apply within 60 days of selection</li>
            <li>Health assessments (additional cost)</li>
            <li>Character checks</li>
            <li>All supporting documents</li>
          </ul>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Primary applicant</span>
            <span className="info-value cost">$200 AUD</span>
          </div>
          <div className="info-item">
            <span className="info-label">Each dependant</span>
            <span className="info-value cost">$50 AUD</span>
          </div>
        </div>
        <div className="cost-example">
          Family of 3: $200 + $50 + $50 = <strong>$300 AUD</strong>
        </div>
        <p className="warning">All fees non-refundable if visa denied.</p>
      </>
    ),
    familyStory: {
      text: "The clock starts—60 days to complete everything. Tavita pays $300 in visa fees, plus $150 for health examinations. The pressure is immense.",
      emotion: 'determined'
    },
    cost: 450, // 300 visa + ~150 health checks
    runningTotal: 475,
  },
  {
    id: 'relocation',
    title: 'Step 4: Relocation',
    subtitle: 'Move to Australia',
    content: (
      <>
        <div className="requirements">
          <h4>Self-funded expenses</h4>
          <ul>
            <li>Flights from Tuvalu to Australia</li>
            <li>Initial accommodation</li>
            <li>Living expenses until employment</li>
            <li>No government relocation assistance</li>
          </ul>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Flights (family of 3)</span>
            <span className="info-value cost">$2,000 - $4,000 AUD</span>
          </div>
        </div>
        <p className="note">
          Tuvalu to Australia requires multiple connections. Prices vary by season and availability.
        </p>
      </>
    ),
    familyStory: {
      text: "The family sells what they can, says goodbye to their island home, and boards a flight to Australia. They arrive with hope—but limited savings to start their new life.",
      emotion: 'bittersweet'
    },
    cost: 3000, // midpoint estimate
    runningTotal: 3475,
  },
  {
    id: 'summary',
    title: 'Total Cost',
    subtitle: 'What it takes to relocate',
    content: null, // Special rendering for summary
    familyStory: {
      text: "The Apinelu family made it. But this pathway—created to help climate refugees—still requires thousands of dollars that many Tuvaluan families simply don't have.",
      emotion: 'reflective'
    },
    cost: null,
    runningTotal: 3475,
  },
]

const emotionColors = {
  hopeful: '#4CAF50',
  anxious: '#FF9800',
  determined: '#2196F3',
  bittersweet: '#9C27B0',
  reflective: '#607D8B',
}

export default function VisaProcess({ onBack }) {
  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const progress = ((currentStep) / (steps.length - 1)) * 100

  const goNext = () => {
    if (!isLast) setCurrentStep(currentStep + 1)
  }

  const goPrev = () => {
    if (!isFirst) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="visa-process-page">
      {/* Progress bar */}
      <div className="visa-progress-bar">
        <div className="visa-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header className="visa-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="step-indicator">
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <span>Step {currentStep} of {steps.length - 2}</span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="visa-content">
        <div className="visa-card">
          <div className="visa-card-header">
            <h1>{step.title}</h1>
            <p className="visa-subtitle">{step.subtitle}</p>
          </div>

          <div className="visa-card-body">
            {/* Regular step content */}
            {step.content && (
              <div className="step-info">
                {step.content}
              </div>
            )}

            {/* Summary step - special rendering */}
            {step.id === 'summary' && (
              <div className="cost-summary">
                <div className="cost-breakdown">
                  <div className="cost-line">
                    <span>Registration fee</span>
                    <span>$25</span>
                  </div>
                  <div className="cost-line">
                    <span>Visa fees (family of 3)</span>
                    <span>$300</span>
                  </div>
                  <div className="cost-line">
                    <span>Health examinations</span>
                    <span>~$150</span>
                  </div>
                  <div className="cost-line">
                    <span>Flights to Australia</span>
                    <span>~$3,000</span>
                  </div>
                  <div className="cost-line total">
                    <span>Minimum Total</span>
                    <span>~$3,475+ AUD</span>
                  </div>
                </div>
                <p className="summary-note">
                  This does not include initial accommodation, living expenses until employment,
                  or the cost of failed attempts (non-refundable fees if not selected in ballot).
                </p>
                <div className="context-box">
                  <h4>For context</h4>
                  <p>
                    The average annual income in Tuvalu is approximately <strong>$4,000 - $6,000 AUD</strong>.
                    The cost of this "pathway" represents nearly a year's salary for many families.
                  </p>
                </div>
              </div>
            )}

            {/* Family story */}
            {step.familyStory && (
              <div className="family-story-inline">
                <div
                  className="story-accent"
                  style={{ backgroundColor: emotionColors[step.familyStory.emotion] }}
                />
                <div className="story-content">
                  <div className="story-header">
                    <img src="/images/story/P1.jpg" alt="The Apinelu family" className="family-avatar" />
                    <span className="family-name">The Apinelu Family</span>
                  </div>
                  <p>{step.familyStory.text}</p>
                </div>
              </div>
            )}

            {/* Running cost (for non-intro, non-summary steps) */}
            {step.runningTotal > 0 && step.id !== 'summary' && step.id !== 'intro' && (
              <div className="running-cost">
                <span className="running-label">Running total</span>
                <span className="running-amount">~${step.runningTotal.toLocaleString()} AUD</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation arrows */}
      <nav className="visa-navigation">
        <button
          className={`nav-arrow nav-prev ${isFirst ? 'disabled' : ''}`}
          onClick={goPrev}
          disabled={isFirst}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="step-dots">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <button
          className={`nav-arrow nav-next ${isLast ? 'disabled' : ''}`}
          onClick={goNext}
          disabled={isLast}
        >
          <span>Next</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  )
}

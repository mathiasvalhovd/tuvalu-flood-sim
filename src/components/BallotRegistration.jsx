import { useState } from 'react'
import { supabase } from '../lib/supabase'

const TUVALU_ISLANDS = [
  'Funafuti',
  'Nanumea',
  'Nanumaga',
  'Niutao',
  'Nui',
  'Vaitupu',
  'Nukufetau',
  'Nukulaelae',
  'Niulakita'
]

const TOTAL_STEPS = 10

export default function BallotRegistration({ onBack, onComplete }) {
  const [step, setStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')

  const [formData, setFormData] = useState({
    // Screen 1: Account
    email: '',
    fullName: '',
    // Screen 2: Passport
    passportNumber: '',
    issueDate: '',
    expiryDate: '',
    country: 'Tuvalu',
    // Screen 3: Personal
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    currentLocation: '',
    // Screen 4: Family
    includeSpouse: false,
    dependentChildren: 0,
    // Screen 5: Declaration
    isCitizen: false,
    hasTuvaluAncestry: false,
    understandsOdds: false,
    understandsNonRefundable: false,
    // Screen 6: Privacy
    consentToStore: false,
    // Screen 7: Payment
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generatePassportNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)]
    const randomNumbers = Math.floor(Math.random() * 9000000) + 1000000
    updateField('passportNumber', `${randomLetters}${randomNumbers}`)
  }

  const generateReferenceNumber = () => {
    const year = new Date().getFullYear()
    const num = Math.floor(Math.random() * 90000) + 10000
    return `TUV-${year}-${num}`
  }

  const calculateFamilySize = () => {
    let size = 1 // applicant
    if (formData.includeSpouse) size += 1
    size += formData.dependentChildren
    return size
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    const refNum = generateReferenceNumber()
    setReferenceNumber(refNum)

    // Save to Supabase
    const registrationData = {
      reference_number: refNum,
      name: formData.fullName,
      email: formData.email,
      birthplace: formData.placeOfBirth,
      family_size: calculateFamilySize(),
      gender: formData.gender,
      include_spouse: formData.includeSpouse,
      dependent_children: formData.dependentChildren
    }

    try {
      if (supabase) {
        await supabase.from('ballot_registrations').insert([registrationData])
      }
    } catch (error) {
      console.error('Failed to save registration:', error)
      // Continue anyway - don't block the user experience for a class demo
    }

    setIsProcessing(false)
    setStep(8)
  }

  const canProceed = () => {
    switch (step) {
      case 0: return true
      case 1: return formData.email.includes('@') && formData.fullName.trim().length > 0
      case 2: return formData.passportNumber && formData.issueDate && formData.expiryDate && new Date(formData.expiryDate) > new Date()
      case 3: return formData.dateOfBirth && formData.gender && formData.placeOfBirth && formData.currentLocation
      case 4: return true
      case 5: return formData.isCitizen && formData.hasTuvaluAncestry && formData.understandsOdds && formData.understandsNonRefundable
      case 6: return formData.consentToStore
      case 7: return formData.cardNumber.length >= 4 && formData.cardExpiry && formData.cardCvv.length >= 3
      default: return true
    }
  }

  const nextStep = () => {
    if (step === 7) {
      handlePayment()
    } else if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  const progress = (step / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="gov-form-page">
      {/* Progress bar */}
      {step > 0 && step < 8 && (
        <div className="gov-progress-bar">
          <div className="gov-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Header */}
      <header className="gov-header">
        <div className="gov-header-content">
          <div className="gov-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="gov-header-text">
            <span className="gov-department">Department of Home Affairs</span>
            <span className="gov-service">Falepili Union Pathway</span>
          </div>
        </div>
        {step > 0 && step < 8 && (
          <button className="gov-back-link" onClick={prevStep}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </header>

      <main className="gov-main">
        <div className="gov-form-container">

          {/* Screen 0: Landing */}
          {step === 0 && (
            <div className="gov-screen gov-landing">
              <div className="gov-landing-content">
                <h1>Experience the Falepili Mobility Pathway</h1>
                <p className="gov-lead">
                  This is a simulation of Australia's visa ballot for Tuvaluans
                </p>

                <div className="gov-odds-warning">
                  <div className="gov-odds-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="gov-odds-text">
                    <strong>Registering does NOT guarantee a visa.</strong>
                    <p>Last year: 280 selected out of 8,750 applicants (3.2%)</p>
                  </div>
                </div>

                <button className="gov-button gov-button-primary gov-button-large" onClick={nextStep}>
                  Start Registration
                </button>

                <p className="gov-note">
                  Takes ~2 minutes. Your entry will be part of today's live lottery draw.
                </p>
              </div>

              <button className="gov-exit-link" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Return to introduction
              </button>
            </div>
          )}

          {/* Screen 1: Create Account */}
          {step === 1 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 1 of 7</div>
              <h2>Create Account</h2>
              <p className="gov-description">Enter your contact details to begin your registration.</p>

              <div className="gov-form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="gov-form-group">
                <label htmlFor="fullName">Full name (as shown on passport)</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 2: Passport Details */}
          {step === 2 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 2 of 7</div>
              <h2>Passport Details</h2>
              <p className="gov-description">Enter your passport information exactly as it appears on your document.</p>

              <div className="gov-form-group">
                <label htmlFor="passportNumber">Passport number</label>
                <div className="gov-input-with-button">
                  <input
                    type="text"
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => updateField('passportNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. AB1234567"
                  />
                  <button type="button" className="gov-button-secondary-small" onClick={generatePassportNumber}>
                    Generate random
                  </button>
                </div>
              </div>

              <div className="gov-form-row">
                <div className="gov-form-group">
                  <label htmlFor="issueDate">Issue date</label>
                  <input
                    type="date"
                    id="issueDate"
                    value={formData.issueDate}
                    onChange={(e) => updateField('issueDate', e.target.value)}
                  />
                </div>

                <div className="gov-form-group">
                  <label htmlFor="expiryDate">Expiry date</label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => updateField('expiryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formData.expiryDate && new Date(formData.expiryDate) <= new Date() && (
                    <span className="gov-error">Passport must not be expired</span>
                  )}
                </div>
              </div>

              <div className="gov-form-group">
                <label htmlFor="country">Country of citizenship</label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  disabled
                  className="gov-input-disabled"
                />
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 3: Personal Information */}
          {step === 3 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 3 of 7</div>
              <h2>Personal Information</h2>
              <p className="gov-description">Provide your personal details for verification purposes.</p>

              <div className="gov-form-group">
                <label htmlFor="dateOfBirth">Date of birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="gov-form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label htmlFor="placeOfBirth">Place of birth in Tuvalu</label>
                <select
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => updateField('placeOfBirth', e.target.value)}
                >
                  <option value="">Select island...</option>
                  {TUVALU_ISLANDS.map(island => (
                    <option key={island} value={island}>{island}</option>
                  ))}
                </select>
              </div>

              <div className="gov-form-group">
                <label htmlFor="currentLocation">Current residential address</label>
                <input
                  type="text"
                  id="currentLocation"
                  value={formData.currentLocation}
                  onChange={(e) => updateField('currentLocation', e.target.value)}
                  placeholder="Enter your current address"
                />
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 4: Family Members */}
          {step === 4 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 4 of 7</div>
              <h2>Family Members</h2>
              <p className="gov-description">Include eligible family members in your application.</p>

              <div className="gov-form-group">
                <label>Include spouse/partner?</label>
                <div className="gov-toggle-group">
                  <button
                    type="button"
                    className={`gov-toggle ${formData.includeSpouse ? 'active' : ''}`}
                    onClick={() => updateField('includeSpouse', true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`gov-toggle ${!formData.includeSpouse ? 'active' : ''}`}
                    onClick={() => updateField('includeSpouse', false)}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="gov-form-group">
                <label htmlFor="dependentChildren">Number of dependent children</label>
                <select
                  id="dependentChildren"
                  value={formData.dependentChildren}
                  onChange={(e) => updateField('dependentChildren', parseInt(e.target.value))}
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div className="gov-fee-box">
                <div className="gov-fee-label">Registration fee</div>
                <div className="gov-fee-amount">AUD $25</div>
                <div className="gov-fee-note">Per application (includes all family members listed)</div>
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 5: Declaration */}
          {step === 5 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 5 of 7</div>
              <h2>Declaration</h2>
              <p className="gov-description">You must confirm the following statements to proceed.</p>

              <div className="gov-checkbox-group">
                <label className="gov-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.isCitizen}
                    onChange={(e) => updateField('isCitizen', e.target.checked)}
                  />
                  <span className="gov-checkbox-box"></span>
                  <span className="gov-checkbox-label">I am a Tuvaluan citizen</span>
                </label>

                <label className="gov-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.hasTuvaluAncestry}
                    onChange={(e) => updateField('hasTuvaluAncestry', e.target.checked)}
                  />
                  <span className="gov-checkbox-box"></span>
                  <span className="gov-checkbox-label">I or my parent/grandparent was born in Tuvalu</span>
                </label>

                <label className="gov-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.understandsOdds}
                    onChange={(e) => updateField('understandsOdds', e.target.checked)}
                  />
                  <span className="gov-checkbox-box"></span>
                  <span className="gov-checkbox-label">I understand this is a random ballot with approximately 3% selection rate</span>
                </label>

                <label className="gov-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.understandsNonRefundable}
                    onChange={(e) => updateField('understandsNonRefundable', e.target.checked)}
                  />
                  <span className="gov-checkbox-box"></span>
                  <span className="gov-checkbox-label">I understand the $25 fee is non-refundable regardless of outcome</span>
                </label>
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 6: Privacy Consent */}
          {step === 6 && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 6 of 7</div>
              <h2>Data & Privacy</h2>

              <div className="gov-info-box">
                <p>
                  This is an exhibition simulation. To participate in today's lottery draw,
                  we need your consent to temporarily store and display your information.
                </p>
              </div>

              <div className="gov-checkbox-group gov-checkbox-single">
                <label className="gov-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.consentToStore}
                    onChange={(e) => updateField('consentToStore', e.target.checked)}
                  />
                  <span className="gov-checkbox-box"></span>
                  <span className="gov-checkbox-label">
                    I consent to my name and email being temporarily stored and displayed
                    during today's lottery presentation. All data will be deleted at the
                    end of this exhibition session.
                  </span>
                </label>
              </div>

              <div className="gov-privacy-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Your data will NOT be shared or exported</span>
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </button>
            </div>
          )}

          {/* Screen 7: Payment */}
          {step === 7 && !isProcessing && (
            <div className="gov-screen">
              <div className="gov-step-indicator">Step 7 of 7</div>
              <h2>Payment</h2>

              <div className="gov-warning-box">
                <div className="gov-warning-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="gov-warning-text">
                  <strong>THIS IS A SIMULATION</strong>
                  <p>DO NOT enter real card details. Use any fake numbers (e.g. 1234 5678 9012 3456)</p>
                </div>
              </div>

              <div className="gov-form-group">
                <label htmlFor="cardNumber">Card number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => updateField('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="gov-form-row">
                <div className="gov-form-group">
                  <label htmlFor="cardExpiry">Expiry date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
                      updateField('cardExpiry', val)
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div className="gov-form-group">
                  <label htmlFor="cardCvv">CVV</label>
                  <input
                    type="text"
                    id="cardCvv"
                    value={formData.cardCvv}
                    onChange={(e) => updateField('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <button
                className="gov-button gov-button-primary gov-button-pay"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Pay AUD $25
              </button>
            </div>
          )}

          {/* Screen 7: Processing */}
          {step === 7 && isProcessing && (
            <div className="gov-screen gov-processing">
              <div className="gov-spinner"></div>
              <h2>Processing payment...</h2>
              <p>Please do not close this window</p>
            </div>
          )}

          {/* Screen 8: Confirmation */}
          {step === 8 && (
            <div className="gov-screen gov-confirmation">
              <div className="gov-success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>

              <h2>Registration Complete</h2>

              <div className="gov-confirmation-details">
                <div className="gov-detail-row">
                  <span className="gov-detail-label">Reference number</span>
                  <span className="gov-detail-value gov-reference">{referenceNumber}</span>
                </div>
                <div className="gov-detail-row">
                  <span className="gov-detail-label">Status</span>
                  <span className="gov-detail-value gov-status">RECEIVED</span>
                </div>
                <div className="gov-detail-row">
                  <span className="gov-detail-label">Applicant</span>
                  <span className="gov-detail-value">{formData.fullName}</span>
                </div>
                <div className="gov-detail-row">
                  <span className="gov-detail-label">Family size</span>
                  <span className="gov-detail-value">{calculateFamilySize()} {calculateFamilySize() === 1 ? 'person' : 'people'}</span>
                </div>
              </div>

              <p className="gov-confirmation-note">
                You will be notified if selected in the ballot.
              </p>

              <button
                className="gov-button gov-button-primary"
                onClick={() => setStep(9)}
              >
                What happens next?
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Screen 9: What happens if selected */}
          {step === 9 && (
            <div className="gov-screen gov-next-steps">
              <h2>What happens if you are selected?</h2>
              <p className="gov-description">
                If your registration is drawn in the ballot, here are the next steps you'll need to complete.
              </p>

              <div className="gov-timeline">
                <div className="gov-timeline-item">
                  <div className="gov-timeline-marker">1</div>
                  <div className="gov-timeline-content">
                    <h3>Receive notification</h3>
                    <p>You'll be notified by email that you've been selected. This is your invitation to apply for the visa.</p>
                    <div className="gov-timeline-detail">
                      <span className="gov-timeline-label">Timeframe:</span>
                      <span>Results announced after ballot closes</span>
                    </div>
                  </div>
                </div>

                <div className="gov-timeline-item">
                  <div className="gov-timeline-marker">2</div>
                  <div className="gov-timeline-content">
                    <h3>Submit visa application</h3>
                    <p>Complete and submit your full visa application with all required documents.</p>
                    <div className="gov-timeline-detail">
                      <span className="gov-timeline-label">Deadline:</span>
                      <span className="gov-timeline-warning">Within 60 days of selection</span>
                    </div>
                    <div className="gov-timeline-costs">
                      <div className="gov-timeline-cost">
                        <span>Primary applicant</span>
                        <span className="gov-cost-amount">$200 AUD</span>
                      </div>
                      <div className="gov-timeline-cost">
                        <span>Each dependant</span>
                        <span className="gov-cost-amount">$50 AUD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gov-timeline-item">
                  <div className="gov-timeline-marker">3</div>
                  <div className="gov-timeline-content">
                    <h3>Complete health & character checks</h3>
                    <p>All applicants must undergo medical examinations and character assessments.</p>
                    <ul className="gov-requirements-list">
                      <li>Health examination at approved clinic</li>
                      <li>Police clearance certificates</li>
                      <li>Biometrics (if required)</li>
                    </ul>
                    <div className="gov-timeline-costs">
                      <div className="gov-timeline-cost">
                        <span>Health exams (approx.)</span>
                        <span className="gov-cost-amount">~$150 AUD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gov-timeline-item">
                  <div className="gov-timeline-marker">4</div>
                  <div className="gov-timeline-content">
                    <h3>Receive visa decision</h3>
                    <p>Once approved, you'll receive your permanent residency visa for Australia.</p>
                    <div className="gov-timeline-detail">
                      <span className="gov-timeline-label">Status:</span>
                      <span>Permanent Resident</span>
                    </div>
                  </div>
                </div>

                <div className="gov-timeline-item">
                  <div className="gov-timeline-marker">5</div>
                  <div className="gov-timeline-content">
                    <h3>Relocate to Australia</h3>
                    <p>Arrange and fund your own travel and initial settlement in Australia.</p>
                    <ul className="gov-requirements-list">
                      <li>Book flights from Tuvalu to Australia</li>
                      <li>Arrange initial accommodation</li>
                      <li>Prepare for living expenses until employment</li>
                    </ul>
                    <div className="gov-timeline-costs">
                      <div className="gov-timeline-cost">
                        <span>Flights (family of 3)</span>
                        <span className="gov-cost-amount">$2,000 - $4,000 AUD</span>
                      </div>
                    </div>
                    <div className="gov-warning-inline">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>No government relocation assistance is provided</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gov-total-cost-box">
                <h4>Estimated total cost</h4>
                <div className="gov-total-cost-breakdown">
                  <div className="gov-cost-row">
                    <span>Registration fee (already paid)</span>
                    <span>$25</span>
                  </div>
                  <div className="gov-cost-row">
                    <span>Visa fees (family of 3)</span>
                    <span>$300</span>
                  </div>
                  <div className="gov-cost-row">
                    <span>Health examinations</span>
                    <span>~$150</span>
                  </div>
                  <div className="gov-cost-row">
                    <span>Flights to Australia</span>
                    <span>~$3,000</span>
                  </div>
                  <div className="gov-cost-row gov-cost-total">
                    <span>Minimum total</span>
                    <span>~$3,475+ AUD</span>
                  </div>
                </div>
                <p className="gov-cost-note">
                  Does not include initial accommodation, living expenses until employment, or costs from previous unsuccessful ballot attempts.
                </p>
              </div>

              <button
                className="gov-button gov-button-primary"
                onClick={onComplete}
              >
                Return to introduction
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="gov-footer">
        <span>Falepili Union Pathway - Simulation</span>
      </footer>
    </div>
  )
}

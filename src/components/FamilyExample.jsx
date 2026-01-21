import { familyProfile, costSummary } from '../data/flowchartData'

export default function FamilyExample({ activeNode, visitedNodes }) {
  const calculateRunningTotal = () => {
    let total = 0
    const costs = []

    if (visitedNodes.includes('registration')) {
      costs.push({ label: 'Registration', amount: 25 })
      total += 25
    }

    if (visitedNodes.includes('visa-application')) {
      costs.push({ label: 'Visa (family of 3)', amount: 300 })
      total += 300
    }

    return { costs, total }
  }

  const { costs, total } = calculateRunningTotal()

  const getEmotionColor = (emotion) => {
    const colors = {
      hopeful: '#4CAF50',
      anxious: '#FF9800',
      relieved: '#2196F3',
      disappointed: '#9E9E9E',
      determined: '#673AB7',
      bittersweet: '#607D8B'
    }
    return colors[emotion] || '#667eea'
  }

  return (
    <div className="family-example">
      <div className="family-header">
        <div className="family-image">
          <img src={familyProfile.image} alt="The Apinelu family" />
        </div>
        <div className="family-intro">
          <h3>The Apinelu Family</h3>
          <p className="family-members">
            {familyProfile.names.father}, {familyProfile.names.mother}, and {familyProfile.names.daughter}
          </p>
        </div>
      </div>

      {activeNode && activeNode.familyExample && (
        <div className="family-story">
          <div
            className="emotion-indicator"
            style={{ backgroundColor: getEmotionColor(activeNode.familyExample.emotion) }}
          />
          <p>{activeNode.familyExample.text}</p>
        </div>
      )}

      <div className="cost-tracker">
        <h4>Running Costs</h4>
        {costs.length > 0 ? (
          <>
            <ul className="cost-items">
              {costs.map((cost, i) => (
                <li key={i}>
                  <span>{cost.label}</span>
                  <span>${cost.amount} AUD</span>
                </li>
              ))}
            </ul>
            <div className="cost-total">
              <span>Total so far</span>
              <span className="total-amount">${total} AUD</span>
            </div>
          </>
        ) : (
          <p className="no-costs-yet">Select a step to see costs</p>
        )}
      </div>

      <div className="additional-costs">
        <h4>Additional Expenses</h4>
        <p className="costs-note">Not included in totals:</p>
        <ul>
          {costSummary.additional.map((cost, i) => (
            <li key={i}>{cost}</li>
          ))}
        </ul>
      </div>

      <div className="cost-warning">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>{costSummary.warning}</span>
      </div>
    </div>
  )
}

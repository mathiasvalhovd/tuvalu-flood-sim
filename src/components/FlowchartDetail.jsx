export default function FlowchartDetail({ node, onClose }) {
  if (!node) return null

  const renderCosts = () => {
    if (!node.costs) {
      return <p className="no-cost">No direct cost at this step</p>
    }

    if (node.costs.amount) {
      return (
        <div className="cost-item">
          <span className="cost-amount">${node.costs.amount} AUD</span>
          {!node.costs.refundable && (
            <span className="cost-note">Non-refundable</span>
          )}
          {node.costs.note && (
            <span className="cost-extra">{node.costs.note}</span>
          )}
        </div>
      )
    }

    if (node.costs.primary) {
      return (
        <div className="cost-breakdown">
          <div className="cost-item">
            <span className="cost-label">Primary applicant</span>
            <span className="cost-amount">${node.costs.primary.amount} AUD</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Each dependant</span>
            <span className="cost-amount">${node.costs.dependant.amount} AUD</span>
          </div>
          {node.costs.example && (
            <div className="cost-example">{node.costs.example}</div>
          )}
        </div>
      )
    }

    if (node.costs.items) {
      return (
        <div className="cost-list">
          {node.costs.items.map((item, i) => (
            <div key={i} className="cost-item">
              <span className="cost-label">{item.name}</span>
              <span className="cost-note">{item.note}</span>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="flowchart-detail">
      <button className="detail-close" onClick={onClose}>
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
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="detail-header">
        <span className="detail-step">Step {node.step}</span>
        <h3 className="detail-title">{node.title}</h3>
        <p className="detail-description">{node.shortDescription}</p>
      </div>

      <div className="detail-section">
        <h4>Timing</h4>
        <p>{node.timing}</p>
      </div>

      <div className="detail-section">
        <h4>Costs</h4>
        {renderCosts()}
      </div>

      <div className="detail-section">
        <h4>Requirements</h4>
        <ul className="detail-list">
          {node.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

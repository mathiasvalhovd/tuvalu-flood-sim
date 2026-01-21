const icons = {
  clipboard: (
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
  ),
  lottery: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  retry: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  document: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
  ),
  plane: (
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  )
}

export default function FlowchartNode({
  node,
  isActive,
  onClick,
  svgWidth,
  svgHeight
}) {
  const x = (node.position.x / 100) * svgWidth
  const y = (node.position.y / 100) * svgHeight

  const nodeWidth = 160
  const nodeHeight = 70

  const getCostDisplay = () => {
    if (!node.costs) return null
    if (node.costs.amount) {
      return `$${node.costs.amount} AUD`
    }
    if (node.costs.primary) {
      return `$${node.costs.primary.amount}+ AUD`
    }
    return null
  }

  const costDisplay = getCostDisplay()

  return (
    <g
      className={`flowchart-node ${isActive ? 'active' : ''} ${node.branch || ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <foreignObject
        x={x - nodeWidth / 2}
        y={y - nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
      >
        <div className="node-content">
          <div className="node-icon">
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
              {icons[node.icon]}
            </svg>
          </div>
          <div className="node-text">
            <span className="node-step">Step {node.step}</span>
            <span className="node-title">{node.title}</span>
          </div>
          {costDisplay && (
            <span className="node-cost">{costDisplay}</span>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

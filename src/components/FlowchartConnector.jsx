export default function FlowchartConnector({
  connection,
  nodes,
  svgWidth,
  svgHeight
}) {
  const fromNode = nodes.find(n => n.id === connection.from)
  const toNode = nodes.find(n => n.id === connection.to)

  if (!fromNode || !toNode) return null

  const fromX = (fromNode.position.x / 100) * svgWidth
  const fromY = (fromNode.position.y / 100) * svgHeight
  const toX = (toNode.position.x / 100) * svgWidth
  const toY = (toNode.position.y / 100) * svgHeight

  const nodeHeight = 70
  const startY = fromY + nodeHeight / 2
  const endY = toY - nodeHeight / 2

  let pathD

  if (connection.curved) {
    // Curved path for "re-apply" loop
    const controlX = Math.max(fromX, toX) + 80
    const midY = (startY + endY) / 2
    pathD = `M ${fromX} ${startY}
             Q ${controlX} ${startY} ${controlX} ${midY}
             Q ${controlX} ${endY} ${toX} ${endY}`
  } else if (fromX === toX) {
    // Straight vertical line
    pathD = `M ${fromX} ${startY} L ${toX} ${endY}`
  } else {
    // Angled line with curve
    const midY = (startY + endY) / 2
    pathD = `M ${fromX} ${startY}
             L ${fromX} ${midY - 10}
             Q ${fromX} ${midY} ${(fromX + toX) / 2} ${midY}
             Q ${toX} ${midY} ${toX} ${midY + 10}
             L ${toX} ${endY}`
  }

  const labelX = connection.curved
    ? Math.max(fromX, toX) + 90
    : (fromX + toX) / 2
  const labelY = (startY + endY) / 2

  return (
    <g className={`flowchart-connector ${connection.type}`}>
      <path
        d={pathD}
        fill="none"
        strokeWidth="2"
        strokeDasharray={connection.type === 'dashed' ? '6,4' : 'none'}
        markerEnd="url(#arrowhead)"
      />
      {connection.label && (
        <text
          x={labelX}
          y={labelY}
          className="connector-label"
          textAnchor="middle"
          dy="-8"
        >
          {connection.label}
        </text>
      )}
    </g>
  )
}

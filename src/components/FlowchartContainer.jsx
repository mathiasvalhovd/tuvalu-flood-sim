import { useState, useRef, useEffect } from 'react'
import { flowchartNodes, flowchartConnections } from '../data/flowchartData'
import FlowchartNode from './FlowchartNode'
import FlowchartConnector from './FlowchartConnector'
import FlowchartDetail from './FlowchartDetail'
import FamilyExample from './FamilyExample'

export default function FlowchartContainer({ onBack }) {
  const [activeNodeId, setActiveNodeId] = useState(null)
  const [visitedNodes, setVisitedNodes] = useState([])
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement
        if (container) {
          const width = Math.min(container.clientWidth, 500)
          setDimensions({ width, height: 600 })
        }
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleNodeClick = (nodeId) => {
    setActiveNodeId(nodeId)
    if (!visitedNodes.includes(nodeId)) {
      setVisitedNodes([...visitedNodes, nodeId])
    }
  }

  const activeNode = flowchartNodes.find(n => n.id === activeNodeId)

  return (
    <div className="flowchart-page">
      <div className="flowchart-header">
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
        <h1>The Visa Process</h1>
        <p className="flowchart-subtitle">Click each step to learn more</p>
      </div>

      <div className="flowchart-layout">
        <div className="flowchart-main">
          <div className="flowchart-svg-container">
            <svg
              ref={svgRef}
              className="flowchart-svg"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#667eea" />
                </marker>
                <marker
                  id="arrowhead-dashed"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9e9e9e" />
                </marker>
                <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>

              <g className="connectors">
                {flowchartConnections.map((conn, i) => (
                  <FlowchartConnector
                    key={i}
                    connection={conn}
                    nodes={flowchartNodes}
                    svgWidth={dimensions.width}
                    svgHeight={dimensions.height}
                  />
                ))}
              </g>

              <g className="nodes">
                {flowchartNodes.map(node => (
                  <FlowchartNode
                    key={node.id}
                    node={node}
                    isActive={activeNodeId === node.id}
                    onClick={() => handleNodeClick(node.id)}
                    svgWidth={dimensions.width}
                    svgHeight={dimensions.height}
                  />
                ))}
              </g>
            </svg>
          </div>

          <FlowchartDetail
            node={activeNode}
            onClose={() => setActiveNodeId(null)}
          />
        </div>

        <aside className="flowchart-sidebar">
          <FamilyExample
            activeNode={activeNode}
            visitedNodes={visitedNodes}
          />
        </aside>
      </div>
    </div>
  )
}

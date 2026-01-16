export default function InfoPanel() {
  return (
    <div
      style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        height: '100%',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h2 style={{ marginTop: 0, color: '#1976D2' }}>Tuvalu Sea Level Rise</h2>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#333' }}>About This Visualization</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
          This interactive map shows the potential impact of sea level rise on Funafuti Atoll,
          Tuvalu. Use the slider to adjust sea level rise from 0 to 5 meters and see which areas
          would be inundated.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#333' }}>Methodology</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
          The flood visualization uses Mapbox Terrain-RGB elevation data, which encodes terrain
          height in the RGB values of raster tiles. Each pixel is decoded using the formula:
        </p>
        <code
          style={{
            display: 'block',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '8px',
          }}
        >
          height = -10000 + ((R × 256² + G × 256 + B) × 0.1)
        </code>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555', marginTop: '10px' }}>
          Areas with elevation at or below the selected sea level threshold are highlighted in
          blue, with darker shades indicating greater flood depth.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#333' }}>Data Sources</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: '#555', paddingLeft: '20px' }}>
          <li>
            <strong>Elevation Data:</strong> Mapbox Terrain-RGB v1 (derived from multiple DEM
            sources)
          </li>
          <li>
            <strong>Satellite Imagery:</strong> Mapbox Satellite (composite of multiple providers)
          </li>
          <li>
            <strong>Resolution:</strong> ~30m horizontal, 0.1m vertical precision
          </li>
        </ul>
      </section>

      <section
        style={{
          marginBottom: '20px',
          padding: '12px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ fontSize: '16px', color: '#856404', marginTop: 0 }}>
          Important Disclaimers
        </h3>
        <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#856404', paddingLeft: '20px', marginBottom: 0 }}>
          <li>
            <strong>Accuracy:</strong> Elevation data accuracy is typically ±0.5-1m. Results should
            be used for visualization purposes only, not precise flood risk assessment.
          </li>
          <li>
            <strong>Vertical Datum:</strong> Mapbox terrain uses mixed vertical datums which may
            not align perfectly with local sea level measurements in Tuvalu.
          </li>
          <li>
            <strong>Simplifications:</strong> This model shows static inundation only and does not
            account for tides, storm surge, wave action, or coastal erosion.
          </li>
          <li>
            <strong>Climate Projections:</strong> Sea level rise projections vary by scenario. IPCC
            estimates range from 0.28-1.01m by 2100 under different emission pathways.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#333' }}>About Tuvalu</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
          Tuvalu is a Polynesian island nation in the Pacific Ocean, consisting of nine atolls with
          a maximum elevation of only 4.6 meters above sea level. With most land between 1-3 meters
          elevation, Tuvalu is one of the world's most vulnerable nations to sea level rise and
          climate change impacts.
        </p>
      </section>

      <section>
        <h3 style={{ fontSize: '16px', color: '#333' }}>Learn More</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#555', paddingLeft: '20px' }}>
          <li>
            <a
              href="https://www.ipcc.ch/srocc/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1976D2' }}
            >
              IPCC Special Report on Ocean and Cryosphere
            </a>
          </li>
          <li>
            <a
              href="https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1976D2' }}
            >
              Mapbox Terrain-RGB Documentation
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

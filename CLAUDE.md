# Tuvalu Flood Simulation - Development Context

## Project Overview
An interactive web visualization showing the impact of sea level rise on Tuvalu (Funafuti atoll). Part of an ocean justice research project exploring climate change impacts on Pacific island nations.

## Current Implementation Status

### Completed
- React + Vite project setup
- Mapbox GL JS integration
- Satellite map rendering centered on Funafuti, Tuvalu
- Basic component structure with placeholders
- Responsive layout (map + sidebar)

### Components
- `Map.jsx` - Mapbox satellite view (mapbox://styles/mapbox/satellite-v9)
  - Center: [179.1962, -8.5211] (Funafuti, Tuvalu)
  - Zoom level: 13
- `SeaLevelSlider.jsx` - Placeholder for sea level control
- `InfoPanel.jsx` - Placeholder for information display

### Next Steps
- Implement sea level slider (0-2m range)
- Add flood visualization using Mapbox Terrain-RGB elevation data
- Implement real-time flooding based on slider position
- Add timeline of key climate events
- Integrate data from NASA, IPCC, World Bank sources

## Technical Stack
- React 19.2.3
- Vite 7.3.1
- Mapbox GL JS 3.17.0

## Environment Setup
Create a `.env` file based on `.env.example`:
```
VITE_MAPBOX_TOKEN=your_actual_token_here
```

Get a token from: https://account.mapbox.com/access-tokens/

## Running the Project
```bash
npm install
npm run dev
```

## Architecture Notes
- Map state will need to be managed in App.jsx to coordinate slider + flood layer
- Terrain-RGB tiles encode elevation in RGB values (formula in Mapbox docs)
- Consider using Mapbox expressions for real-time flood layer styling
- May need custom layer or paint properties for elevation-based coloring

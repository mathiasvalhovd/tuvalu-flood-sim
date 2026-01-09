# Tuvalu Sea Level Rise Visualization

An interactive web app exploring how sea level rise affects Tuvalu. Drag a slider to simulate rising waters and see which areas would flood based on elevation data.

## About

This project examines the question: **How are the people of Tuvalu affected by sea level rise?**

Built as part of an ocean justice research project exploring the psychological, political, and physical impacts of climate change on low-lying Pacific island nations.

## Features

- Interactive satellite map of Tuvalu (Funafuti atoll)
- Sea level rise slider (0–2m)
- Real-time flood visualization based on elevation
- Timeline of key events and projections

## Tech Stack

- React + Vite
- Mapbox GL JS
- Mapbox Terrain-RGB elevation data

## Setup

1. Clone the repo
2. Run `npm install`
3. Create `.env` file with your Mapbox token:
```
   VITE_MAPBOX_TOKEN=pk.eyJ1IjoibWF0aGlhc3ZhbGhvdmQiLCJhIjoiY21rM3N3ZXZzMDBhcjNmc2dzaG9ubTJrcyJ9.z_dhZd_heKjHhXRG5scVMw
```
4. Run `npm run dev`

## Data Sources

- NASA Sea Level Change Portal
- IPCC 6th Assessment Report
- World Bank Climate Knowledge Portal

## Team

- [Your names here]
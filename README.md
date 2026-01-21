# Tuvalu: A Nation at the Frontline of Climate Change

An interactive web experience exploring the impact of climate change on Tuvalu and the Falepili Union mobility pathway between Tuvalu and Australia.

## Overview

This project is part of an ocean justice research initiative examining climate displacement and the legal frameworks (or lack thereof) for climate refugees. Through an interactive simulation, users experience the visa ballot process that Tuvaluans face when seeking migration pathways to Australia.

### Features

- **Interactive Landing Page** - Animated map flyover of Tuvalu with scrolling story cards explaining the climate crisis
- **Ballot Registration Simulation** - Step-by-step simulation of the Falepili Union visa application process
- **Data Collection** - Submissions stored in Supabase for exhibition/research purposes

## Tech Stack

- **Frontend**: React 19 + Vite
- **Maps**: Mapbox GL JS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Mapbox account (for access token)
- Supabase account (for database)

### Installation

```bash
git clone <repository-url>
cd tuvalu-flood-sim
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

Run this SQL in your Supabase SQL Editor to create the required table:

```sql
CREATE TABLE ballot_registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  birthplace TEXT,
  family_size INTEGER,
  gender TEXT,
  include_spouse BOOLEAN DEFAULT FALSE,
  dependent_children INTEGER DEFAULT 0
);

ALTER TABLE ballot_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON ballot_registrations
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public reads" ON ballot_registrations
  FOR SELECT TO anon
  USING (true);
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Deployment

### Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Add environment variables during setup:
   - `VITE_MAPBOX_TOKEN`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy

The app will automatically redeploy on every push to the main branch.

## Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx      # Map flyover and story cards
│   ├── BallotRegistration.jsx # Visa simulation form
│   └── ...
├── lib/
│   └── supabase.js          # Supabase client config
├── styles/
│   └── main.css             # Global styles
├── App.jsx                  # Main app with page routing
└── main.jsx                 # Entry point
```

## Data Privacy

This is an exhibition simulation. User-submitted data is:
- Stored temporarily for demonstration purposes
- Not shared with third parties
- Deleted after the exhibition period

## License

This project is for educational and research purposes.

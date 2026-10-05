# Aqua Check 💧

### Tripura Aquifer Hydrogeological Radar

**Aqua Check** is a groundwater intelligence and pre-drilling decision-support platform designed for Tripura, India.

It combines an interactive GIS map, station-level groundwater data, hydrogeological risk scoring, multilingual analysis, and AI-assisted pre-drilling recommendations in a single web application.

[🌐 Live Demo](https://aqua-check-opal.vercel.app/)

---

## What Problem Does It Solve?

Borewell drilling is often carried out with limited information about local groundwater conditions.

Aqua Check is designed to provide a **pre-drilling information layer** before a borewell is planned by bringing together:

- Groundwater depth information
- Historical trend indicators
- Geological / terrain information
- Aquifer vulnerability scoring
- Location-based station analysis
- Drilling recommendations
- AI-assisted hydrogeological explanations

The goal is to help users make a more informed preliminary decision before commissioning detailed field investigation and drilling work.

---

## Key Features

### 🗺️ Interactive Hydrogeological Map

An interactive Leaflet-based map displaying **118 station records** across Tripura.

Users can:

- Explore monitoring stations
- Filter stations by district
- Select individual stations
- Inspect groundwater metrics
- Drop a location pin
- Find the nearest station
- Switch map layers
- View station-specific information

### 📊 Groundwater Intelligence

For each station, Aqua Check presents information such as:

- Pre-monsoon depth to water level
- Groundwater trend
- Terrain / geological formation
- Station type
- Vulnerability score
- Recommended target depth

### ⚠️ Aquifer Vulnerability Scoring

Aqua Check provides a **0–100 vulnerability score** and classifies the station into risk tiers.

The score is intended as a project-level decision-support indicator based on the available station attributes and deterministic rules.

### 🛠️ Pre-Drilling Advisory

The platform generates preliminary recommendations covering:

- Target drilling depth
- Drilling method
- Casing and screen considerations
- Gravel packing
- Sanitary sealing
- Contractor questions
- Basic water-quality considerations

### 🤖 AI-Assisted Hydrogeological Advisory

Aqua Check can use Google's Gemini API to generate contextual explanations based on the selected station.

The API attempts multiple available Gemini model aliases and falls back to a deterministic hydrogeological rules engine when AI generation is unavailable.

### 🌐 Trilingual Interface

The application supports:

- English
- বাংলা
- हिन्दी

The language system covers both the interface and technical advisory content.

### 🌓 Light / Dark Mode

The interface includes a responsive light and dark theme.

### 🖨️ Hydrogeological Report

Users can generate a printable station report directly from the application.

---

## How It Works

```text
User selects a location
        ↓
Station / nearest station identified
        ↓
Groundwater + terrain data loaded
        ↓
Vulnerability score calculated
        ↓
Deterministic hydrogeological analysis
        ↓
Optional Gemini AI analysis
        ↓
Pre-drilling advisory

                    ┌──────────────────────┐
                    │      Aqua Check      │
                    │      React UI        │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Station Dataset      Leaflet Map      UI / i18n
             │
             ▼
      Hydrogeological
       Calculations
             │
             ▼
       /api/advisory
             │
        ┌────┴────┐
        │         │
        ▼         ▼
     Gemini    Deterministic
       AI        Fallback

Technology Stack
Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- Leaflet
- Three.js
- Lucide React
Backend / API
- Node.js
- Express
- TypeScript
- tsx
- esbuild
AI
- Google GenAI SDK (@google/genai)
- Gemini API
Deployment
- Vercel
- Vercel Serverless Function for /api/advisory

Aqua_Check_/
│
├── api/
│   └── advisory.ts
│
├── public/
│   └── ...
│
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   ├── context/
│   ├── data/
│   │   └── tripuraData.ts
│   ├── i18n/
│   │   └── translations.ts
│   ├── utils/
│   │   └── advisoryGenerator.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts

Run Locally
Prerequisites
- Node.js 18+
- npm
1. Clone
git clone https://github.com/koustavvd/Aqua_Check_.git
cd Aqua_Check_

2. Install dependencies
npm install

3. Configure Gemini
Create a .env file:
GEMINI_API_KEY=your_gemini_api_key

The Gemini key is optional.
Without it, the deterministic hydrogeological fallback remains available.
4. Start development server
npm run dev

The local application runs on:
http://localhost:3000

Production Build
npm run build

To preview the production build locally:
npm run preview

Deploy on Vercel
The project is configured for Vercel deployment.
Recommended Vercel configuration
Framework Preset: Vite
Root Directory: ./
Build Command: vite build
Output Directory: dist

For live Gemini-generated advisories, add:
GEMINI_API_KEY

as a Vercel environment variable.
The Vercel API endpoint is:
/api/advisory

Data
The application's station dataset is stored locally in:
src/data/tripuraData.ts

The interface uses station attributes including:
- Location
- District
- Block
- PIN code
- Station type
- Pre-monsoon water depth
- Water-level trend
- Terrain / formation
- Risk score
- Geographic coordinates
Important Data Note
This application should be treated as a demonstration and decision-support system.
The embedded dataset and generated recommendations should not be interpreted as a substitute for:
- Site-specific hydrogeological investigation
- Geophysical surveying
- Aquifer testing
- Water-quality testing
- Regulatory approval
- Professional drilling design
Actual borewell decisions should be validated using current field data and qualified hydrogeological / engineering assessment.
Why Aqua Check?
Aqua Check brings several pieces of information that are normally considered separately into one interface:
Location
   +
Groundwater Data
   +
Geological Context
   +
Risk Scoring
   +
GIS Visualization
   +
AI Assistance
   =
Pre-Drilling Decision Support

Current Scope
The current version focuses on Tripura groundwater intelligence and station-based pre-drilling analysis.
Future versions could include:
- Live groundwater feeds
- Expanded historical time-series data
- Rainfall integration
- Satellite / remote-sensing layers
- More advanced aquifer modeling
- Geophysical survey integration
- User-generated site reports
- Additional states and regions
Live Demo
🌐 https://aqua-check-opal.vercel.app/
Repository
💻 https://github.com/koustavvd/Aqua_Check_


Most importantly, I would **not claim that Aqua Check provides “real-time CGWB telemetry”** unless you actually have a live CGWB data connection. 

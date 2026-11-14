# LeadLens

> **Know Your Pipes. Protect Your Family.**  
> *Built for the CodeClash Hackathon — Towson University*

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 The Problem & Our Mission

Lead poisoning harms millions of people around the world. Low-income families and older neighborhoods are often at greater risk. Many families don't know if the service line bringing drinking water into their homes is made of toxic lead.

**LeadLens** is a free, mobile-first web app that helps families determine whether their water pipes might be made of lead. All you need is your phone and a 2-minute physical inspection (scratch and magnet tests based on EPA guidelines).

---

## 📱 Features & Screens

1. **Home Screen**:
   - Distinctive LeadLens branding and slogan: *"Know Your Pipes. Protect Your Family."*
   - CodeClash Hackathon — Towson University badge.
   - Quick 3-step explanation of how the test works.
   - Prominent **"Check My Pipe"** primary button.
   - **Interactive Demo Mode** quick-selector for judges and offline evaluations.

2. **Camera Screen**:
   - iPhone camera support (`capture="environment"` file input) and standard photo upload.
   - Built-in live browser viewfinder option.
   - Clear guide box explaining where to locate the water intake pipe before the meter.
   - Curated gallery of verified sample pipe reference photos (Lead, Copper, Galvanized Steel, PVC).
   - "Skip Photo" option for low-light or direct manual testing.

3. **Pipe Check Screen**:
   - Step-by-step physical verification questions:
     1. Exterior look & patina (dull grey, penny copper, threaded steel, smooth plastic, painted).
     2. Magnet Test (refrigerator/tool magnet sticks firmly vs falls off).
     3. Scratch Test (soft shiny silver nickel vs bright penny copper vs hard dull grey metal).
     4. Property age context (pre-1986 vs post-1986 lead ban).

4. **Results Screen**:
   - Material classification (Lead, Copper, Galvanized Steel, Plastic, or Inconclusive).
   - High-visibility risk badges (High Risk, Moderate Risk, Low Risk).
   - Plain-language explanation of why the material was identified.
   - **Immediate Safe Drinking Steps**: Cold water flushing, avoiding boiling for lead removal, cleaning faucet aerators.
   - **Certified Filter Guidance**: Explaining NSF/ANSI 53/58 requirements vs NSF 42 (taste-only).
   - **Water Utility Next Steps**: How to access Bipartisan Infrastructure Law grant programs and EPA Lead and Copper Rule replacement initiatives.
   - Native share action to spread awareness to neighbors.

5. **Learn Screen (Safety & Lab Testing Guide)**:
   - Deep dive into why lead is hazardous to infant and child brain development.
   - Step-by-step instructions on requesting free or certified lab water testing kits.
   - EPA Safe Drinking Water Hotline direct connection (`1-800-426-4791`).
   - Interactive FAQ accordion for common misconceptions (boiling water, bathing safety, hot vs cold tap).

6. **Interactive Demo Mode**:
   - Realistic pre-configured scenarios (1920s Historic Lead, 1970s Copper, 1950s Galvanized Steel, 2016 PVC).
   - Prominent **DEMO MODE RESULT** banners to ensure transparent distinction between simulation and real-world results.

---

## ⚠️ Important Safety Guarantees

- **No False Claims**: The camera inspects pipe material; it **cannot** measure dissolved lead in drinking water.
- **No Faked AI / Magnetometer Readings**: We never synthesize fake hardware sensors. Physical magnet and scratch tests are honest and EPA-aligned.
- **Lab Testing Required**: LeadLens clearly states that only an EPA-certified laboratory test can verify tap water safety.

---

## 🏗️ Architecture & Pipe Analysis Engine

The repository includes both the mobile-first React frontend and the rule-based classification modules:

```
LeadLens/
├── docs/                 # Documentation (pipe-analysis.md)
├── src/
│   ├── pipe-analysis/    # Rule-based pipe classifier & Vitest unit tests
│   │   ├── analyzePipe.ts
│   │   ├── analyzePipe.test.ts
│   │   ├── demo.ts
│   │   └── types.ts
│   ├── components/       # UI Components (Navbar, BottomNav, DisclaimerBanner, DemoModal)
│   ├── data/             # Demo scenarios & sample pipe SVG illustrations
│   ├── screens/          # Core screens (Home, Camera, PipeCheck, Results, Learn)
│   ├── services/         # Physical pipe assessment and local inspection storage
│   ├── types/            # Frontend TypeScript data models
│   ├── App.tsx           # Mobile shell, state management & view routing
│   ├── main.tsx          # React application entry point
│   └── index.css         # Tailwind & iOS Safari safe-area styling
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Launch

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chiefbumi/LeadLens.git
   cd LeadLens
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to [http://localhost:5173](http://localhost:5173).  
   *Tip for mobile testing*: Open browser DevTools (`F12`), toggle Device Emulation (`Ctrl+Shift+M` or `Cmd+Shift+M`), and select **iPhone 14 / Safari**.

5. **Run tests**:
   ```bash
   npm test
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

---

## Baltimore map and Vercel Functions

Copy `.env.example` to `.env` for local development. `npm run dev` serves the same two handlers that Vercel runs from the root `api/` directory. Set the matching variables in the Vercel project settings for Preview and Production. Keep the Gemini and Redis credentials server-side.

- `GEMINI_API_KEY` enables photo assessment. `GEMINI_MODEL` overrides the default model. The uploaded image is resized and re-encoded in the browser, then sent to Gemini only when the user requests an assessment. The physical check determines the inspection pin's material and risk.
- `NOMINATIM_REVERSE_URL` and `NOMINATIM_USER_AGENT` configure optional GPS address lookup. Use a provider appropriate for home addresses and your expected traffic. For demonstrations with nonconfidential test coordinates, the public OSM endpoint is opt-in and requires shared Redis credentials for caching and throttling. Its policy limits the entire app to one request per second. [Public Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/)
- `VITE_OSM_TILE_URL` and `VITE_OSM_TILE_ATTRIBUTION` configure the Leaflet basemap. The default displays attributed OpenStreetMap raster tiles. [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

Complete a pipe check, then choose where to place its pin by using GPS, clicking the map, or entering coordinates. You can correct or enter the street address before saving. Pins are saved in the current browser. The map links to Baltimore's official inventory and reporting portal.

The experimental phone magnetometer reads the magnetic field on supported devices. Use the physical magnet test to check whether the magnet sticks to the pipe.

## 👥 Hackathon Team & Acknowledgements

Created for the **Towson University CodeClash Hackathon**.  
Dedicated to public health, environmental justice, and safe drinking water for every family.

## CI and deployment

GitHub Actions runs type checks, unit tests, and a production build for pushes and pull requests. Successful pushes to `main` can deploy to Vercel after its credentials are configured. See [CI/CD setup](docs/ci-cd.md).

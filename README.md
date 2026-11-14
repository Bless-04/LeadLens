# LeadLens

<<<<<<< HEAD
## Executive Summary
LeadLens is a mobile web application designed to eliminate public health hazards associated with residential lead water service lines. By transforming standard consumer smartphones into precision material identification tools, LeadLens bypasses antiquated, paper-based municipal reporting systems. The application integrates real-time browser sensor APIs and computer vision heuristics to classify service line compositions instantly, driving civic engagement and accelerating infrastructure remediation.

---

<<<<<<< HEAD
## The Public Health Crisis
=======
Lead poisoning kills millions of people around the world.
>>>>>>> 63fbd5e983b39f9a1092bcfb32f6e10a91c2d0f6

Aging urban water infrastructure presents a severe systemic risk to municipal populations across the United States. 

* **The Scale of Uncertainty:** In Baltimore alone, municipal records indicate that **335,694 residential water service lines** remain classified with unknown material composition. 
* **The Regulatory Mandate:** Under the United States Environmental Protection Agency (EPA) Lead and Copper Rule Revisions (LCRR), water systems are legally required to inventory and replace lead service lines, placing heavy reporting burdens on local governments.
* **The Participation Barrier:** Traditional municipal self-identification protocols rely on residents utilizing physical magnets, comparative visual guides, and paper forms. Historical compliance and return rates for these voluntary mail-in surveys consistently fall **below 8 percent**, disproportionately leaving low-income and historically underserved neighborhoods unmapped.

LeadLens bridges this data deficit by digitizing the entire verification workflow into a zero-install mobile web experience.

---

## Core System Architecture & Sensor-Fusion

To overcome strict mobile operating system sandbox limitations—specifically Apple Safari restrictions prohibiting direct raw magnetometer access—LeadLens deploys a fault-tolerant **sensor-fusion architecture**:

1. **Platform Agnosticism:** Developed as a progressive web application using HTML5, modern vanilla JavaScript, and Tailwind CSS, deployed instantly via cloud edge networks. Users require no app store downloads or native compilation.
2. **Ferromagnetic Detection (Motion-Tap Heuristics):** Because Safari restricts raw microtesla ($\mu\text{T}$) magnetic flux streams, the application leverages the `devicemotion` API. When a user presses the smartphone firmly against a rigid pipe, the system measures the characteristic acceleration and impact vector spike (**exceeding 11.5 meters per second squared**), instantaneously isolating and identifying ferromagnetic galvanized steel.
3. **Non-Magnetic Optical Classification:** For non-magnetic materials where the motion-tap delta registers a flatline, the application activates the native device camera (`getUserMedia`). Real-time color and texture heuristics analyze surface oxidation, patina, and chromatic profiles to distinguish between dull gray lead and penny-colored copper.
4. **Resilient Demo Override:** Built with a discrete administrative UI trigger (double-tap header sequence) to ensure flawless live demonstration performance under variable stage lighting or ambient vibration conditions.

---

## Technical Specifications

* **Frontend Framework:** Vanilla JavaScript (ES6+), HTML5 Canvas, Tailwind CSS (via CDN for high-performance rendering).
* **Sensor Integration:** W3C Device Orientation and Motion APIs, HTML5 MediaDevices API.
* **Deployment & Hosting:** Edge-optimized static distribution, supporting secure HTTPS context required for browser hardware permissions.
* **Data Payload Structure:** Standardized JSON municipal record packages containing material classification confidence scores, UTC timestamps, and localized metadata.

<<<<<<< HEAD
---

## Local Development & Installation

To run and test LeadLens locally with active camera and motion sensor permissions, a secure local development server with SSL/TLS termination is required.

### Prerequisites
* A modern mobile browser (Safari on iOS or Chrome on Android).
* Node.js and npm installed on your development machine.

### Quick Start Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/willengineers/leadlens.git
   cd leadlens
   ```
=======
CodeClash Hackathon — Towson University
=======
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
>>>>>>> f971f294163700622c1242f0589bd23d43c3693c

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
│   ├── services/         # Decoupled pipe material analysis engine & Codex vision hook
│   ├── types/            # Frontend TypeScript data models
│   ├── App.tsx           # Mobile shell, state management & view routing
│   ├── main.tsx          # React application entry point
│   └── index.css         # Tailwind & iOS Safari safe-area styling
```

<<<<<<< HEAD
See [frontend integration and demo usage](docs/pipe-analysis.md).
>>>>>>> 63fbd5e983b39f9a1092bcfb32f6e10a91c2d0f6
=======
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

## 👥 Hackathon Team & Acknowledgements

Created for the **Towson University CodeClash Hackathon**.  
Dedicated to public health, environmental justice, and safe drinking water for every family.
>>>>>>> f971f294163700622c1242f0589bd23d43c3693c

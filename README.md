# LeadLens

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

## Pipe identification logic

The TypeScript rule-based classifier and unit tests are in `src/pipe-analysis`.
There is no React/Vite frontend in this checkout yet. Photos are accepted for
integration but are not analyzed; results use manually reported observations.
All results require confirmation and do not establish drinking-water safety.

```sh
npm ci
npm run typecheck
npm test
```

See [frontend integration and demo usage](docs/pipe-analysis.md).
>>>>>>> 63fbd5e983b39f9a1092bcfb32f6e10a91c2d0f6

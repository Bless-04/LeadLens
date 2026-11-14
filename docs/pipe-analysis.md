# Pipe analysis frontend interface

The module in `src/pipe-analysis` is plain TypeScript with no runtime
dependencies and can be imported directly by the React/Vite frontend.

## Run checks

Use Node 20.19+ or 22.12+ (validated with Node 24) and npm:

```sh
npm ci
npm run typecheck
npm test
```

In the managed cloud environment, npm's default home cache may be unwritable.
Use `npm ci --cache /tmp/leadlens-npm-cache` there instead of `npm ci`.

`npm run test:watch` runs the unit tests during development. These commands validate the analysis module. Use `npm run check` to also
validate the frontend production build; see [CI/CD](ci-cd.md).

## Call from React

The function is synchronous and pure. Call it in a form submit handler. It does
not require React hooks, a server, credentials, paid APIs, or network access.
For example, in `src/App.tsx`:

```tsx
import { useState } from 'react';
import { analyzePipe } from './pipe-analysis';
import type { PipeAnalysisInput, PipeAnalysisResult } from './pipe-analysis';

// Inside your existing component:
const [result, setResult] = useState<PipeAnalysisResult | null>(null);
function submitObservations(observations: PipeAnalysisInput) {
  setResult(analyzePipe(observations));
}

// Example observations from your existing controls:
submitObservations({
  photo: selectedFile, // File | null from a file input; optional
  pipeColor: 'dull-gray',
  magnetSticks: false, // a manually reported physical magnet test
  scratchColor: 'shiny-silver',
});
```

The snippet shows integration points, not a complete component. Call the submit
handler on user action, not during render. Use `PIPE_COLORS` and `SCRATCH_COLORS`
for accepted form values. Give those values readable labels in the existing UI.
Map a magnet select explicitly: `yes` → `true`, `no` → `false`, unanswered →
`null`. Do not use `Boolean(selectValue)`: the string `"false"` is truthy.
The browser is not expected to access an iPhone magnetometer.

Fields may be omitted or `null`. Use `unknown` for a color the user cannot
identify and `other` for an appearance outside the supported choices. Never
preselect observations as though the user performed a test.

Render `likelyMaterial` as **Likely** (or **Possible**), followed by `reasons`,
`nextSteps`, and `disclaimer`. Always show the request for further checking.
`needsMoreChecking` is currently always `true`, including for copper. These clues
cannot certify the pipe material, identify other pipe segments, or test water.
There is no confidence score or accuracy claim.

## Rules

All three observations must be present and consistent. This deliberately
conservative approach can return unknown for a pipe a professional could identify.

| Pipe surface | Physical magnet | Scratch color | Likely material |
| --- | --- | --- | --- |
| Dull gray or silver gray | Does not stick | Shiny silver | Lead |
| Reddish brown or green patina | Does not stick | Copper orange | Copper |
| Dull gray, silver gray, or rust brown | Sticks | Shiny silver | Galvanized steel |
| Missing, unsupported, or conflicting clues | Any | Any | Unknown |

A magnet alone does not establish galvanized steel; other ferrous pipes exist.
Other nonmagnetic metals can resemble lead. Painted surfaces, corrosion,
coatings, and mixed materials can obscure the clues. PVC and other materials are
outside this classifier and return unknown. A result concerns only the section
observed. Do not tell users to scrape painted, fragile, or corroded pipes. An
unavailable or unsafe scratch test should remain unanswered and produce unknown.

Rules are informed by the EPA's [Protect Your Tap guide](https://www.epa.gov/ground-water-and-drinking-water/protect-your-tap-quick-check-lead)
and [lead in drinking water guidance](https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water).
They have not been validated as a trained model or certified material test.
Utilities and licensed plumbers should confirm service-line materials; a
certified laboratory tests drinking-water lead levels.

## Photos

`photo` accepts a browser `File` (a `Blob`) or `Blob`. No model is connected.
Photos are **not analyzed, uploaded, or retained** by this function. A supplied
photo sets `photoAnalysis` to `not-analyzed` and adds an explicit reason; no photo
sets it to `not-provided`. A photo alone always yields unknown. Display this
status beside any photo control so users do not mistake upload selection for
recognition. A camera cannot detect lead in water.

## Demo mode

Import demo data separately and show its label prominently on the demo screen:

```ts
import { getDemoResult } from './pipe-analysis/demo';

const sample = getDemoResult('lead');
// sample.mode === 'demo'
// sample.label === 'DEMO — sample observations, not an analysis of your home'
// sample.sampleInput contains the fictional observations used.
```

Supported demos: `lead`, `copper`, `galvanized-steel`, `unknown`. Demo mode is
never a fallback for real observations. Keep demo state separate from real
results, clear it when leaving the demo, and render the label with every sample.
The discriminated `mode` prevents a demo result from being assigned to
`PipeAnalysisResult` accidentally in TypeScript.

import { DemoScenario } from '../types/pipe';

export const SAMPLE_PIPE_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-lead',
    title: '1920s Historic Home (Lead Service Line)',
    subtitle: 'Dull grey exterior, non-magnetic, scratches shiny silver',
    description: 'This is a classic historic lead pipe entering through a basement foundation wall. Notice the dull gray oxidized surface and the rounded bulbous joint.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="leadGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%235A626A"/><stop offset="50%" stop-color="%237B858F"/><stop offset="100%" stop-color="%233E444A"/></linearGradient><linearGradient id="scratchGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23E2E8F0"/><stop offset="50%" stop-color="%23FFFFFF"/><stop offset="100%" stop-color="%23CBD5E1"/></linearGradient></defs><rect width="400" height="300" fill="%231E293B"/><rect x="40" y="90" width="320" height="120" rx="30" fill="url(%23leadGrad)" stroke="%23334155" stroke-width="4"/><ellipse cx="260" cy="150" rx="45" ry="60" fill="%234B5563"/><path d="M120 140 L200 140 L210 160 L130 160 Z" fill="url(%23scratchGrad)" stroke="%2394A3B8" stroke-width="2"/><text x="200" y="50" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23F8FAFC" text-anchor="middle">LEAD SERVICE LINE</text><text x="165" y="185" font-family="sans-serif" font-size="12" fill="%2338BDF8" text-anchor="middle">Coin scratch: Shiny silver</text><text x="200" y="260" font-family="sans-serif" font-size="13" fill="%23CBD5E1" text-anchor="middle">Magnet: Does NOT stick | Soft &amp; Dull Grey</text></svg>',
    expectedMaterial: 'lead',
    answers: {
      exteriorColor: 'dull_grey',
      magnetSticks: 'does_not_stick',
      scratchResult: 'shiny_silver',
      homeBuiltBefore1986: true,
      isDemo: true,
    }
  },
  {
    id: 'demo-copper',
    title: '1975 Suburban Rancher (Copper Pipe)',
    subtitle: 'Penny-colored brown/green, non-magnetic, scratches bright copper',
    description: 'A typical post-1970 copper pipe before the water meter. Copper has a distinct penny-like reddish hue or mild green patina.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23B45309"/><stop offset="50%" stop-color="%23D97706"/><stop offset="100%" stop-color="%2392400E"/></linearGradient><linearGradient id="copperScratch" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23F59E0B"/><stop offset="50%" stop-color="%23FDE68A"/><stop offset="100%" stop-color="%23D97706"/></linearGradient></defs><rect width="400" height="300" fill="%231E293B"/><rect x="50" y="100" width="300" height="100" rx="15" fill="url(%23copperGrad)" stroke="%2378350F" stroke-width="4"/><path d="M140 135 L220 135 L230 155 L150 155 Z" fill="url(%23copperScratch)" stroke="%23B45309" stroke-width="2"/><text x="200" y="50" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23F8FAFC" text-anchor="middle">COPPER SERVICE PIPE</text><text x="185" y="185" font-family="sans-serif" font-size="12" fill="%23FDE68A" text-anchor="middle">Coin scratch: Bright Penny Copper</text><text x="200" y="260" font-family="sans-serif" font-size="13" fill="%23CBD5E1" text-anchor="middle">Magnet: Does NOT stick | Soldered joints</text></svg>',
    expectedMaterial: 'copper',
    answers: {
      exteriorColor: 'copper_brown',
      magnetSticks: 'does_not_stick',
      scratchResult: 'copper_penny',
      homeBuiltBefore1986: true,
      isDemo: true,
    }
  },
  {
    id: 'demo-galvanized',
    title: '1950s Colonial (Galvanized Steel)',
    subtitle: 'Threaded screw fittings, magnet sticks strongly',
    description: 'Galvanized iron/steel pipes have prominent screw-threaded joints. Strong magnets clamp securely to iron or steel.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23475569"/><stop offset="50%" stop-color="%2364748B"/><stop offset="100%" stop-color="%23334155"/></linearGradient></defs><rect width="400" height="300" fill="%231E293B"/><rect x="40" y="95" width="320" height="110" rx="6" fill="url(%23steelGrad)" stroke="%231E293B" stroke-width="4"/><rect x="180" y="85" width="40" height="130" rx="4" fill="%23475569" stroke="%230F172A" stroke-width="3"/><circle cx="100" cy="150" r="24" fill="%23DC2626" stroke="%23F8FAFC" stroke-width="2"/><text x="100" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">🧲</text><text x="200" y="50" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23F8FAFC" text-anchor="middle">GALVANIZED STEEL PIPE</text><text x="100" y="195" font-family="sans-serif" font-size="12" fill="%23EF4444" text-anchor="middle">Magnet Sticks Firmly!</text><text x="200" y="260" font-family="sans-serif" font-size="13" fill="%23CBD5E1" text-anchor="middle">Screw-threaded joints | Hard to scratch</text></svg>',
    expectedMaterial: 'galvanized_steel',
    answers: {
      exteriorColor: 'dark_grey_matte',
      magnetSticks: 'sticks',
      scratchResult: 'dull_grey_hard',
      homeBuiltBefore1986: true,
      isDemo: true,
    }
  },
  {
    id: 'demo-plastic',
    title: '2016 Modern Home (Plastic PEX / PVC)',
    subtitle: 'Smooth white/blue plastic, non-metallic, zero lead risk in pipe',
    description: 'Modern residential builds typically use white PVC or flexible blue/red PEX. Non-metallic and rust-proof.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="pvcGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F8FAFC"/><stop offset="50%" stop-color="%23E2E8F0"/><stop offset="100%" stop-color="%23CBD5E1"/></linearGradient></defs><rect width="400" height="300" fill="%231E293B"/><rect x="50" y="105" width="300" height="90" rx="10" fill="url(%23pvcGrad)" stroke="%2394A3B8" stroke-width="4"/><text x="200" y="50" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23F8FAFC" text-anchor="middle">PLASTIC (PVC / PEX)</text><text x="200" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2364748B" text-anchor="middle">PVC SCHEDULE 40 — NON-METALLIC</text><text x="200" y="260" font-family="sans-serif" font-size="13" fill="%2338BDF8" text-anchor="middle">Magnet does NOT stick | Smooth plastic</text></svg>',
    expectedMaterial: 'plastic',
    answers: {
      exteriorColor: 'white_or_blue_plastic',
      magnetSticks: 'does_not_stick',
      scratchResult: 'white_colored_plastic',
      homeBuiltBefore1986: false,
      isDemo: true,
    }
  }
];

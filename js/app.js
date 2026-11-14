/**
 * app.js — LeadLens Master State Machine & Screen Controller
 * 
 * Owns all view transitions and application state.
 * Exposes a global `window.LeadLensApp` interface so the sensor teammate's
 * code (motion.js, camera.js) can push scan results into the UI without
 * any coupling to this file's internals.
 *
 * State flow:  home → scanning → results → submission → home
 *
 * Integration API for sensor code:
 *   window.LeadLensApp.handleScanResult(material, confidence)
 *     material:   'galvanized_steel' | 'lead' | 'copper'
 *     confidence:  Number 0–100 (percentage)
 */

const LeadLensApp = (() => {

  /* -----------------------------------------------------------------------
   * APPLICATION STATE
   * --------------------------------------------------------------------- */
  const state = {
    currentView:     'home',        // active view id suffix
    scanPhase:       'tap',         // 'tap' | 'camera'
    detectedMaterial: null,         // 'galvanized_steel' | 'lead' | 'copper'
    confidence:       null,         // 0–100
    detectionMethod:  null,         // 'motion_sensor' | 'camera_analysis' | 'demo_override'
    isMagnetic:       null,         // true | false | null
    capturedColor:    null,         // { h, s, l } or null
    submissionPayload: null,        // final JSON object
  };

  /* -----------------------------------------------------------------------
   * VIEW TRANSITIONS
   * --------------------------------------------------------------------- */
  function transition(viewName) {
    // Deactivate all views
    document.querySelectorAll('[data-view]').forEach(el => {
      el.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewName}`);
    if (!target) {
      console.error(`[App] Unknown view: ${viewName}`);
      return;
    }

    target.classList.add('active');
    state.currentView = viewName;
    window.scrollTo(0, 0);

    // View-specific lifecycle hooks
    switch (viewName) {
      case 'scanning':
        showScanPhase(state.scanPhase);
        if (state.scanPhase === 'tap') Motion.reset();
        break;
      case 'results':
        renderResults();
        break;
      case 'submission':
        prepareSubmissionForm();
        break;
    }

    console.log(`[App] → ${viewName}`);
  }

  /* -----------------------------------------------------------------------
   * SCANNING PHASE MANAGEMENT
   * --------------------------------------------------------------------- */
  function showScanPhase(phase) {
    document.querySelectorAll('.scan-phase').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`scan-phase-${phase}`);
    if (target) target.classList.add('active');

    // Update step label
    const label = document.getElementById('scan-step-label');
    if (label) {
      label.textContent = phase === 'tap' ? 'STEP 1 OF 2' : 'STEP 2 OF 2';
    }
    state.scanPhase = phase;
  }

  /**
   * Called when tap test shows no spike — advance to camera phase.
   */
  function advanceToCamera() {
    state.isMagnetic = false;
    showScanPhase('camera');
  }

  /* -----------------------------------------------------------------------
   * RESULT HANDLING — PRIMARY INTEGRATION POINT
   * --------------------------------------------------------------------- */

  /**
   * handleScanResult — Global API for sensor modules.
   * Call this when a material has been identified.
   *
   * @param {string} material    - 'galvanized_steel' | 'lead' | 'copper'
   * @param {number} confidence  - 0–100 percentage
   */
  function handleScanResult(material, confidence) {
    state.detectedMaterial = material;
    state.confidence = Math.round(Math.min(100, Math.max(0, confidence)));

    // Infer detection method from context if not set
    if (!state.detectionMethod) {
      state.detectionMethod = state.scanPhase === 'tap' ? 'motion_sensor' : 'camera_analysis';
    }

    // Magnetic inference
    if (state.isMagnetic === null) {
      state.isMagnetic = (material === 'galvanized_steel');
    }

    console.log(`[App] Scan result: ${material} @ ${state.confidence}%`);
    transition('results');
  }

  /**
   * setResult — Backward-compatible bridge for existing sensor code.
   * motion.js calls:  App.setResult('galvanized_steel', 'motion_sensor', true)
   * camera.js calls:  App.setResult('copper', 'camera_analysis', false, {h,s,l})
   */
  function setResult(material, method, magnetic, color) {
    state.detectionMethod = method;
    state.isMagnetic = magnetic;
    state.capturedColor = color || null;

    // Map method to confidence heuristic
    let confidence;
    switch (method) {
      case 'motion_sensor':  confidence = 94; break;
      case 'camera_analysis': confidence = 87; break;
      case 'demo_override':   confidence = 99; break;
      default:                confidence = 85;
    }

    handleScanResult(material, confidence);
  }

  /* -----------------------------------------------------------------------
   * RESULTS RENDERING
   * --------------------------------------------------------------------- */
  const MATERIALS = {
    galvanized_steel: {
      label:    'Galvanized Steel',
      icon:     '\u{1F529}',
      risk:     'Moderate',
      riskCls:  'text-warn',
      iconBg:   'bg-warn/15 ring-1 ring-warn/20',
      magnetic: 'Yes (Ferromagnetic)',
      advice:   'Galvanized steel can corrode internally over decades, potentially leaching zinc, iron, and trace lead from solder joints. Schedule a professional inspection to evaluate pipe condition.',
      subtitle: 'Magnetic impact signature detected — consistent with galvanized steel service line.',
    },
    lead: {
      label:    'Lead',
      icon:     '\u26A0\uFE0F',
      risk:     'High',
      riskCls:  'text-danger',
      iconBg:   'bg-danger/15 ring-1 ring-danger/20',
      magnetic: 'No',
      advice:   'Lead service lines are a serious public health hazard. Contact Baltimore HCD at (410) 396-3425 for a free water testing kit and to discuss replacement options under the LCRR program.',
      subtitle: 'Non-magnetic, dull grey surface — consistent with lead service line.',
    },
    copper: {
      label:    'Copper',
      icon:     '\u2705',
      risk:     'Low',
      riskCls:  'text-success',
      iconBg:   'bg-success/15 ring-1 ring-success/20',
      magnetic: 'No',
      advice:   'Copper is the preferred material for residential water service lines and poses minimal health risk under normal conditions. No immediate action required.',
      subtitle: 'Non-magnetic, warm penny-tone surface — consistent with copper service line.',
    },
  };

  function renderResults() {
    const mat = MATERIALS[state.detectedMaterial];
    if (!mat) return;

    const methodLabels = {
      motion_sensor:   'Accelerometer Tap Test',
      camera_analysis: 'Camera Color Analysis',
      demo_override:   'Manual Override',
    };

    // Icon
    const $iconWrap = document.getElementById('result-icon-wrap');
    $iconWrap.className = `w-28 h-28 rounded-full flex items-center justify-center mb-5 ${mat.iconBg} animate-pop-in`;
    document.getElementById('result-icon').textContent = mat.icon;

    // Text
    document.getElementById('result-title').textContent = mat.label;
    document.getElementById('result-subtitle').textContent = mat.subtitle;

    // Confidence badge
    const $conf = document.getElementById('result-confidence');
    $conf.textContent = `${state.confidence}% Confidence`;

    // Detail card
    const $matEl = document.getElementById('result-material');
    $matEl.textContent = mat.label;
    $matEl.className = `font-semibold ${mat.riskCls}`;

    document.getElementById('result-magnetic').textContent = mat.magnetic;

    const $riskEl = document.getElementById('result-risk');
    $riskEl.textContent = mat.risk;
    $riskEl.className = `font-semibold ${mat.riskCls}`;

    document.getElementById('result-method').textContent = methodLabels[state.detectionMethod] || '--';
    document.getElementById('result-confidence-detail').textContent = `${state.confidence}%`;
    document.getElementById('result-advice').textContent = mat.advice;

    // Health alert — only for lead
    const $alert = document.getElementById('health-alert');
    if (state.detectedMaterial === 'lead') {
      $alert.classList.remove('hidden');
    } else {
      $alert.classList.add('hidden');
    }
  }

  /* -----------------------------------------------------------------------
   * MUNICIPAL SUBMISSION
   * --------------------------------------------------------------------- */

  function prepareSubmissionForm() {
    const mat = MATERIALS[state.detectedMaterial];
    if (mat) {
      document.getElementById('field-material').value = mat.label;
    }
    document.getElementById('submit-form-wrap').classList.remove('hidden');
    document.getElementById('submit-success-wrap').classList.add('hidden');
  }

  /**
   * Build the standardized municipal JSON payload and show confirmation.
   */
  function submitReport() {
    const name    = document.getElementById('field-name').value.trim();
    const address = document.getElementById('field-address').value.trim();

    if (!name || !address) {
      // Shake the button lightly via class
      alert('Please enter your name and address to submit.');
      return;
    }

    // Build the payload
    const payload = buildMunicipalPayload(name, address);
    state.submissionPayload = payload;

    // Reference number
    const refNum = 'BHCD-' + Date.now().toString(36).toUpperCase().slice(-7);

    // Populate success screen
    document.getElementById('submit-ref').textContent = refNum;
    document.getElementById('submit-material').textContent = MATERIALS[state.detectedMaterial]?.label || '--';
    document.getElementById('submit-timestamp').textContent = payload.timestamp_utc;
    document.getElementById('submit-payload-json').textContent = JSON.stringify(payload, null, 2);

    // Switch views
    document.getElementById('submit-form-wrap').classList.add('hidden');
    document.getElementById('submit-success-wrap').classList.remove('hidden');

    console.log('[App] Report submitted:', payload);
  }

  /**
   * Package scan data into standardized municipal JSON.
   */
  function buildMunicipalPayload(residentName, address) {
    const mat = MATERIALS[state.detectedMaterial];
    return {
      schema_version: '1.0.0',
      submission_type: 'residential_service_line_identification',
      municipality: {
        name: 'Baltimore Housing & Community Development',
        jurisdiction: 'Baltimore City, MD',
        program: 'Lead Service Line Inventory (LCRR Compliance)',
      },
      resident: {
        name: residentName,
        address: address,
      },
      identification: {
        material: state.detectedMaterial,
        material_label: mat?.label || 'Unknown',
        is_magnetic: state.isMagnetic,
        confidence_score: state.confidence / 100,
        detection_method: state.detectionMethod,
        health_risk_level: mat?.risk || 'Unknown',
      },
      geolocation: {
        latitude: 39.2904,
        longitude: -76.6122,
        accuracy_meters: null,
        source: 'mock_baltimore_centroid',
      },
      timestamp_utc: new Date().toISOString(),
      device: {
        user_agent: navigator.userAgent,
        platform: navigator.platform,
      },
    };
  }

  /* -----------------------------------------------------------------------
   * RESET
   * --------------------------------------------------------------------- */
  function reset() {
    state.detectedMaterial = null;
    state.confidence = null;
    state.detectionMethod = null;
    state.isMagnetic = null;
    state.capturedColor = null;
    state.submissionPayload = null;
    state.scanPhase = 'tap';
    transition('home');
  }

  /* -----------------------------------------------------------------------
   * INITIALIZATION
   * --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    transition('home');
    console.log('[LeadLens] v1.0 initialized — state machine ready');
  });

  /* -----------------------------------------------------------------------
   * PUBLIC API
   * --------------------------------------------------------------------- */
  const api = {
    // State machine
    transition,
    reset,
    getState: () => ({ ...state }),

    // Sensor integration (new)
    handleScanResult,

    // Sensor integration (backward-compatible with existing motion.js / camera.js)
    setResult,

    // Scanning flow
    advanceToCamera,

    // Submission
    submitReport,

    // Override namespace — populated by override.js
    override: {},
  };

  return api;
})();

// ---- Global binding for sensor teammate integration ----
window.LeadLensApp = LeadLensApp;

// ---- Backward-compatible `App` alias (motion.js / camera.js use App.setResult) ----
window.App = {
  setResult: (...args) => LeadLensApp.setResult(...args),
  goTo:      (view) => LeadLensApp.transition(view),
  getState:  () => LeadLensApp.getState(),
};

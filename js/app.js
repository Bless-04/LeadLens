/**
 * app.js — LeadLens Master State Machine & Screen Controller
 *
 * Manages the four-view lifecycle:
 *   home  →  scanning  →  results  →  submission  →  home
 *
 * Exposes a global `window.LeadLensApp` API so the teammate's sensor
 * module can push results into the UI without any tight coupling.
 *
 * PUBLIC API:
 *   LeadLensApp.handleScanResult(material, confidence)
 *     material  : 'galvanized_steel' | 'lead' | 'copper'
 *     confidence: number 0–100
 *
 * BACKWARD-COMPAT SHIM:
 *   App.setResult(material, method, magnetic)
 *     Bridges the existing motion.js contract into handleScanResult.
 *
 * EXCLUDED: All camera / getUserMedia / optical classification code.
 */

const LeadLensApp = (() => {

  /* ====================================================================
   * STATE
   * ================================================================= */
  const state = {
    currentView:      'home',
    detectedMaterial: null,       // 'galvanized_steel' | 'lead' | 'copper'
    confidence:       null,       // 0–100
    detectionMethod:  null,       // 'motion_sensor' | 'demo_override'
    isMagnetic:       null,       // boolean
    submissionPayload: null,      // JSON object
  };

  /* ====================================================================
   * MATERIAL DEFINITIONS
   * ================================================================= */
  const MATERIALS = {
    galvanized_steel: {
      label:    'Galvanized Steel',
      icon:     '\u{1F529}',        // wrench emoji
      risk:     'Moderate',
      riskCls:  'text-warn',
      iconBg:   'bg-warn/15 ring-1 ring-warn/20',
      magnetic: 'Yes (Ferromagnetic)',
      advice:   'Galvanized steel can corrode internally over decades, potentially leaching zinc, iron, and trace lead from solder joints. Schedule a professional inspection to evaluate pipe condition.',
      subtitle: 'Magnetic impact signature detected — consistent with galvanized steel service line.',
    },
    lead: {
      label:    'Lead',
      icon:     '\u26A0\uFE0F',     // warning sign
      risk:     'High',
      riskCls:  'text-danger',
      iconBg:   'bg-danger/15 ring-1 ring-danger/20',
      magnetic: 'No',
      advice:   'Lead service lines are a serious public health hazard. Contact Baltimore HCD at (410) 396-3425 for a free water testing kit and to discuss replacement options under the LCRR program.',
      subtitle: 'Non-magnetic, dull grey surface — consistent with lead service line.',
    },
    copper: {
      label:    'Copper',
      icon:     '\u2705',           // checkmark
      risk:     'Low',
      riskCls:  'text-success',
      iconBg:   'bg-success/15 ring-1 ring-success/20',
      magnetic: 'No',
      advice:   'Copper is the preferred material for residential water service lines and poses minimal health risk under normal conditions. No immediate action required.',
      subtitle: 'Non-magnetic, warm penny-tone surface — consistent with copper service line.',
    },
  };

  /* ====================================================================
   * VIEW TRANSITIONS
   * ================================================================= */
  function transition(viewName) {
    document.querySelectorAll('[data-view]').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`view-${viewName}`);
    if (!target) {
      console.error(`[App] Unknown view: ${viewName}`);
      return;
    }

    target.classList.add('active');
    state.currentView = viewName;
    window.scrollTo(0, 0);

    // Lifecycle hooks
    if (viewName === 'scanning' && typeof Motion !== 'undefined') {
      Motion.reset();
    }
    if (viewName === 'results') {
      renderResults();
    }
    if (viewName === 'submission') {
      prepareSubmissionForm();
    }

    console.log(`[App] View → ${viewName}`);
  }

  /* ====================================================================
   * RESULT HANDLING — PRIMARY INTEGRATION POINT
   * ================================================================= */

  /**
   * handleScanResult — Stable global API for sensor modules.
   * @param {string} material    'galvanized_steel' | 'lead' | 'copper'
   * @param {number} confidence  0–100
   */
  function handleScanResult(material, confidence) {
    state.detectedMaterial = material;
    state.confidence = Math.round(Math.min(100, Math.max(0, confidence)));

    if (!state.detectionMethod) {
      state.detectionMethod = 'motion_sensor';
    }
    if (state.isMagnetic === null) {
      state.isMagnetic = (material === 'galvanized_steel');
    }

    console.log(`[App] Result: ${material} @ ${state.confidence}%`);
    transition('results');
  }

  /**
   * setResult — Backward-compatible bridge for existing motion.js.
   * motion.js calls: App.setResult('galvanized_steel', 'motion_sensor', true)
   */
  function setResult(material, method, magnetic) {
    state.detectionMethod = method || 'motion_sensor';
    state.isMagnetic = magnetic ?? (material === 'galvanized_steel');

    // Map detection method to a confidence heuristic
    let confidence;
    switch (method) {
      case 'motion_sensor':  confidence = 94; break;
      case 'demo_override':  confidence = 99; break;
      default:               confidence = 90;
    }

    handleScanResult(material, confidence);
  }

  /* ====================================================================
   * RESULTS RENDERING
   * ================================================================= */
  function renderResults() {
    const mat = MATERIALS[state.detectedMaterial];
    if (!mat) return;

    const methodLabels = {
      motion_sensor:  'Accelerometer Impact Test',
      demo_override:  'Manual Override',
    };

    // Icon
    const $iconWrap = document.getElementById('result-icon-wrap');
    $iconWrap.className = `w-28 h-28 rounded-full flex items-center justify-center mb-5 ${mat.iconBg} animate-pop-in`;
    document.getElementById('result-icon').textContent = mat.icon;

    // Text
    document.getElementById('result-title').textContent = mat.label;
    document.getElementById('result-subtitle').textContent = mat.subtitle;

    // Confidence badge
    document.getElementById('result-confidence').textContent = `${state.confidence}% Confidence`;

    // Detail rows
    const $mat = document.getElementById('result-material');
    $mat.textContent = mat.label;
    $mat.className = `font-semibold ${mat.riskCls}`;

    document.getElementById('result-magnetic').textContent = mat.magnetic;

    const $risk = document.getElementById('result-risk');
    $risk.textContent = mat.risk;
    $risk.className = `font-semibold ${mat.riskCls}`;

    document.getElementById('result-method').textContent = methodLabels[state.detectionMethod] || '--';
    document.getElementById('result-confidence-detail').textContent = `${state.confidence}%`;
    document.getElementById('result-advice').textContent = mat.advice;

    // Health alert — lead only
    const $alert = document.getElementById('health-alert');
    $alert.classList.toggle('hidden', state.detectedMaterial !== 'lead');
  }

  /* ====================================================================
   * MUNICIPAL DATA PACKAGING
   * ================================================================= */

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
      alert('Please enter your name and address to submit.');
      return;
    }

    const payload = buildMunicipalPayload(name, address);
    state.submissionPayload = payload;

    const refNum = 'BHCD-' + Date.now().toString(36).toUpperCase().slice(-7);

    // Populate success screen
    document.getElementById('submit-ref').textContent = refNum;
    document.getElementById('submit-material').textContent =
      MATERIALS[state.detectedMaterial]?.label || '--';
    document.getElementById('submit-confidence').textContent =
      `${state.confidence}%`;
    document.getElementById('submit-timestamp').textContent = payload.timestamp_utc;
    document.getElementById('submit-payload-json').textContent =
      JSON.stringify(payload, null, 2);

    // Swap form → success
    document.getElementById('submit-form-wrap').classList.add('hidden');
    document.getElementById('submit-success-wrap').classList.remove('hidden');

    console.log('[App] Report submitted:', payload);
  }

  /**
   * Build the standardized JSON record for municipal submission.
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

  /* ====================================================================
   * RESET
   * ================================================================= */
  function reset() {
    state.detectedMaterial  = null;
    state.confidence        = null;
    state.detectionMethod   = null;
    state.isMagnetic        = null;
    state.submissionPayload = null;
    transition('home');
  }

  /* ====================================================================
   * INIT
   * ================================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    transition('home');
    console.log('[LeadLens] v1.0 — state machine ready');
  });

  /* ====================================================================
   * PUBLIC API
   * ================================================================= */
  return {
    transition,
    reset,
    getState:        () => ({ ...state }),
    handleScanResult,
    setResult,
    submitReport,
    override: {},   // populated by override.js
  };

})();

/* ---- Global bindings ---- */
window.LeadLensApp = LeadLensApp;

/* ---- Backward-compat shim for motion.js (uses App.setResult) ---- */
window.App = {
  setResult: (...args) => LeadLensApp.setResult(...args),
  goTo:      (view)    => LeadLensApp.transition(view),
  getState:  ()        => LeadLensApp.getState(),
};

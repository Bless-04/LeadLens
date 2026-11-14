/**
 * app.js — Main controller & screen router for LeadLens
 * Manages screen transitions and shared application state.
 */

const App = (() => {
  // Shared state
  const state = {
    currentScreen: 'welcome',
    detectedMaterial: null,   // 'galvanized_steel' | 'lead' | 'copper'
    detectionMethod: null,    // 'motion_sensor' | 'camera_analysis' | 'demo_override'
    isMagnetic: null,         // true | false | null
    capturedColor: null,      // { h, s, l }
  };

  /**
   * Navigate to a screen by ID suffix.
   * e.g., goTo('tap-test') activates #screen-tap-test
   */
  function goTo(screenName) {
    // Deactivate all screens
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });

    // Activate target
    const target = document.getElementById(`screen-${screenName}`);
    if (target) {
      target.classList.add('active');
      state.currentScreen = screenName;

      // Screen-specific hooks
      if (screenName === 'tap-test') {
        Motion.reset();
      }
      if (screenName === 'camera') {
        // Camera will be started by user button press
      }
      if (screenName === 'result') {
        Results.render();
      }
      if (screenName === 'submit') {
        Results.prepareSubmitForm();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  /**
   * Set the detected material and proceed to results.
   */
  function setResult(material, method, magnetic = null, color = null) {
    state.detectedMaterial = material;
    state.detectionMethod = method;
    state.isMagnetic = magnetic;
    state.capturedColor = color;
    goTo('result');
  }

  function getState() {
    return { ...state };
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    goTo('welcome');
    console.log('[LeadLens] App initialized');
  });

  return { goTo, setResult, getState };
})();

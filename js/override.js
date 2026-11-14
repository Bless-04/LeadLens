/**
 * override.js — Hidden Demo Safety Net
 *
 * Provides a double-tap gesture on the LeadLens logo (home screen)
 * that opens a modal allowing presenters to force a specific material
 * result during live stage demos.
 *
 * Activation:  Double-tap the logo icon on the home screen.
 * Visibility:  The trigger is invisible to the audience / judges.
 */

(() => {
  const DOUBLE_TAP_WINDOW = 450; // ms

  let lastTapTime = 0;
  let $modal;

  function init() {
    $modal = document.getElementById('override-modal');
    const $logo = document.getElementById('logo-tap-target');

    if (!$logo || !$modal) return;

    // Use both touch and click to cover all devices
    $logo.addEventListener('touchend', onTap, { passive: false });
    $logo.addEventListener('click', onTap);

    // Close on backdrop click
    $modal.addEventListener('click', (e) => {
      if (e.target === $modal) close();
    });

    console.log('[Override] Initialized — double-tap logo to activate');
  }

  function onTap(e) {
    // Prevent double-firing on touch devices
    if (e.type === 'click' && e.sourceCapabilities?.firesTouchEvents) return;
    e.preventDefault();

    const now = Date.now();
    if (now - lastTapTime < DOUBLE_TAP_WINDOW) {
      open();
      lastTapTime = 0;
    } else {
      lastTapTime = now;
    }
  }

  function open() {
    $modal.classList.remove('hidden');
  }

  function close() {
    $modal.classList.add('hidden');
  }

  /**
   * Force a material result and jump straight to the results view.
   */
  function force(material) {
    close();

    // Set state directly via the public API
    const state = LeadLensApp.getState();
    // Use setResult with demo_override method and high confidence
    LeadLensApp.setResult(material, 'demo_override', material === 'galvanized_steel');

    console.log(`[Override] Forced: ${material}`);
  }

  // Wire into the LeadLensApp.override namespace
  document.addEventListener('DOMContentLoaded', () => {
    init();
    if (window.LeadLensApp) {
      LeadLensApp.override.open  = open;
      LeadLensApp.override.close = close;
      LeadLensApp.override.force = force;
    }
  });
})();

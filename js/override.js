/**
 * override.js — Hidden Demo Safety Net
 *
 * Activation:  Double-tap the LeadLens logo on the home screen.
 * Effect:      Opens a modal to force any material result at 99% confidence.
 * Visibility:  Completely invisible to judges and audience.
 *
 * Wires into LeadLensApp.override.{ open, close, force }
 */

(() => {
  const DOUBLE_TAP_WINDOW_MS = 450;

  let lastTapTime = 0;
  let $modal;

  function init() {
    $modal = document.getElementById('override-modal');
    const $logo = document.getElementById('logo-tap-target');
    if (!$logo || !$modal) return;

    $logo.addEventListener('touchend', onTap, { passive: false });
    $logo.addEventListener('click', onTap);

    $modal.addEventListener('click', (e) => {
      if (e.target === $modal) close();
    });

    console.log('[Override] Ready — double-tap logo to activate');
  }

  function onTap(e) {
    if (e.type === 'click' && e.sourceCapabilities?.firesTouchEvents) return;
    e.preventDefault();

    const now = Date.now();
    if (now - lastTapTime < DOUBLE_TAP_WINDOW_MS) {
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
   * Force a material result, bypassing all sensor logic.
   * @param {'galvanized_steel'|'lead'|'copper'} material
   */
  function force(material) {
    close();
    LeadLensApp.setResult(material, 'demo_override', material === 'galvanized_steel');
    console.log(`[Override] Forced → ${material}`);
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    if (window.LeadLensApp) {
      LeadLensApp.override.open  = open;
      LeadLensApp.override.close = close;
      LeadLensApp.override.force = force;
    }
  });
})();

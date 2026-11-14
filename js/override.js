/**
 * override.js — Hidden demo override for live stage presentations.
 * Double-tapping the LeadLens logo/header on the welcome screen opens a modal
 * to force-select a material result, bypassing sensor detection.
 */

const Override = (() => {
  const DOUBLE_TAP_THRESHOLD = 400; // ms between taps to count as double-tap

  let lastTap = 0;
  let $modal;

  /**
   * Initialize double-tap listener on the logo.
   */
  function init() {
    $modal = document.getElementById('override-modal');
    const $logoTarget = document.getElementById('logo-tap-target');

    if ($logoTarget) {
      $logoTarget.addEventListener('touchend', handleTap);
      $logoTarget.addEventListener('click', handleTap);
    }

    // Close modal on background click
    $modal.addEventListener('click', (e) => {
      if (e.target === $modal) close();
    });

    console.log('[Override] Demo override initialized (double-tap logo to activate)');
  }

  /**
   * Detect double-tap gesture.
   */
  function handleTap(e) {
    e.preventDefault();
    const now = Date.now();

    if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
      // Double-tap detected
      open();
      lastTap = 0;
    } else {
      lastTap = now;
    }
  }

  /**
   * Open the override modal.
   */
  function open() {
    $modal.classList.remove('hidden');
    console.log('[Override] Modal opened');
  }

  /**
   * Close the override modal.
   */
  function close() {
    $modal.classList.add('hidden');
  }

  /**
   * Force a material result and go directly to the result screen.
   */
  function force(material) {
    close();
    App.setResult(material, 'demo_override', material === 'galvanized_steel');
    console.log(`[Override] Forced result: ${material}`);
  }

  // Auto-init when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  return { open, close, force };
})();

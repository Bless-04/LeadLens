/**
 * motion.js — Tap detection via DeviceMotion API
 * Detects high-acceleration impact events when the phone is tapped against a metal pipe.
 * A spike above the threshold indicates a hard, rigid (ferromagnetic steel) surface.
 */

const Motion = (() => {
  const SPIKE_THRESHOLD = 11.5;  // m/s² — calibrated for phone-on-metal tap
  const SPIKE_HOLD_MS = 1500;    // How long to show spike detected state
  const FALLBACK_TIMEOUT = 12000; // Show "use camera" button after 12s with no spike

  let listening = false;
  let spikeDetected = false;
  let fallbackTimer = null;
  let peakAccel = 0;

  // DOM refs (cached after first call)
  let $ring, $accel, $status, $bar, $btnStart, $btnCamera;

  function cacheDom() {
    $ring      = document.getElementById('tap-ring');
    $accel     = document.getElementById('tap-accel');
    $status    = document.getElementById('tap-status');
    $bar       = document.getElementById('tap-bar');
    $btnStart  = document.getElementById('btn-tap-start');
    $btnCamera = document.getElementById('btn-not-magnetic');
  }

  /**
   * Request permission (required on iOS 13+) and start listening.
   */
  async function startListening() {
    cacheDom();

    // iOS 13+ requires explicit permission
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const perm = await DeviceMotionEvent.requestPermission();
        if (perm !== 'granted') {
          $status.textContent = 'Motion permission denied. Try Camera instead.';
          $btnCamera.classList.remove('hidden');
          return;
        }
      } catch (e) {
        console.warn('[Motion] Permission request failed:', e);
        $status.textContent = 'Sensor unavailable. Try Camera instead.';
        $btnCamera.classList.remove('hidden');
        return;
      }
    }

    listening = true;
    spikeDetected = false;
    peakAccel = 0;

    $btnStart.textContent = 'Listening…';
    $btnStart.disabled = true;
    $btnStart.classList.add('opacity-50');
    $ring.classList.add('tap-ring-active');
    $status.textContent = 'Tap your phone firmly against the pipe…';
    $status.classList.add('animate-pulse-soft');

    window.addEventListener('devicemotion', handleMotion);

    // Fallback: if no spike after timeout, show camera option
    fallbackTimer = setTimeout(() => {
      if (!spikeDetected) {
        $status.textContent = 'No magnetic response detected.';
        $status.classList.remove('animate-pulse-soft');
        $btnCamera.classList.remove('hidden');
      }
    }, FALLBACK_TIMEOUT);

    console.log('[Motion] Listening started');
  }

  /**
   * Process each devicemotion event.
   */
  function handleMotion(event) {
    if (!listening || spikeDetected) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    // Resultant acceleration magnitude
    const magnitude = Math.sqrt(
      (acc.x || 0) ** 2 +
      (acc.y || 0) ** 2 +
      (acc.z || 0) ** 2
    );

    // Update UI
    const displayVal = Math.min(magnitude, 50).toFixed(1);
    $accel.textContent = displayVal;

    // Progress bar (0-30 range mapped to 0-100%)
    const pct = Math.min((magnitude / 30) * 100, 100);
    $bar.style.width = `${pct}%`;

    // Color the bar based on proximity to threshold
    if (magnitude > SPIKE_THRESHOLD) {
      $bar.classList.remove('bg-brand-500');
      $bar.classList.add('bg-danger');
    } else if (magnitude > SPIKE_THRESHOLD * 0.7) {
      $bar.classList.remove('bg-brand-500', 'bg-danger');
      $bar.classList.add('bg-warn');
    }

    // Track peak
    if (magnitude > peakAccel) {
      peakAccel = magnitude;
    }

    // Check for spike
    if (magnitude > SPIKE_THRESHOLD) {
      onSpikeDetected(magnitude);
    }
  }

  /**
   * Called when acceleration exceeds threshold — steel detected.
   */
  function onSpikeDetected(magnitude) {
    spikeDetected = true;
    listening = false;

    clearTimeout(fallbackTimer);
    window.removeEventListener('devicemotion', handleMotion);

    // Visual feedback
    $ring.classList.remove('tap-ring-active');
    $ring.classList.add('tap-ring-spike');
    $accel.textContent = magnitude.toFixed(1);
    $status.textContent = '⚡ Impact detected — Magnetic steel!';
    $status.classList.remove('animate-pulse-soft');
    $bar.style.width = '100%';

    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    console.log(`[Motion] Spike detected: ${magnitude.toFixed(2)} m/s²`);

    // Auto-navigate to result after brief hold
    setTimeout(() => {
      App.setResult('galvanized_steel', 'motion_sensor', true);
    }, SPIKE_HOLD_MS);
  }

  /**
   * Reset the tap test screen state.
   */
  function reset() {
    cacheDom();
    listening = false;
    spikeDetected = false;
    peakAccel = 0;
    clearTimeout(fallbackTimer);
    window.removeEventListener('devicemotion', handleMotion);

    $ring.classList.remove('tap-ring-spike', 'tap-ring-active');
    $accel.textContent = '0.0';
    $status.textContent = 'Waiting for tap…';
    $status.classList.remove('animate-pulse-soft');
    $bar.style.width = '0%';
    $bar.classList.remove('bg-danger', 'bg-warn');
    $bar.classList.add('bg-brand-500');
    $btnStart.textContent = 'Enable Motion Sensor';
    $btnStart.disabled = false;
    $btnStart.classList.remove('opacity-50');
    $btnCamera.classList.add('hidden');
  }

  return { startListening, reset };
})();

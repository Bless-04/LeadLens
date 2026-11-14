/**
 * camera.js — Camera stream + HSL color classification
 * Uses getUserMedia to capture a frame of the pipe, then analyzes the center region's
 * average color in HSL space to distinguish Lead (dull grey) from Copper (warm penny tone).
 */

const Camera = (() => {
  // Classification thresholds (HSL space)
  // Copper: warm hue (15-40°), moderate-high saturation, medium lightness
  // Lead:   any hue, very low saturation (< 15%), low-medium lightness (grey)
  const COPPER_HUE_MIN = 10;
  const COPPER_HUE_MAX = 45;
  const COPPER_SAT_MIN = 18;
  const LEAD_SAT_MAX = 18;
  const LEAD_LIGHTNESS_MAX = 55;

  let stream = null;
  let classifiedMaterial = null;
  let avgColor = { h: 0, s: 0, l: 0 };

  // DOM refs
  let $video, $canvas, $container, $btnStart, $btnCapture, $btnConfirm;
  let $colorAnalysis, $colorSwatch, $colorValues, $colorMatch;

  function cacheDom() {
    $video         = document.getElementById('camera-feed');
    $canvas        = document.getElementById('camera-canvas');
    $container     = document.getElementById('camera-container');
    $btnStart      = document.getElementById('btn-camera-start');
    $btnCapture    = document.getElementById('btn-capture');
    $btnConfirm    = document.getElementById('btn-camera-confirm');
    $colorAnalysis = document.getElementById('color-analysis');
    $colorSwatch   = document.getElementById('color-swatch');
    $colorValues   = document.getElementById('color-values');
    $colorMatch    = document.getElementById('color-match');
  }

  /**
   * Open the rear camera stream.
   */
  async function start() {
    cacheDom();

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      $video.srcObject = stream;
      await $video.play();

      $btnStart.classList.add('hidden');
      $btnCapture.classList.remove('hidden');

      console.log('[Camera] Stream started');
    } catch (err) {
      console.error('[Camera] Failed to start:', err);
      $btnStart.textContent = 'Camera unavailable';
      $btnStart.disabled = true;
    }
  }

  /**
   * Capture a single frame and analyze center region color.
   */
  function capture() {
    cacheDom();

    const ctx = $canvas.getContext('2d', { willReadFrequently: true });
    $canvas.width = $video.videoWidth;
    $canvas.height = $video.videoHeight;

    // Draw current frame
    ctx.drawImage($video, 0, 0);

    // Sample center region (20% of frame)
    const regionSize = Math.min($canvas.width, $canvas.height) * 0.2;
    const cx = ($canvas.width - regionSize) / 2;
    const cy = ($canvas.height - regionSize) / 2;
    const imageData = ctx.getImageData(cx, cy, regionSize, regionSize);

    // Compute average RGB
    const avg = averageRGB(imageData.data);
    avgColor = rgbToHSL(avg.r, avg.g, avg.b);

    // Classify
    classifiedMaterial = classify(avgColor);

    // Update UI
    $colorAnalysis.classList.remove('hidden');
    $colorSwatch.style.backgroundColor = `hsl(${avgColor.h}, ${avgColor.s}%, ${avgColor.l}%)`;
    $colorValues.textContent = `H: ${avgColor.h}°  S: ${avgColor.s}%  L: ${avgColor.l}%`;

    if (classifiedMaterial === 'copper') {
      $colorMatch.textContent = 'Copper';
      $colorMatch.className = 'text-sm font-semibold px-3 py-1 rounded-full bg-success/20 text-success';
    } else {
      $colorMatch.textContent = 'Lead';
      $colorMatch.className = 'text-sm font-semibold px-3 py-1 rounded-full bg-warn/20 text-warn';
    }

    $btnCapture.textContent = '🔄 Retake';
    $btnConfirm.classList.remove('hidden');

    console.log(`[Camera] Color: HSL(${avgColor.h}, ${avgColor.s}%, ${avgColor.l}%) → ${classifiedMaterial}`);
  }

  /**
   * Confirm the camera classification and navigate to results.
   */
  function confirm() {
    // Stop camera stream
    stopStream();
    App.setResult(classifiedMaterial, 'camera_analysis', false, avgColor);
  }

  /**
   * Classify material based on HSL values.
   */
  function classify(hsl) {
    // Low saturation + low-to-medium lightness → dull grey → Lead
    if (hsl.s <= LEAD_SAT_MAX && hsl.l <= LEAD_LIGHTNESS_MAX) {
      return 'lead';
    }
    // Warm hue + decent saturation → Copper
    if (hsl.h >= COPPER_HUE_MIN && hsl.h <= COPPER_HUE_MAX && hsl.s >= COPPER_SAT_MIN) {
      return 'copper';
    }
    // Default to lead for ambiguous grey tones
    return 'lead';
  }

  /**
   * Compute average RGB from pixel data.
   */
  function averageRGB(data) {
    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    return {
      r: Math.round(r / pixelCount),
      g: Math.round(g / pixelCount),
      b: Math.round(b / pixelCount),
    };
  }

  /**
   * Convert RGB to HSL.
   */
  function rgbToHSL(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Stop the camera stream.
   */
  function stopStream() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  return { start, capture, confirm };
})();

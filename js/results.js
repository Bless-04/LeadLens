/**
 * results.js — Renders the material result screen and mock city submission.
 */

const Results = (() => {
  // Material data definitions
  const MATERIALS = {
    galvanized_steel: {
      label: 'Galvanized Steel',
      icon: '🔩',
      risk: 'Moderate',
      riskClass: 'text-warn',
      iconBg: 'bg-warn/20',
      magnetic: 'Yes (Ferromagnetic)',
      advice: 'Galvanized steel pipes can corrode internally over time, potentially releasing zinc, iron, and sometimes lead from solder joints. Consider scheduling a professional inspection.',
      subtitle: 'Your pipe is magnetic — consistent with galvanized steel.',
    },
    lead: {
      label: 'Lead',
      icon: '⚠️',
      risk: 'High — Health Hazard',
      riskClass: 'text-danger',
      iconBg: 'bg-danger/20',
      magnetic: 'No',
      advice: 'Lead pipes pose a serious health risk, especially for children and pregnant women. Contact Baltimore HCD immediately for a free water test and pipe replacement options.',
      subtitle: 'Dull grey, soft metal — consistent with lead pipe.',
    },
    copper: {
      label: 'Copper',
      icon: '✅',
      risk: 'Low',
      riskClass: 'text-success',
      iconBg: 'bg-success/20',
      magnetic: 'No',
      advice: 'Copper pipes are generally safe for drinking water and are the preferred material for water service lines. No immediate action needed.',
      subtitle: 'Warm penny-colored tone — consistent with copper pipe.',
    },
  };

  /**
   * Render the result screen with current detection data.
   */
  function render() {
    const state = App.getState();
    const mat = MATERIALS[state.detectedMaterial];
    if (!mat) return;

    const methodLabels = {
      motion_sensor: 'Accelerometer Tap Test',
      camera_analysis: 'Camera Color Analysis',
      demo_override: 'Manual Override',
    };

    document.getElementById('result-icon').innerHTML = `<span class="animate-pop-in inline-block">${mat.icon}</span>`;
    document.getElementById('result-icon').className = `w-28 h-28 rounded-full flex items-center justify-center mb-6 text-5xl ${mat.iconBg}`;
    document.getElementById('result-title').textContent = mat.label;
    document.getElementById('result-title').className = `text-3xl font-extrabold mb-2 text-center animate-slide-up`;
    document.getElementById('result-subtitle').textContent = mat.subtitle;
    document.getElementById('result-material').textContent = mat.label;
    document.getElementById('result-material').className = `font-semibold ${mat.riskClass}`;
    document.getElementById('result-magnetic').textContent = mat.magnetic;
    document.getElementById('result-risk').textContent = mat.risk;
    document.getElementById('result-risk').className = `font-semibold ${mat.riskClass}`;
    document.getElementById('result-method').textContent = methodLabels[state.detectionMethod] || '—';
    document.getElementById('result-advice').textContent = mat.advice;
  }

  /**
   * Pre-fill the submission form with detection data.
   */
  function prepareSubmitForm() {
    const state = App.getState();
    const mat = MATERIALS[state.detectedMaterial];
    if (mat) {
      document.getElementById('field-material').value = mat.label;
    }
    // Reset form visibility
    document.getElementById('submit-form').classList.remove('hidden');
    document.getElementById('submit-success').classList.add('hidden');
  }

  /**
   * Simulate submitting the report to Baltimore HCD.
   */
  function submitReport() {
    const name = document.getElementById('field-name').value.trim();
    const address = document.getElementById('field-address').value.trim();

    if (!name || !address) {
      alert('Please fill in your name and address.');
      return;
    }

    // Generate mock reference number
    const refNum = 'BHC-' + Date.now().toString(36).toUpperCase().slice(-6);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    document.getElementById('submit-ref').textContent = refNum;
    document.getElementById('submit-date').textContent = dateStr;

    // Switch to success view
    document.getElementById('submit-form').classList.add('hidden');
    document.getElementById('submit-success').classList.remove('hidden');

    console.log(`[Results] Report submitted — Ref: ${refNum}`);
  }

  return { render, prepareSubmitForm, submitReport };
})();

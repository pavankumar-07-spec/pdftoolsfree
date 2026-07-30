/**
 * Time Zone Converter Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('tz-source-date')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Date:</label>
          <input type="date" id="tz-source-date" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Time:</label>
          <input type="time" id="tz-source-time" class="form-input" value="12:00" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">Source Time Zone:</label>
        <select id="tz-source-zone" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
          <option value="Asia/Kolkata">IST - India Standard Time (UTC+5:30)</option>
          <option value="UTC">UTC / GMT - Coordinated Universal Time (UTC+0)</option>
          <option value="America/New_York">EST / EDT - US Eastern Time (UTC-5 / UTC-4)</option>
          <option value="America/Chicago">CST / CDT - US Central Time (UTC-6 / UTC-5)</option>
          <option value="America/Los_Angeles">PST / PDT - US Pacific Time (UTC-8 / UTC-7)</option>
          <option value="Europe/London">GMT / BST - UK London Time (UTC+0 / UTC+1)</option>
          <option value="Europe/Paris">CET / CEST - Central European Time (UTC+1 / UTC+2)</option>
          <option value="Asia/Tokyo">JST - Japan Standard Time (UTC+9)</option>
          <option value="Australia/Sydney">AEST / AEDT - Sydney Australia (UTC+10 / UTC+11)</option>
        </select>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-tz-btn" class="btn btn-primary flex-1">🌍 Convert Across Global Time Zones</button>
      </div>
    `;

    document.getElementById('tz-source-date').value = new Date().toISOString().split('T')[0];
  }

  const targetZones = [
    { label: 'IST - India Standard Time', zone: 'Asia/Kolkata' },
    { label: 'UTC / GMT - Universal Time', zone: 'UTC' },
    { label: 'EST / EDT - US Eastern Time', zone: 'America/New_York' },
    { label: 'CST / CDT - US Central Time', zone: 'America/Chicago' },
    { label: 'PST / PDT - US Pacific Time', zone: 'America/Los_Angeles' },
    { label: 'GMT / BST - UK London', zone: 'Europe/London' },
    { label: 'CET / CEST - Central Europe', zone: 'Europe/Paris' },
    { label: 'JST - Japan Standard Time', zone: 'Asia/Tokyo' },
    { label: 'AEST / AEDT - Sydney', zone: 'Australia/Sydney' },
    { label: 'SGT - Singapore Time', zone: 'Asia/Singapore' },
    { label: 'GST - Gulf Standard Time (Dubai)', zone: 'Asia/Dubai' }
  ];

  function calculate() {
    const dateStr = document.getElementById('tz-source-date') ? document.getElementById('tz-source-date').value : '';
    const timeStr = document.getElementById('tz-source-time') ? document.getElementById('tz-source-time').value : '12:00';
    const sourceZone = document.getElementById('tz-source-zone') ? document.getElementById('tz-source-zone').value : 'Asia/Kolkata';

    if (!dateStr) {
      if (out) out.value = 'ERROR: Please select date and time to convert.';
      return;
    }

    // Construct local date time in source zone
    const isoString = `${dateStr}T${timeStr}:00`;
    // Create Date object assuming ISO formatted local string
    const inputDate = new Date(isoString);

    let res = `--- TIME ZONE CONVERTER RESULTS ---nn`;
    res += `Input Date-Time: ${dateStr} ${timeStr} (${sourceZone})nn`;
    res += `=== CONVERTED GLOBAL TIMES ===nn`;

    targetZones.forEach(tz => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.zone,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        }).format(inputDate);

        res += `• ${tz.label.padEnd(32)}: ${formatted}n`;
      } catch (e) {
        res += `• ${tz.label}: Error formatting timezonen`;
      }
    });

    if (out) out.value = res;
    if (window.showToast) window.showToast('Time zone conversion completed!', 'success');
  }

  const activeBtn = document.getElementById('calc-tz-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();
});

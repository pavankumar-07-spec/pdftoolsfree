/**
 * Upgraded Real Live World Clock Engine
 * Displays live, ticking multi-timezone clocks (UTC, IST, EST, PST, GMT, JST, AEST) updated every 1 second.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('clock-tz')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.5rem">
        <div>
          <label class="form-label">Primary Target Timezone</label>
          <select id="clock-tz" class="form-input">
            <option value="Asia/Kolkata" selected>🇮🇳 India Standard Time (IST - UTC+5:30)</option>
            <option value="America/New_York">🇺🇸 Eastern Time (EST/EDT - UTC-5)</option>
            <option value="America/Los_Angeles">🇺🇸 Pacific Time (PST/PDT - UTC-8)</option>
            <option value="UTC">🌐 Coordinated Universal Time (UTC)</option>
            <option value="Europe/London">🇬🇧 London (GMT/BST - UTC+0)</option>
            <option value="Asia/Tokyo">🇯🇵 Tokyo (JST - UTC+9)</option>
            <option value="Australia/Sydney">🇦🇺 Sydney (AEST - UTC+10)</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom:1rem">
        <h4 style="margin:0 0 0.5rem;font-size:0.95rem">⏱️ Live World Clock Status</h4>
        <div id="clock-live-card" style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border);text-align:center;font-family:monospace;font-size:1.4rem;font-weight:700;color:var(--primary)">
          Loading live clocks...
        </div>
      </div>
    `;
  }

  const liveCard = document.getElementById('clock-live-card');

  function updateClocks() {
    const now = new Date();
    const primaryTz = document.getElementById('clock-tz') ? document.getElementById('clock-tz').value : 'Asia/Kolkata';

    const timezones = [
      { name: '🇮🇳 IST (India)', tz: 'Asia/Kolkata' },
      { name: '🇺🇸 EST (New York)', tz: 'America/New_York' },
      { name: '🇺🇸 PST (Los Angeles)', tz: 'America/Los_Angeles' },
      { name: '🌐 UTC (Universal)', tz: 'UTC' },
      { name: '🇬🇧 GMT (London)', tz: 'Europe/London' },
      { name: '🇯🇵 JST (Tokyo)', tz: 'Asia/Tokyo' },
      { name: '🇦🇺 AEST (Sydney)', tz: 'Australia/Sydney' }
    ];

    let report = `==========================================================\n`;
    report += `                 LIVE WORLD CLOCK STATUS                  \n`;
    report += `==========================================================\n\n`;

    timezones.forEach(item => {
      const timeStr = now.toLocaleTimeString('en-US', { timeZone: item.tz, hour12: true });
      const dateStr = now.toLocaleDateString('en-US', { timeZone: item.tz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const isPrimary = item.tz === primaryTz ? ' 👈 PRIMARY' : '';
      report += `${item.name.padEnd(25)} : ${timeStr} | ${dateStr}${isPrimary}\n`;
    });

    report += `\n==========================================================\n`;
    report += `Status: 🟢 Live 1-Second Ticking Precision Active\n`;

    if (out) out.value = report;

    if (liveCard) {
      const primaryTime = now.toLocaleTimeString('en-US', { timeZone: primaryTz, hour12: true });
      liveCard.textContent = `⏱️ ${primaryTime} (${primaryTz.split('/')[1] || primaryTz})`;
    }
  }

  setInterval(updateClocks, 1000);
  updateClocks();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});

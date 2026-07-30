/**
 * World Clock Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('wc-clocks')) {
    inputsContainer.innerHTML = `
      <div id="wc-clocks" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      </div>
    `;
  }

  const cities = [
    { name: 'London (UTC / GMT)', zone: 'Europe/London' },
    { name: 'New York (EST)', zone: 'America/New_York' },
    { name: 'Tokyo (JST)', zone: 'Asia/Tokyo' },
    { name: 'New Delhi (IST)', zone: 'Asia/Kolkata' },
    { name: 'Paris (CET)', zone: 'Europe/Paris' },
    { name: 'Sydney (AEST)', zone: 'Australia/Sydney' }
  ];

  function updateClocks() {
    const now = new Date();
    let res = '--- WORLD CLOCK & TIME ZONES ---nn';

    cities.forEach(c => {
      const timeStr = now.toLocaleTimeString('en-US', { timeZone: c.zone, hour12: true });
      const dateStr = now.toLocaleDateString('en-US', { timeZone: c.zone, month: 'short', day: 'numeric', year: 'numeric' });
      res += `• ${c.name.padEnd(20)}: ${timeStr} (${dateStr})n`;
    });

    if (out) out.value = res;
  }

  setInterval(updateClocks, 1000);
  updateClocks();

  if (btn) btn.style.display = 'none';
});

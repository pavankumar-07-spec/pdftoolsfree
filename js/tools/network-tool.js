/**
 * Network Subnet & IP Information Calculator Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  try {

  const inputsContainer = document.getElementById('tool-inputs-container');
  const btn = document.getElementById('generate-btn');
  const out = document.getElementById('main-output');

  if (inputsContainer && !document.getElementById('nt-ip')) {
    inputsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem;margin-bottom:1rem">
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">IP Address:</label>
          <input type="text" id="nt-ip" class="form-input" value="192.168.1.1" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
        </div>
        <div>
          <label class="form-label" style="font-weight:600;display:block;margin-bottom:0.5rem">CIDR Subnet:</label>
          <select id="nt-cidr" class="form-input" style="width:100%;padding:0.5rem;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface-2);color:var(--text)">
            <option value="24">/24 (255.255.255.0 - 254 Hosts)</option>
            <option value="16">/16 (255.255.0.0 - 65,534 Hosts)</option>
            <option value="32">/32 (255.255.255.255 - Single Host)</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:1rem">
        <button id="calc-nt-btn" class="btn btn-primary flex-1">🌐 Calculate Network Subnet</button>
      </div>
    `;
  }

  function calculate() {
    const ip = document.getElementById('nt-ip') ? document.getElementById('nt-ip').value.trim() : '192.168.1.1';
    const cidr = parseInt(document.getElementById('nt-cidr') ? document.getElementById('nt-cidr').value : 24, 10) || 24;

    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      if (out) out.value = 'ERROR: Please enter a valid IPv4 address (e.g. 192.168.1.1).';
      return;
    }

    const usableHosts = cidr === 32 ? 1 : Math.pow(2, 32 - cidr) - 2;

    let res = `--- NETWORK SUBNET CALCULATOR REPORT ---nn`;
    res += `IP Address:  ${ip}n`;
    res += `CIDR Prefix: /${cidr}nn`;

    res += `=== SUBNET PROPERTIES ===n`;
    res += `• Subnet Mask:   ${cidr === 24 ? '255.255.255.0' : cidr === 16 ? '255.255.0.0' : '255.255.255.255'}n`;
    res += `• Usable Hosts:  ${usableHosts.toLocaleString()}n`;
    res += `• Network Type:  ${parts[0] === 10 || (parts[0] === 192 && parts[1] === 168) ? 'Private LAN' : 'Public IP'}n`;

    if (out) out.value = res;
    if (window.showToast) window.showToast(`Calculated /${cidr} Subnet (${usableHosts} Hosts)`, 'success');
  }

  const activeBtn = document.getElementById('calc-nt-btn') || btn;
  if (activeBtn) activeBtn.addEventListener('click', calculate);
  calculate();

  } catch (err) { if (window.showToast) window.showToast("Error: " + err.message, "error"); }
});

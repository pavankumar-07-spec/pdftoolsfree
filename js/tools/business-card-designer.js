/**
 * Business Card Designer Engine - Deep SEO Alignment
 */
document.addEventListener('DOMContentLoaded', () => {
  const nameIn = document.getElementById('bc-name');
  const titleIn = document.getElementById('bc-title');
  const compIn = document.getElementById('bc-company');
  const phoneIn = document.getElementById('bc-phone');
  const emailIn = document.getElementById('bc-email');
  const webIn = document.getElementById('bc-website');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const out = document.getElementById('main-output');

  function renderCard() {
    const name = nameIn ? nameIn.value : 'Sarah Jenkins';
    const jobTitle = titleIn ? titleIn.value : 'Creative Director';
    const comp = compIn ? compIn.value : 'Nexus Design Studio';
    const phone = phoneIn ? phoneIn.value : '+1 (555) 234-5678';
    const email = emailIn ? emailIn.value : 'sarah@nexusstudio.com';
    const web = webIn ? webIn.value : 'www.nexusstudio.com';

    const cardOutput = `┌──────────────────────────────────────────┐
│  ${comp.toUpperCase().padEnd(38)}│
│  ${name.padEnd(38)}│
│  ${jobTitle.padEnd(38)}│
│                                          │
│  📞 ${phone.padEnd(36)}│
│  ✉️  ${email.padEnd(36)}│
│  🌐 ${web.padEnd(36)}│
└──────────────────────────────────────────┘`;

    if (out) out.value = cardOutput;
    if (window.showToast) window.showToast('Business Card updated!', 'success');
  }

  if (btn) btn.addEventListener('click', renderCard);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([out ? out.value : ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-card-designer-output.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
    if (window.showToast) window.showToast('File downloaded successfully!', 'success');
    });
  }

  renderCard();
});
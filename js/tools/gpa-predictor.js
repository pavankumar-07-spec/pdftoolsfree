/**
 * GPA PREDICTOR - Real Calculation Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const v1 = document.getElementById('ac-val1');
  const v2 = document.getElementById('ac-val2');
  const input = document.getElementById('main-input');
  const btn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const out = document.getElementById('main-output');

  function calculate() {
    const val1 = parseFloat(v1 ? v1.value : 0) || 0;
    const val2 = parseFloat(v2 ? v2.value : 0) || 10;
    const rawText = input ? input.value : '';

    let resText = '';
    if ('gpa-predictor'.includes('cgpa-to-percentage')) {
      const pct10 = (val1 * 9.5).toFixed(2);
      const pct100 = (val1 * 10).toFixed(2);
      resText = `=== CGPA TO PERCENTAGE CONVERSION ===
Input CGPA: ${val1} (Scale: ${val2})

1. CBSE / Standard Formula (CGPA * 9.5): ${pct10}%
2. Direct Percentage Formula (CGPA * 10): ${pct100}%
Equivalent Grade Class: ${val1 >= 8 ? 'First Class with Distinction' : val1 >= 6.5 ? 'First Class' : 'Second Class'}`;
    } else if ('gpa-predictor'.includes('sgpa') || 'gpa-predictor'.includes('gpa')) {
      let totalCredits = 0;
      let totalGradePoints = 0;
      const lines = rawText.split('n');
      lines.forEach(l => {
        const parts = l.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
        if (parts.length >= 2) {
          const cred = parts[0];
          const gp = parts[1];
          totalCredits += cred;
          totalGradePoints += (cred * gp);
        }
      });

      const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : (val1).toFixed(2);
      resText = `=== GPA / SGPA CALCULATION REPORT ===
Total Course Credits: ${totalCredits || 'Default'}
Total Grade Points Earned: ${totalGradePoints.toFixed(2)}
Calculated SGPA / GPA: ${gpa}
Estimated Equivalent Percentage: ${(gpa * 9.5).toFixed(2)}%`;
    } else {
      const percentageNeeded = ((val1 / (val2 || 100)) * 100).toFixed(2);
      resText = `=== ACADEMIC MARKS & GRADE ANALYSIS ===
Target Score / Marks: ${val1}
Total Scale / Maximum: ${val2}
Required Target Percentage: ${percentageNeeded}%
Status: ${percentageNeeded >= 40 ? 'Passing Mark Attainable' : 'High Effort Required'}`;
    }

    if (out) out.value = resText;
    if (window.showToast) window.showToast('Calculation complete!', 'success');
  }

  if (btn) btn.addEventListener('click', calculate);
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([out ? out.value : ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gpa-predictor-report.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1000);
      if (window.showToast) window.showToast('Report downloaded!', 'success');
    });
  }

  calculate();
});
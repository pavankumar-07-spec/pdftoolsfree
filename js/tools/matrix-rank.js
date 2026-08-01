/**
 * Matrix Rank Engine (Gaussian Elimination)
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('mr-rows')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Rows</label><input type="number" id="mr-rows" class="form-input" value="3" min="2" max="5"></div>
        <div><label class="form-label">Cols</label><input type="number" id="mr-cols" class="form-input" value="3" min="2" max="5"></div>
      </div>
      <div id="mr-grid" style="margin-bottom:1.5rem"></div>
      <button id="calc-mr-btn" class="btn btn-primary" style="width:100%">📐 Compute Matrix Rank</button>
    `;
    buildGrid();
  }
  function buildGrid() {
    const rows = parseInt(document.getElementById('mr-rows')?.value)||3;
    const cols = parseInt(document.getElementById('mr-cols')?.value)||3;
    const g = document.getElementById('mr-grid');
    if (!g) return;
    const defs = [[1,2,3],[4,5,6],[7,8,9]];
    let html = '<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:0.5rem;max-width:350px">';
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      const v = (defs[r] && defs[r][c] !== undefined) ? defs[r][c] : 0;
      html += '<input type="number" id="mr_'+r+'_'+c+'" class="form-input" value="'+v+'" style="text-align:center">';
    }
    html += '</div>';
    g.innerHTML = html;
  }
  function calc() {
    try {
      const rows = parseInt(document.getElementById('mr-rows')?.value)||3;
      const cols = parseInt(document.getElementById('mr-cols')?.value)||3;
      const M = [];
      for(let r=0;r<rows;r++) { M[r]=[]; for(let c=0;c<cols;c++) M[r][c]=parseFloat(document.getElementById('mr_'+r+'_'+c)?.value)||0; }
      // Gaussian elimination
      const A = M.map(r => [...r]);
      let rank = 0;
      for(let c=0;c<cols && rank<rows;c++){
        let pivot=-1;
        for(let r=rank;r<rows;r++) if(Math.abs(A[r][c])>1e-10){pivot=r;break;}
        if(pivot===-1) continue;
        [A[rank],A[pivot]]=[A[pivot],A[rank]];
        const s=A[rank][c];
        for(let j=c;j<cols;j++) A[rank][j]/=s;
        for(let r=0;r<rows;r++){
          if(r===rank) continue;
          const f=A[r][c];
          for(let j=c;j<cols;j++) A[r][j]-=f*A[rank][j];
        }
        rank++;
      }
      let r2='==========================================================\n';
      r2+='             MATRIX RANK (Gaussian Elimination)\n';
      r2+='==========================================================\n';
      r2+='Dimensions: '+rows+'×'+cols+'\n\nROW ECHELON FORM:\n';
      A.forEach(row => { r2 += '  [ '+row.map(v => v.toFixed(3).padStart(8)).join(', ')+' ]\n'; });
      r2+='\n✅ Rank(A) = '+rank+'\n';
      r2+='==========================================================';
      if(out) out.value=r2;
      if(window.showToast) window.showToast('Rank = '+rank, 'success');
    } catch(e){ if(out) out.value='Error: '+e.message; }
  }
  const rI=document.getElementById('mr-rows'), cI=document.getElementById('mr-cols');
  if(rI) rI.onchange=buildGrid;
  if(cI) cI.onchange=buildGrid;
  const btn=document.getElementById('calc-mr-btn')||document.getElementById('generate-btn');
  if(btn) btn.onclick=calc;
  calc();
});
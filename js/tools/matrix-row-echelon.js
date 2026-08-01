/**
 * Matrix Row Echelon Form (REF/RREF) Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const ic = document.getElementById('tool-inputs-container');
  const out = document.getElementById('main-output');
  if (ic && !document.getElementById('mre-rows')) {
    ic.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><label class="form-label">Rows</label><input type="number" id="mre-rows" class="form-input" value="3" min="2" max="5"></div>
        <div><label class="form-label">Cols</label><input type="number" id="mre-cols" class="form-input" value="4" min="2" max="6"></div>
        <div><label class="form-label">Mode</label>
          <select id="mre-mode" class="form-input"><option value="rref" selected>RREF (Reduced)</option><option value="ref">REF</option></select>
        </div>
      </div>
      <div id="mre-grid" style="margin-bottom:1.5rem"></div>
      <button id="calc-mre-btn" class="btn btn-primary" style="width:100%">📐 Compute Row Echelon Form</button>
    `;
    buildGrid();
  }
  function buildGrid() {
    const rows = parseInt(document.getElementById('mre-rows')?.value)||3;
    const cols = parseInt(document.getElementById('mre-cols')?.value)||4;
    const g = document.getElementById('mre-grid');
    if (!g) return;
    const defs = [[1,2,-1,8],[2,-1,1,1],[-1,1,2,5]];
    let html = '<p style="font-size:0.85rem;margin-bottom:0.5rem;color:var(--text-secondary)">Augmented matrix [A|b]:</p>';
    html += '<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:0.5rem;max-width:500px">';
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      const v = (defs[r] && defs[r][c] !== undefined) ? defs[r][c] : 0;
      html += '<input type="number" id="mre_'+r+'_'+c+'" class="form-input" value="'+v+'" style="text-align:center">';
    }
    html += '</div>';
    g.innerHTML = html;
  }
  function calc() {
    try {
      const rows = parseInt(document.getElementById('mre-rows')?.value)||3;
      const cols = parseInt(document.getElementById('mre-cols')?.value)||4;
      const mode = document.getElementById('mre-mode')?.value || 'rref';
      const A = [];
      for(let r=0;r<rows;r++){A[r]=[];for(let c=0;c<cols;c++) A[r][c]=parseFloat(document.getElementById('mre_'+r+'_'+c)?.value)||0;}
      let rank=0;
      for(let c=0;c<cols&&rank<rows;c++){
        let pivot=-1;
        for(let r=rank;r<rows;r++) if(Math.abs(A[r][c])>1e-10){pivot=r;break;}
        if(pivot===-1) continue;
        [A[rank],A[pivot]]=[A[pivot],A[rank]];
        const s=A[rank][c];
        for(let j=c;j<cols;j++) A[rank][j]/=s;
        const start = mode==='rref' ? 0 : rank+1;
        for(let r=start;r<rows;r++){
          if(r===rank) continue;
          const f=A[r][c];
          for(let j=c;j<cols;j++) A[r][j]-=f*A[rank][j];
        }
        rank++;
      }
      let r2='==========================================================\n';
      r2+='             '+mode.toUpperCase()+' (Row Echelon Form)\n';
      r2+='==========================================================\n';
      r2+='Dimensions: '+rows+'×'+cols+'\n\nRESULT MATRIX:\n';
      A.forEach(row=>{r2+='  [ '+row.map(v=>v.toFixed(4).padStart(9)).join(', ')+' ]\n';});
      r2+='\nRank = '+rank+'\n';
      r2+='==========================================================';
      if(out) out.value=r2;
      if(window.showToast) window.showToast(mode.toUpperCase()+' computed! Rank = '+rank, 'success');
    } catch(e){ if(out) out.value='Error: '+e.message; }
  }
  const rI=document.getElementById('mre-rows'),cI=document.getElementById('mre-cols');
  if(rI) rI.onchange=buildGrid;
  if(cI) cI.onchange=buildGrid;
  const btn=document.getElementById('calc-mre-btn')||document.getElementById('generate-btn');
  if(btn) btn.onclick=calc;
  calc();
});
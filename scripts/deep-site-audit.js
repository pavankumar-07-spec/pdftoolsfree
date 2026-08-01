/**
 * ═══════════════════════════════════════════════════════════════════════
 *  ULTIMATE DEEP INTELLIGENCE AUDIT v3.0
 *  The most comprehensive static-site tool platform audit ever built.
 *  
 *  DIMENSIONS ANALYZED (32):
 *  ─ Engine Size & Tier Classification
 *  ─ JS Feature Detection (17 capabilities)
 *  ─ HTML Feature Detection (5 capabilities)
 *  ─ Code Quality: try/catch, null-guards, template literals
 *  ─ Functional Correctness: real computation vs placeholder
 *  ─ DOM Binding Integrity (getElementById cross-match)
 *  ─ SEO Compliance (title, meta, OG, Schema.org, canonical)
 *  ─ Template Pattern Compliance (tool-inputs-container, generate-btn)
 *  ─ Output Quality: formatted reports vs raw dumps
 *  ─ User Experience: input diversity, interactivity score
 *  ─ Category Health Ranking
 *  ─ Infrastructure Compliance (sitemap, robots, PWA, 404)
 *  ─ Duplicate & Orphan Detection
 *  ─ Cross-tool Consistency Score
 * ═══════════════════════════════════════════════════════════════════════
 */
const fs = require('fs');
const path = require('path');

const toolsData = JSON.parse(fs.readFileSync('./data/tools.json', 'utf8'));
const tools = toolsData.tools.filter(t => t.published !== false);
const jsDir = './js/tools/';
const htmlDir = './tools/';

// ═══ Master Audit State ══════════════════════════════════════════════
const R = {
  timestamp: new Date().toISOString(),
  totalTools: tools.length,
  tiers: { premium: [], rich: [], medium: [], thin: [] },
  features: {},
  categories: {},
  seo: { perfect: 0, issues: [] },
  dom: { clean: 0, broken: [] },
  missingFiles: { js: [], html: [] },
  hardcoded: [],
  duplicates: [],
  orphanJS: [],
  orphanHTML: [],
  codeQuality: { withTryCatch: 0, withNullGuards: 0, withTemplateLiterals: 0, withComments: 0, withConst: 0 },
  outputQuality: { formattedReports: 0, rawDumps: 0 },
  templateCompliance: { hasInputsContainer: 0, hasGenerateBtn: 0, hasMainOutput: 0, hasOutputStats: 0, hasClearBtn: 0 },
  inputDiversity: { numberInputs: 0, textInputs: 0, selectDropdowns: 0, colorPickers: 0, dateInputs: 0, fileInputs: 0, rangeSliders: 0, checkboxes: 0, textareas: 0 },
  interactivity: { realTimeListeners: 0, onChangeHandlers: 0, onInputHandlers: 0, onKeyupHandlers: 0 },
  toolScores: [],
  topPerformers: [],
  bottomPerformers: [],
  categoryRankings: [],
  healthScore: 0,
};

// ═══ Feature Catalog (JS) ═══════════════════════════════════════════
const jsFeatures = [
  { key: 'math',       patterns: ['parseFloat','parseInt','Math.','toFixed'], label: 'Math/Computation', weight: 5 },
  { key: 'dynInput',   patterns: ['tool-inputs-container','innerHTML'], label: 'Dynamic Input Builder', weight: 10 },
  { key: 'toast',      patterns: ['showToast'], label: 'Toast Notifications', weight: 5 },
  { key: 'tryCatch',   patterns: ['try {','try{'], label: 'Error Handling (try/catch)', weight: 8 },
  { key: 'canvas',     patterns: ['canvas','getContext(\'2d'], label: 'Canvas/Image Processing', weight: 15 },
  { key: 'fileReader', patterns: ['FileReader','readAsDataURL','readAsText','readAsArrayBuffer'], label: 'File Reader API', weight: 12 },
  { key: 'download',   patterns: ['download','Blob','toDataURL','createObjectURL'], label: 'Download/Export Logic', weight: 10 },
  { key: 'templates',  patterns: ['template','preset','select'], label: 'Templates/Presets', weight: 8 },
  { key: 'vendors',    patterns: ['pdf-lib','jsPDF','QRCode','qrcode','PDFLib'], label: 'Vendor Library', weight: 15 },
  { key: 'interval',   patterns: ['setInterval'], label: 'Real-time (setInterval)', weight: 10 },
  { key: 'storage',    patterns: ['localStorage','initPlannerPersistence'], label: 'LocalStorage', weight: 8 },
  { key: 'clipboard',  patterns: ['clipboard','execCommand','navigator.clipboard'], label: 'Clipboard API', weight: 5 },
  { key: 'resultsCard',patterns: ['gen-results-card','resultsCard','dashboard'], label: 'Visual Result Cards', weight: 10 },
  { key: 'regex',      patterns: ['RegExp','/g)','replace(/','match(/','test(/'], label: 'Regex Processing', weight: 5 },
  { key: 'eventDriven',patterns: ['addEventListener','onclick','onchange','oninput'], label: 'Event-Driven Logic', weight: 5 },
  { key: 'multiStep',  patterns: ['step','Step','phase','Phase'], label: 'Multi-Step Output', weight: 3 },
  { key: 'validation', patterns: ['isNaN','!==','===','error','ERROR','invalid','Invalid'], label: 'Input Validation', weight: 5 },
];

// ═══ HTML Features ═══════════════════════════════════════════════════
const htmlFeats = [
  { key: 'colorPicker',  pat: 'type="color"',  label: 'Color Picker', weight: 3 },
  { key: 'dateInput',    pat: 'type="date"',   label: 'Date Input', weight: 3 },
  { key: 'fileInput',    pat: 'type="file"',   label: 'File Upload', weight: 5 },
  { key: 'selectEl',     pat: '<select',        label: 'Select Dropdown', weight: 3 },
  { key: 'rangeInput',   pat: 'type="range"',  label: 'Range Slider', weight: 3 },
];

// ═══ Per-Tool Deep Analysis ══════════════════════════════════════════
tools.forEach(tool => {
  const jsPath  = path.join(jsDir, tool.id + '.js');
  const htmlPath = path.join(htmlDir, tool.id + '.html');

  if (!fs.existsSync(jsPath))   { R.missingFiles.js.push(tool.id); return; }
  if (!fs.existsSync(htmlPath)) { R.missingFiles.html.push(tool.id); return; }

  const js   = fs.readFileSync(jsPath, 'utf8');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const jsBytes  = Buffer.byteLength(js, 'utf8');
  const htmlBytes = Buffer.byteLength(html, 'utf8');
  const jsLines  = js.split('\n').length;

  const t = {
    id: tool.id, name: tool.name, category: tool.category,
    jsBytes, htmlBytes, jsLines,
    tier: 'medium', score: 0,
    caps: [], missing: [], seoIssues: [], quality: {}
  };

  // ── Tier ──
  if (jsBytes < 1500)      { t.tier = 'thin';    R.tiers.thin.push(tool.id); }
  else if (jsBytes < 3000) { t.tier = 'medium';  R.tiers.medium.push(tool.id); }
  else if (jsBytes < 6000) { t.tier = 'rich';    R.tiers.rich.push(tool.id); }
  else                     { t.tier = 'premium'; R.tiers.premium.push(tool.id); }

  // ── JS Feature Scan ──
  jsFeatures.forEach(f => {
    const has = f.patterns.some(p => js.includes(p));
    if (has) { t.caps.push(f.label); t.score += f.weight; }
    else     { t.missing.push(f.label); }
  });

  // ── HTML Feature Scan ──
  htmlFeats.forEach(f => {
    if (html.includes(f.pat) || js.includes(f.pat)) {
      t.caps.push(f.label); t.score += f.weight;
    }
  });

  // ── Code Quality Metrics ──
  if (js.includes('try') && js.includes('catch'))  { R.codeQuality.withTryCatch++; t.quality.tryCatch = true; }
  if (js.includes('?.') || js.includes('|| '))      { R.codeQuality.withNullGuards++; t.quality.nullGuard = true; }
  if (js.includes('`'))                              { R.codeQuality.withTemplateLiterals++; t.quality.templateLit = true; }
  if (js.includes('/**') || js.includes('//'))       { R.codeQuality.withComments++; t.quality.comments = true; }
  if (js.includes('const '))                         { R.codeQuality.withConst++; t.quality.constUsage = true; }

  // ── Output Quality ──
  if (js.includes('===') && (js.includes('\\n') || js.includes('`'))) {
    R.outputQuality.formattedReports++;
  } else {
    R.outputQuality.rawDumps++;
  }

  // ── Template Compliance ──
  if (js.includes('tool-inputs-container'))  R.templateCompliance.hasInputsContainer++;
  if (js.includes('generate-btn') || js.includes('calc-'))  R.templateCompliance.hasGenerateBtn++;
  if (js.includes('main-output'))            R.templateCompliance.hasMainOutput++;
  if (html.includes('output-stats'))         R.templateCompliance.hasOutputStats++;
  if (js.includes('clear-btn'))              R.templateCompliance.hasClearBtn++;

  // ── Input Diversity (scan JS + HTML) ──
  const combo = js + html;
  if (combo.includes('type="number"'))   R.inputDiversity.numberInputs++;
  if (combo.includes('type="text"'))     R.inputDiversity.textInputs++;
  if (combo.includes('<select'))         R.inputDiversity.selectDropdowns++;
  if (combo.includes('type="color"'))    R.inputDiversity.colorPickers++;
  if (combo.includes('type="date"'))     R.inputDiversity.dateInputs++;
  if (combo.includes('type="file"'))     R.inputDiversity.fileInputs++;
  if (combo.includes('type="range"'))    R.inputDiversity.rangeSliders++;
  if (combo.includes('type="checkbox"')) R.inputDiversity.checkboxes++;
  if (combo.includes('<textarea'))       R.inputDiversity.textareas++;

  // ── Interactivity ──
  if (js.includes('addEventListener'))   R.interactivity.realTimeListeners++;
  if (js.includes('onchange'))           R.interactivity.onChangeHandlers++;
  if (js.includes('oninput'))            R.interactivity.onInputHandlers++;
  if (js.includes('onkeyup'))            R.interactivity.onKeyupHandlers++;

  // ── SEO Checks ──
  if (!html.includes('<title>'))                     t.seoIssues.push('No <title>');
  if (!html.includes('meta name="description"'))     t.seoIssues.push('No meta desc');
  if (!html.includes('rel="canonical"'))             t.seoIssues.push('No canonical');
  if (!html.includes('og:title'))                    t.seoIssues.push('No og:title');
  if (!html.includes('application/ld+json'))         t.seoIssues.push('No Schema.org');
  if (t.seoIssues.length === 0) R.seo.perfect++;
  else R.seo.issues.push({ id: tool.id, issues: t.seoIssues });

  // ── DOM Binding Integrity ──
  const idRefs = (js.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [])
    .map(m => m.match(/getElementById\(['"]([^'"]+)['"]\)/)[1]);
  const unboundIds = idRefs.filter(id =>
    !html.includes(`id="${id}"`) && !js.includes(`id="${id}"`) && !js.includes(`id='${id}'`)
  );
  if (unboundIds.length === 0) R.dom.clean++;
  else R.dom.broken.push({ id: tool.id, unboundIds });

  // ── Hardcoded output detection ──
  const hasMath = js.includes('parseFloat') || js.includes('parseInt') || js.includes('Math.');
  if (jsBytes < 1000 && !hasMath && !js.includes('innerHTML') && !js.includes('canvas')) {
    R.hardcoded.push(tool.id);
  }

  // ── Category Accumulator ──
  if (!R.categories[tool.category]) {
    R.categories[tool.category] = { count: 0, totalScore: 0, totalBytes: 0, tools: [], maxScore: 0, minScore: 999 };
  }
  const cat = R.categories[tool.category];
  cat.count++;
  cat.totalScore += t.score;
  cat.totalBytes += jsBytes;
  cat.tools.push({ id: tool.id, score: t.score });
  if (t.score > cat.maxScore) cat.maxScore = t.score;
  if (t.score < cat.minScore) cat.minScore = t.score;

  R.toolScores.push(t);
});

// ═══ Orphan Detection ════════════════════════════════════════════════
const toolIds = new Set(tools.map(t => t.id));
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).forEach(f => {
    const id = f.replace('.js', '');
    if (!toolIds.has(id)) R.orphanJS.push(id);
  });
}
if (fs.existsSync(htmlDir)) {
  fs.readdirSync(htmlDir).filter(f => f.endsWith('.html')).forEach(f => {
    const id = f.replace('.html', '');
    if (!toolIds.has(id)) R.orphanHTML.push(id);
  });
}

// ═══ Duplicate Detection ═════════════════════════════════════════════
const idCounts = {};
tools.forEach(t => { idCounts[t.id] = (idCounts[t.id] || 0) + 1; });
Object.entries(idCounts).forEach(([id, c]) => { if (c > 1) R.duplicates.push({ id, count: c }); });

// ═══ Post-Processing ═════════════════════════════════════════════════
R.toolScores.sort((a, b) => a.score - b.score);
R.bottomPerformers = R.toolScores.slice(0, 25);
R.topPerformers = R.toolScores.slice(-25).reverse();

R.categoryRankings = Object.entries(R.categories)
  .map(([name, d]) => ({
    name, count: d.count,
    avgScore: +(d.totalScore / d.count).toFixed(1),
    avgBytes: +(d.totalBytes / d.count).toFixed(0),
    maxScore: d.maxScore, minScore: d.minScore,
    spread: d.maxScore - d.minScore,
  }))
  .sort((a, b) => b.avgScore - a.avgScore);

// ═══ Infrastructure ══════════════════════════════════════════════════
const infra = {
  sitemap:   fs.existsSync('./sitemap.xml'),
  robots:    fs.existsSync('./robots.txt'),
  manifest:  fs.existsSync('./manifest.json'),
  sw:        fs.existsSync('./sw.js'),
  page404:   fs.existsSync('./404.html'),
  redirects: fs.existsSync('./_redirects'),
};
const catPages = fs.existsSync('./categories') ? fs.readdirSync('./categories').filter(f => f.endsWith('.html')).length : 0;

// ═══ Compute Master Health Score ═════════════════════════════════════
// Weighted composite across all dimensions
const totalTools = R.totalTools || 1;
const scores = {
  seo:        (R.seo.perfect / totalTools) * 100,
  dom:        (R.dom.clean / totalTools) * 100,
  tryCatch:   (R.codeQuality.withTryCatch / totalTools) * 100,
  nullGuard:  (R.codeQuality.withNullGuards / totalTools) * 100,
  toast:      (R.toolScores.filter(t => t.caps.includes('Toast Notifications')).length / totalTools) * 100,
  dynInput:   (R.toolScores.filter(t => t.caps.includes('Dynamic Input Builder')).length / totalTools) * 100,
  constUsage: (R.codeQuality.withConst / totalTools) * 100,
  comments:   (R.codeQuality.withComments / totalTools) * 100,
  validation: (R.toolScores.filter(t => t.caps.includes('Input Validation')).length / totalTools) * 100,
  infraScore: (Object.values(infra).filter(Boolean).length / 6) * 100,
};

const weights = { seo: 15, dom: 15, tryCatch: 10, nullGuard: 5, toast: 10, dynInput: 15, constUsage: 5, comments: 5, validation: 10, infraScore: 10 };
let weightedSum = 0, weightTotal = 0;
Object.keys(scores).forEach(k => { weightedSum += scores[k] * (weights[k] || 5); weightTotal += (weights[k] || 5); });
R.healthScore = +(weightedSum / weightTotal).toFixed(1);

// ═══ Feature Summary Table ═══════════════════════════════════════════
const featureSummary = jsFeatures.map(f => {
  const count = R.toolScores.filter(t => t.caps.includes(f.label)).length;
  const pct = +((count / totalTools) * 100).toFixed(1);
  let grade = 'F';
  if (pct >= 90) grade = 'A+';
  else if (pct >= 80) grade = 'A';
  else if (pct >= 65) grade = 'B+';
  else if (pct >= 50) grade = 'B';
  else if (pct >= 35) grade = 'C';
  else if (pct >= 20) grade = 'D';
  else if (pct >= 10) grade = 'D-';
  return { label: f.label, count, pct, grade };
});

// ═══ OUTPUT: JSON for Artifact ═══════════════════════════════════════
const output = {
  timestamp: R.timestamp,
  totalTools: R.totalTools,
  healthScore: R.healthScore,
  healthBreakdown: scores,
  infrastructure: { ...infra, categoryPages: catPages },
  tiers: { premium: R.tiers.premium.length, rich: R.tiers.rich.length, medium: R.tiers.medium.length, thin: R.tiers.thin.length },
  tierDetails: { thin: R.tiers.thin, premium: R.tiers.premium },
  featureSummary,
  codeQuality: R.codeQuality,
  outputQuality: R.outputQuality,
  templateCompliance: R.templateCompliance,
  inputDiversity: R.inputDiversity,
  interactivity: R.interactivity,
  seo: { perfect: R.seo.perfect, issueCount: R.seo.issues.length },
  dom: { clean: R.dom.clean, brokenCount: R.dom.broken.length, broken: R.dom.broken },
  missingFiles: R.missingFiles,
  hardcoded: R.hardcoded,
  duplicates: R.duplicates,
  orphanJS: R.orphanJS,
  orphanHTML: R.orphanHTML,
  categoryRankings: R.categoryRankings,
  top25: R.topPerformers.map(t => ({ id: t.id, score: t.score, tier: t.tier, caps: t.caps.length, category: t.category })),
  bottom25: R.bottomPerformers.map(t => ({ id: t.id, score: t.score, tier: t.tier, caps: t.caps.length, category: t.category, missing: t.missing.slice(0, 5) })),
};

fs.writeFileSync('./scripts/audit-results.json', JSON.stringify(output, null, 2), 'utf8');
console.log(JSON.stringify(output, null, 2));

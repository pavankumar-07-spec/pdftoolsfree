/**
 * Phase 1: AST-Based Tool Classification & ID Extraction
 * 
 * Analyzes all JS engine files to:
 * 1. Extract every DOM ID/selector referenced
 * 2. Detect self-injecting engines (those that replace inputsContainer.innerHTML)
 * 3. Classify each tool into a UI archetype
 * 4. Identify mismatches between HTML template and JS engine expectations
 * 
 * Output: data/tool-ui-classification.json
 */

const fs = require('fs');
const path = require('path');

const jsToolsDir = path.join(__dirname, '../js/tools');
const htmlToolsDir = path.join(__dirname, '../tools');
const outputFile = path.join(__dirname, '../data/tool-ui-classification.json');

// ── 1. Extract DOM IDs from JS source code ───────────────────────────
function extractDOMIds(jsSource) {
  const ids = new Set();
  
  // Match getElementById('...')  and  getElementById("...")
  const getByIdRegex = /getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = getByIdRegex.exec(jsSource)) !== null) {
    ids.add(match[1]);
  }
  
  // Match querySelector('#...')
  const qsIdRegex = /querySelector\s*\(\s*['"]#([^'"]+)['"]\s*\)/g;
  while ((match = qsIdRegex.exec(jsSource)) !== null) {
    ids.add(match[1]);
  }
  
  // Match querySelectorAll with ID selectors
  const qsaIdRegex = /querySelectorAll\s*\(\s*['"]#([^'"]+)['"]\s*\)/g;
  while ((match = qsaIdRegex.exec(jsSource)) !== null) {
    ids.add(match[1]);
  }

  return Array.from(ids);
}

// ── 2. Detect if JS engine self-injects its own input HTML ───────────
function detectSelfInjection(jsSource) {
  return /inputsContainer\s*\.innerHTML\s*=/.test(jsSource) ||
         /tool-inputs-container.*\.innerHTML\s*=/.test(jsSource);
}

// ── 3. Extract what input types the self-injected HTML contains ──────
function extractInjectedInputTypes(jsSource) {
  const types = new Set();
  
  // Extract the innerHTML template string
  const innerHTMLMatch = jsSource.match(/inputsContainer\s*\.innerHTML\s*=\s*`([^`]+)`/s);
  if (!innerHTMLMatch) return [];
  
  const template = innerHTMLMatch[1];
  
  if (/type\s*=\s*["']?color/i.test(template)) types.add('color');
  if (/type\s*=\s*["']?file/i.test(template)) {
    if (/accept\s*=\s*["'][^"']*image/i.test(template)) types.add('image-upload');
    else if (/accept\s*=\s*["'][^"']*pdf/i.test(template) || /\.pdf/i.test(template)) types.add('pdf-upload');
    else types.add('file-upload');
  }
  if (/type\s*=\s*["']?number/i.test(template)) types.add('number');
  if (/type\s*=\s*["']?range/i.test(template)) types.add('range');
  if (/type\s*=\s*["']?date/i.test(template)) types.add('date');
  if (/type\s*=\s*["']?time/i.test(template)) types.add('time');
  if (/<textarea/i.test(template)) types.add('textarea');
  if (/<select/i.test(template)) types.add('select');
  if (/<canvas/i.test(template)) types.add('canvas');
  
  return Array.from(types);
}

// ── 4. Classify into UI Archetype ────────────────────────────────────
function classifyArchetype(slug, jsSource, domIds, selfInjecting, injectedInputTypes) {
  // Check for known patterns in the JS source
  const usesCanvas = /getContext\s*\(\s*['"]2d['"]\s*\)/.test(jsSource) || /canvas/i.test(jsSource);
  const usesPdfLib = /pdf-lib|PDFDocument|PDFLib/i.test(jsSource);
  const usesFileReader = /FileReader|arrayBuffer|readAsDataURL|readAsArrayBuffer/i.test(jsSource);
  const usesSetInterval = /setInterval|requestAnimationFrame/i.test(jsSource);
  const hasHealthIds = domIds.some(id => id.startsWith('health-'));
  const hasTextInput = domIds.includes('text-input');
  const hasCpHex = domIds.includes('cp-hex') || domIds.includes('cp-color');
  
  // Self-injecting engines that already build proper UI
  if (selfInjecting) {
    if (injectedInputTypes.includes('pdf-upload')) return 'pdf-upload-self';
    if (injectedInputTypes.includes('image-upload')) return 'image-upload-self';
    if (injectedInputTypes.includes('color')) return 'color-self';
    if (injectedInputTypes.includes('file-upload')) return 'file-upload-self';
    if (injectedInputTypes.includes('canvas')) return 'canvas-self';
    if (injectedInputTypes.includes('date') || injectedInputTypes.includes('time')) return 'datetime-self';
    if (injectedInputTypes.includes('number') && !injectedInputTypes.includes('textarea')) return 'calculator-self';
    if (injectedInputTypes.includes('textarea')) return 'text-self';
    if (injectedInputTypes.includes('select')) return 'config-self';
    return 'custom-self';
  }
  
  // Non-self-injecting: relies on HTML template
  if (hasHealthIds) return 'health-template';
  if (hasTextInput) return 'text-template';
  if (usesPdfLib) return 'pdf-needs-fix';
  if (usesCanvas && usesFileReader) return 'image-needs-fix';
  if (usesSetInterval) return 'timer-needs-fix';
  
  return 'unknown';
}

// ── 5. Detect HTML template type currently in the HTML file ──────────
function detectHTMLTemplate(htmlSource) {
  if (/Sample text content for/i.test(htmlSource)) return 'generic-text';
  if (/health-age/.test(htmlSource) && /health-weight/.test(htmlSource)) return 'generic-health';
  if (/pdf-file/.test(htmlSource) && /pdf-range/.test(htmlSource) && /pdf-mode/.test(htmlSource)) return 'generic-pdf';
  return 'custom';
}

// ── 6. Main Classification Pipeline ─────────────────────────────────
function run() {
  const jsFiles = fs.readdirSync(jsToolsDir).filter(f => f.endsWith('.js'));
  
  const results = [];
  const archetypeCounts = {};
  const templateCounts = {};
  let selfInjectingCount = 0;
  let mismatchCount = 0;
  
  for (const jsFile of jsFiles) {
    const slug = jsFile.replace('.js', '');
    const jsPath = path.join(jsToolsDir, jsFile);
    const htmlPath = path.join(htmlToolsDir, slug + '.html');
    
    const jsSource = fs.readFileSync(jsPath, 'utf8');
    const domIds = extractDOMIds(jsSource);
    const selfInjecting = detectSelfInjection(jsSource);
    const injectedInputTypes = selfInjecting ? extractInjectedInputTypes(jsSource) : [];
    const archetype = classifyArchetype(slug, jsSource, domIds, selfInjecting, injectedInputTypes);
    
    if (selfInjecting) selfInjectingCount++;
    
    // Check HTML template
    let htmlTemplate = 'missing';
    let htmlExists = false;
    if (fs.existsSync(htmlPath)) {
      htmlExists = true;
      const htmlSource = fs.readFileSync(htmlPath, 'utf8');
      htmlTemplate = detectHTMLTemplate(htmlSource);
    }
    
    // Detect mismatch: HTML has generic template but JS self-injects proper UI
    const isMismatch = selfInjecting && htmlTemplate !== 'custom';
    if (isMismatch) mismatchCount++;
    
    // Check if JS needs specific IDs that may be missing from HTML
    const criticalIds = domIds.filter(id => 
      !['tool-inputs-container', 'generate-btn', 'main-output', 'output-stats',
        'text-input', 'health-age', 'health-weight', 'health-height', 'health-gender',
        'pdf-file', 'pdf-range', 'pdf-mode', 'download-btn', 'clear-btn',
        'file-list', 'calc-results-card', 'calc-output', 'disclaimer-card',
        'theme-toggle-btn', 'nav-hamburger', 'nav-mobile-drawer'].includes(id)
    );
    
    archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
    templateCounts[htmlTemplate] = (templateCounts[htmlTemplate] || 0) + 1;
    
    results.push({
      slug,
      archetype,
      selfInjecting,
      injectedInputTypes,
      htmlTemplate,
      htmlExists,
      isMismatch,
      requiredDOMIds: domIds,
      customIds: criticalIds,
      needsHTMLFix: !selfInjecting && htmlTemplate !== 'custom'
    });
  }
  
  // Sort by archetype for readability
  results.sort((a, b) => a.archetype.localeCompare(b.archetype) || a.slug.localeCompare(b.slug));
  
  // Write classification output
  const output = {
    generatedAt: new Date().toISOString(),
    totalTools: results.length,
    selfInjectingEngines: selfInjectingCount,
    mismatchedTemplates: mismatchCount,
    archetypeCounts,
    templateCounts,
    tools: results
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  
  // ── Console Report ────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║     PHASE 1: TOOL UI CLASSIFICATION & ID EXTRACTION        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Total JS Engine Files Analyzed:  ${results.length}`);
  console.log(`Self-Injecting Engines:          ${selfInjectingCount} (build their own UI at runtime)`);
  console.log(`Mismatched Templates:            ${mismatchCount} (generic HTML but JS fixes it)`);
  console.log('');
  
  console.log('── Archetype Distribution ──────────────────────────────────');
  const sortedArchetypes = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1]);
  for (const [arch, count] of sortedArchetypes) {
    const bar = '█'.repeat(Math.min(count, 50));
    const suffix = arch.endsWith('-self') ? ' ✅ (self-injecting, good)' : 
                   arch.endsWith('-template') ? ' ⚠️  (uses generic template)' :
                   arch.endsWith('-needs-fix') ? ' 🔴 (needs HTML + JS fix)' : '';
    console.log(`  ${arch.padEnd(22)} ${String(count).padStart(4)}  ${bar}${suffix}`);
  }
  
  console.log('');
  console.log('── HTML Template Distribution ──────────────────────────────');
  for (const [tmpl, count] of Object.entries(templateCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tmpl.padEnd(22)} ${String(count).padStart(4)}`);
  }
  
  // Report tools that are NOT self-injecting and have wrong templates
  const needsFix = results.filter(t => t.needsHTMLFix);
  if (needsFix.length > 0) {
    console.log('');
    console.log(`── Tools Needing HTML Template Fix (${needsFix.length}) ─────────────────`);
    for (const t of needsFix.slice(0, 20)) {
      console.log(`  ${t.slug.padEnd(40)} [${t.htmlTemplate}] → archetype: ${t.archetype}`);
    }
    if (needsFix.length > 20) {
      console.log(`  ... and ${needsFix.length - 20} more (see data/tool-ui-classification.json)`);
    }
  }
  
  // Report tools whose JS engines are health-template clones (biggest issue)
  const healthClones = results.filter(t => t.archetype === 'health-template');
  if (healthClones.length > 0) {
    console.log('');
    console.log(`── 🚨 Health Template Clones (${healthClones.length}) — JS engine is BMI copy ──`);
    for (const t of healthClones) {
      console.log(`  ${t.slug}`);
    }
  }
  
  console.log('');
  console.log(`📄 Full classification written to: data/tool-ui-classification.json`);
  console.log('');
}

run();

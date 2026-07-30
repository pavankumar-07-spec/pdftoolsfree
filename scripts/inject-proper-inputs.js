/**
 * Phase 2: Archetype Component Builder & Dynamic Injection Script
 * 
 * Synchronizes HTML tool files with their classified archetypes and JS requirements.
 * Replaces generic/outdated HTML fallback controls with archetype-specific, purpose-built HTML.
 * 
 * Usage:
 *   node scripts/inject-proper-inputs.js [--apply] [--category=pdf,image] [--slug=tool-name]
 */

const fs = require('fs');
const path = require('path');

const classificationPath = path.join(__dirname, '../data/tool-ui-classification.json');
const htmlToolsDir = path.join(__dirname, '../tools');

if (!fs.existsSync(classificationPath)) {
  console.error('Classification data not found! Please run scripts/classify-tool-templates.js first.');
  process.exit(1);
}

const classificationData = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));

// Parse CLI Arguments
const args = process.argv.slice(2);
const isApply = args.includes('--apply');
const categoryArg = args.find(a => a.startsWith('--category='));
const slugArg = args.find(a => a.startsWith('--slug='));

const filterCategories = categoryArg ? categoryArg.split('=')[1].split(',') : null;
const filterSlug = slugArg ? slugArg.split('=')[1] : null;

// ── Archetype Fallback HTML Generators ───────────────────────────────
function getArchetypeHTML(tool) {
  const name = tool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  switch (tool.archetype) {
    case 'pdf-upload-self':
      return `
      <div class="mb-4">
        <label class="form-label" for="pdf-file">Select PDF File(s)</label>
        <input type="file" id="pdf-file" class="form-input" accept=".pdf,application/pdf" multiple>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="generate-btn" class="btn btn-primary flex-1">📎 Process PDF Document</button>
      </div>`;

    case 'image-upload-self':
    case 'image-needs-fix':
      return `
      <div class="mb-4">
        <label class="form-label" for="image-file">Select Image File(s)</label>
        <input type="file" id="image-file" class="form-input" accept="image/*" multiple>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="generate-btn" class="btn btn-primary flex-1">🖼️ Process Image Task</button>
      </div>`;

    case 'color-self':
      return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><label class="form-label">Color Picker</label><input type="color" id="cp-color" class="form-input" value="#FF5A1F"></div>
        <div><label class="form-label">HEX Code</label><input type="text" id="cp-hex" class="form-input" value="#FF5A1F"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="generate-btn" class="btn btn-primary flex-1">🎨 Inspect & Calculate Color</button>
      </div>`;

    case 'calculator-self':
    case 'custom-self':
    case 'datetime-self':
      return `
      <div class="mb-4">
        <label class="form-label">Parameters / Inputs</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="calc-inputs-wrapper">
          <input type="number" class="form-input" placeholder="Enter primary value...">
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button id="generate-btn" class="btn btn-primary flex-1">⚡ Calculate ${name}</button>
      </div>`;

    case 'text-self':
    case 'text-template':
    default:
      return `
    <div class="mb-4" style="margin-bottom:1rem">
      <label class="form-label">Input Text / Payload:</label>
      <textarea id="text-input" class="form-input" style="width:100%;height:120px" placeholder="Enter text or content for ${name.toLowerCase()}..."></textarea>
    </div>
    <div class="flex gap-3 mt-4" style="display:flex;gap:0.75rem">
      <button id="generate-btn" class="btn btn-primary flex-1">📊 Process ${name}</button>
    </div>`;
  }
}

// Fix specific DOM ID mismatches
const fixMap = {
  'anagram-generator': {
    targetBtn: 'calc-ag-btn'
  }
};

let countProcessed = 0;
let countModified = 0;

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║     PHASE 2: ARCHETYPE HTML TEMPLATE INJECTION               ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
console.log(`Mode: ${isApply ? '🚀 APPLY CHANGES TO FILES' : '🔍 DRY-RUN PREVIEW (Pass --apply to save)'}`);
if (filterCategories) console.log(`Category Filter: ${filterCategories.join(', ')}`);
if (filterSlug) console.log(`Slug Filter: ${filterSlug}`);
console.log('');

classificationData.tools.forEach(tool => {
  if (filterSlug && tool.slug !== filterSlug) return;
  if (!tool.htmlExists) return;

  const htmlPath = path.join(htmlToolsDir, tool.slug + '.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  countProcessed++;

  // Replace #tool-inputs-container content with archetype-aligned HTML
  const inputsContainerRegex = /(<div id="tool-inputs-container">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>)/;
  
  // Check generic text string replacement
  const genericTextStr = `Sample text content for ${tool.slug.replace(/-/g, ' ')}`;
  const genericHealthStr = `health-age`;

  let needsUpdate = false;
  let newHtml = html;

  if (html.includes(genericTextStr) || (html.includes(genericHealthStr) && tool.slug !== 'bmi-calculator')) {
    const archetypeHTML = getArchetypeHTML(tool);
    
    // Smoothly replace generic inputs inside tool-inputs-container
    newHtml = html.replace(/(<div id="tool-inputs-container">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>)/, (match, p1, p2) => {
      return `${p1}\n${archetypeHTML}\n</div>\n</div>\n</div>`;
    });

    needsUpdate = true;
  }

  // Check specific fix map (e.g. anagram-generator)
  if (fixMap[tool.slug]) {
    const fix = fixMap[tool.slug];
    if (fix.targetBtn && !newHtml.includes(fix.targetBtn)) {
      newHtml = newHtml.replace('id="generate-btn"', `id="${fix.targetBtn}"`);
      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    countModified++;
    console.log(`  [${isApply ? 'MODIFIED' : 'WOULD MODIFY'}] ${tool.slug}.html → archetype: ${tool.archetype}`);
    if (isApply) {
      fs.writeFileSync(htmlPath, newHtml, 'utf8');
    }
  }
});

console.log(`\n--- SUMMARY ---`);
console.log(`Total HTML Tools Checked:  ${countProcessed}`);
console.log(`Files Updated/Synchronized: ${countModified}`);
if (!isApply && countModified > 0) {
  console.log(`\n👉 Run with '--apply' flag to write these changes to disk.`);
}

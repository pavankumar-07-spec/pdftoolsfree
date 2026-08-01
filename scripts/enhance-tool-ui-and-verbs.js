const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

function getNaturalActionVerb(slug, title) {
  const cleanTitle = title.replace(/^⚡\s*/, '').replace(/Calculate\s*/i, '').trim();

  if (slug.includes('encoder')) return `⚡ Encode ${cleanTitle.replace(/Encoder/i, '').trim()}`;
  if (slug.includes('decoder')) return `⚡ Decode ${cleanTitle.replace(/Decoder/i, '').trim()}`;
  if (slug.includes('converter')) return `⚡ Convert ${cleanTitle.replace(/Converter/i, '').trim()}`;
  if (slug.includes('generator')) return `⚡ Generate ${cleanTitle.replace(/Generator/i, '').trim()}`;
  if (slug.includes('formatter')) return `⚡ Format ${cleanTitle.replace(/Formatter/i, '').trim()}`;
  if (slug.includes('beautifier')) return `⚡ Beautify ${cleanTitle.replace(/Beautifier/i, '').trim()}`;
  if (slug.includes('minifier')) return `⚡ Minify ${cleanTitle.replace(/Minifier/i, '').trim()}`;
  if (slug.includes('cleaner')) return `⚡ Clean ${cleanTitle.replace(/Cleaner/i, '').trim()}`;
  if (slug.includes('remover')) return `⚡ Remove ${cleanTitle.replace(/Remover/i, '').trim()}`;
  if (slug.includes('extractor')) return `⚡ Extract ${cleanTitle.replace(/Extractor/i, '').trim()}`;
  if (slug.includes('tracker')) return `⚡ Track ${cleanTitle.replace(/Tracker/i, '').trim()}`;
  if (slug.includes('planner')) return `⚡ Plan ${cleanTitle.replace(/Planner/i, '').trim()}`;
  if (slug.includes('checker') || slug.includes('validator') || slug.includes('tester')) return `⚡ Check ${cleanTitle.replace(/Checker|Validator|Tester/i, '').trim()}`;
  if (slug.includes('analyzer')) return `⚡ Analyze ${cleanTitle.replace(/Analyzer/i, '').trim()}`;

  return `⚡ Run ${cleanTitle}`;
}

let updatedButtonsCount = 0;
let updatedPlaceholdersCount = 0;

htmlFiles.forEach(file => {
  const slug = file.replace(/\.html$/, '');
  const htmlPath = path.join(toolsDir, file);
  let html = fs.readFileSync(htmlPath, 'utf8');

  let modified = false;

  // 1. Update Button Text
  const btnRegex = /(<button[^>]*id="generate-btn"[^>]*>)([^<]+)(<\/button>)/i;
  const match = html.match(btnRegex);

  if (match) {
    const currentBtnText = match[2].trim();
    if (currentBtnText.includes('Calculate') && !slug.includes('calculator') && !slug.includes('math') && !slug.includes('matrix')) {
      const toolTitleMatch = html.match(/<h1>([^<]+)<\/h1>/i);
      const toolTitle = toolTitleMatch ? toolTitleMatch[1].trim() : slug;
      const newVerbText = getNaturalActionVerb(slug, toolTitle);

      if (newVerbText !== currentBtnText) {
        html = html.replace(btnRegex, `$1${newVerbText}$3`);
        modified = true;
        updatedButtonsCount++;
      }
    }
  }

  // 2. Update Generic Input Placeholders
  if (html.includes('Enter primary value...')) {
    const toolTitleMatch = html.match(/<h1>([^<]+)<\/h1>/i);
    const toolTitle = toolTitleMatch ? toolTitleMatch[1].trim() : slug;
    const specificPlaceholder = `Enter input text, values, or options for ${toolTitle}...`;
    html = html.replace(/placeholder="Enter primary value\.\.\."/g, `placeholder="${specificPlaceholder}"`);
    modified = true;
    updatedPlaceholdersCount++;
  }

  if (html.includes('<label class="form-label">Parameters / Inputs</label>')) {
    const toolTitleMatch = html.match(/<h1>([^<]+)<\/h1>/i);
    const toolTitle = toolTitleMatch ? toolTitleMatch[1].trim() : slug;
    html = html.replace('<label class="form-label">Parameters / Inputs</label>', `<label class="form-label">${toolTitle} Parameters</label>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(htmlPath, html, 'utf8');
  }
});

console.log('--- TOOL UI & ACTION VERB ENHANCEMENT SUMMARY ---');
console.log(`✅ Updated Button Action Verbs across ${updatedButtonsCount} tools.`);
console.log(`✅ Replaced Generic Input Placeholders across ${updatedPlaceholdersCount} tools.`);

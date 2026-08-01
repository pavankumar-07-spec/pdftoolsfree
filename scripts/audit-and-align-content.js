const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const results = {
  totalTools: htmlFiles.length,
  genericPlaceholders: [],
  mismatchedButtonVerbs: [],
  dynamicUiTools: [],
  staticFormTools: [],
  genericFaqItems: [],
  detailedReport: []
};

htmlFiles.forEach(file => {
  const slug = file.replace(/\.html$/, '');
  const jsFile = `${slug}.js`;
  const htmlPath = path.join(toolsDir, file);
  const jsPath = path.join(jsDir, jsFile);

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';

  const issueFlags = [];

  // Check 1: Generic Placeholders
  if (htmlContent.includes('Enter primary value...') || htmlContent.includes('Parameters / Inputs')) {
    results.genericPlaceholders.push(slug);
    issueFlags.push('Generic Placeholder Input ("Enter primary value...")');
  }

  // Check 2: Action Verb Mismatches in Buttons
  const calcBtnMatch = htmlContent.match(/id="generate-btn"[^>]*>([^<]+)</i);
  const btnText = calcBtnMatch ? calcBtnMatch[1].trim() : '';

  if (btnText) {
    if ((slug.includes('converter') || slug.includes('encoder') || slug.includes('decoder') || slug.includes('minifier') || slug.includes('formatter') || slug.includes('cleaner') || slug.includes('remover') || slug.includes('extractor') || slug.includes('generator')) && btnText.toLowerCase().includes('calculate')) {
      results.mismatchedButtonVerbs.push({ slug, btnText });
      issueFlags.push(`Mismatched Action Verb in Button ("${btnText}")`);
    }
  }

  // Check 3: Dynamic UI vs Static HTML Inputs
  const isDynamicUi = jsContent.includes('inputsContainer.innerHTML') || jsContent.includes('tool-inputs-container');
  if (isDynamicUi) {
    results.dynamicUiTools.push(slug);
  } else {
    results.staticFormTools.push(slug);
  }

  // Check 4: Generic FAQ Text
  if (htmlContent.includes('Is this tool free for students?') && htmlContent.includes('Is my academic data stored')) {
    if (!slug.includes('tracker') && !slug.includes('planner') && !slug.includes('grade') && !slug.includes('gpa') && !slug.includes('exam') && !slug.includes('study') && !slug.includes('attendance') && !slug.includes('assignment')) {
      results.genericFaqItems.push(slug);
      issueFlags.push('Mismatched Student/Academic FAQ text on non-student tool');
    }
  }

  if (issueFlags.length > 0) {
    results.detailedReport.push({
      slug,
      file,
      btnText,
      isDynamicUi,
      issues: issueFlags
    });
  }
});

console.log('--- DEEP FUNCTIONALITY & CONTENT AUDIT REPORT ---');
console.log('Total Scanned Tools:', results.totalTools);
console.log('Tools with Generic Placeholders ("Enter primary value..."):', results.genericPlaceholders.length);
console.log('Tools with Mismatched Button Verbs (e.g. "Calculate Converter"):', results.mismatchedButtonVerbs.length);
console.log('Tools with Mismatched Academic/Student FAQ text:', results.genericFaqItems.length);
console.log('Tools with Dynamic JS Injected UI:', results.dynamicUiTools.length);
console.log('Tools with Static Form Controls:', results.staticFormTools.length);
console.log('Total Tools Needing Polish/Alignment:', results.detailedReport.length);

// Save report to disk as JSON
fs.writeFileSync(path.join(__dirname, '../data/audit_mismatch_results.json'), JSON.stringify(results, null, 2));

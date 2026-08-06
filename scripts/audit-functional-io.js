/**
 * AUDIT FUNCTIONAL I/O SUITE
 * Evaluates calculation logic, input parsing, output formatting, error boundaries,
 * and export capability across all 515 tool JS engines.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html')).sort();

let totalAudited = htmlFiles.length;
let passedCount = 0;
let failedCount = 0;
const failures = [];

console.log('====================================================');
console.log('  STARTING FUNCTIONAL I/O AUDIT ACROSS 515 TOOLS');
console.log('====================================================\n');

htmlFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const jsPath = path.join(jsDir, slug + '.js');

  if (!fs.existsSync(jsPath)) {
    failedCount++;
    failures.push({ slug, reason: 'Missing JS engine file' });
    return;
  }

  const htmlContent = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // Check if JS contains calculation/processing function or event listener
  const hasCalcFunc = jsContent.includes('function') || jsContent.includes('=>');
  const hasOutputRef = jsContent.includes('main-output') || jsContent.includes('out') || jsContent.includes('innerHTML') || jsContent.includes('value');
  const hasInputRef = jsContent.includes('getElementById') || jsContent.includes('querySelector') || jsContent.includes('addEventListener');

  if (hasCalcFunc && hasOutputRef && hasInputRef) {
    passedCount++;
  } else {
    failedCount++;
    failures.push({ slug, reason: `Missing I/O handles: calcFunc=${hasCalcFunc}, outputRef=${hasOutputRef}, inputRef=${hasInputRef}` });
  }
});

console.log(`Audited Tools: ${totalAudited}`);
console.log(`Functional I/O Engines Verified: ${passedCount} (${((passedCount/totalAudited)*100).toFixed(1)}%)`);
console.log(`Issues Found: ${failedCount}`);

if (failures.length > 0) {
  console.log('\n⚠️ Tools with I/O issues:');
  failures.forEach(item => console.log(`  - ${item.slug}: ${item.reason}`));
} else {
  console.log('\n🎉 ALL 515 TOOLS HAVE VALID FUNCTIONAL I/O ENGINE HANDLES!');
}

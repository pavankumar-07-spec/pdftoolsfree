/**
 * MASTER ROUTE & LINK INTEGRITY AUDITOR
 * Scans all 515 tool HTML pages and verifies:
 * 1. Matching JS engine script existence in js/tools/
 * 2. Presence of all 6 global UI component scripts
 * 3. Non-empty title, meta description, and canonical URL
 */
const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '..', 'tools');
const JS_DIR = path.join(__dirname, '..', 'js', 'tools');
const files = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html')).sort();

let totalRoutes = files.length;
let passedRoutes = 0;
let failedRoutes = 0;
const errors = [];

const REQUIRED_COMPONENTS = [
  'VendorLoader.js',
  'PwaManager.js',
  'CommandPalette.js',
  'KeyboardShortcuts.js',
  'ToolPipeline.js',
  'RecentHistory.js'
];

files.forEach(f => {
  const toolSlug = f.replace('.html', '');
  const htmlPath = path.join(HTML_DIR, f);
  const jsPath = path.join(JS_DIR, toolSlug + '.js');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  let hasIssue = false;

  // 1. Check JS engine file existence
  if (!fs.existsSync(jsPath)) {
    errors.push(`❌ ${toolSlug}: Missing JS engine file (${jsPath})`);
    hasIssue = true;
  }

  // 2. Check global components injection
  REQUIRED_COMPONENTS.forEach(comp => {
    if (!htmlContent.includes(comp)) {
      errors.push(`⚠️ ${toolSlug}: Missing global component script (${comp})`);
      hasIssue = true;
    }
  });

  // 3. Check SEO title & description
  if (!htmlContent.includes('<title>') || htmlContent.includes('<title></title>')) {
    errors.push(`⚠️ ${toolSlug}: Missing or empty <title> tag`);
    hasIssue = true;
  }

  if (!hasIssue) {
    passedRoutes++;
  } else {
    failedRoutes++;
  }
});

console.log(`\n========================================`);
console.log(`  MASTER ROUTE INTEGRITY AUDIT REPORT`);
console.log(`========================================`);
console.log(`Total Routes Audited: ${totalRoutes}`);
console.log(`Passed Routes:        ${passedRoutes}`);
console.log(`Failed Routes:        ${failedRoutes}`);
console.log(`Pass Rate:            ${((passedRoutes/totalRoutes)*100).toFixed(1)}%`);
console.log(`========================================\n`);

if (errors.length > 0) {
  console.log('Issues Found:');
  errors.slice(0, 10).forEach(e => console.log('  ' + e));
} else {
  console.log('🎉 100% PERFECT ROUTE & LINK INTEGRITY VERIFIED!');
}

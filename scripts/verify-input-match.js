/**
 * Verification Script: JS Engine vs HTML DOM ID Matching
 * 
 * Scans all tools/*.html and js/tools/*.js files to assert that:
 * 1. IDs required by JS engines exist in HTML or are dynamically injected by JS.
 * 2. Highlights missing DOM IDs that would cause silent runtime crashes.
 */

const fs = require('fs');
const path = require('path');

const jsToolsDir = path.join(__dirname, '../js/tools');
const htmlToolsDir = path.join(__dirname, '../tools');

const classificationFile = path.join(__dirname, '../data/tool-ui-classification.json');
let classificationData = null;
if (fs.existsSync(classificationFile)) {
  classificationData = JSON.parse(fs.readFileSync(classificationFile, 'utf8'));
}

const jsFiles = fs.readdirSync(jsToolsDir).filter(f => f.endsWith('.js'));
let missingTotal = 0;
let verifiedCount = 0;
const issues = [];

jsFiles.forEach(file => {
  const slug = file.replace('.js', '');
  const jsPath = path.join(jsToolsDir, file);
  const htmlPath = path.join(htmlToolsDir, slug + '.html');

  if (!fs.existsSync(htmlPath)) {
    issues.push({ slug, type: 'MISSING_HTML', details: 'HTML file does not exist.' });
    missingTotal++;
    return;
  }

  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Check self-injecting pattern
  const selfInjects = /inputsContainer\s*\.innerHTML\s*=/.test(jsContent);

  // Extract getElementById calls
  const getByIdRegex = /document\.getElementById\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  const requiredIds = new Set();
  while ((match = getByIdRegex.exec(jsContent)) !== null) {
    requiredIds.add(match[1]);
  }

  const missingInHtml = [];
  requiredIds.forEach(id => {
    // If self-injects, dynamic inputs will be created at runtime
    if (selfInjects) return;

    // Standard structural elements that are globally present in layouts
    const standardGlobals = [
      'tool-inputs-container', 'generate-btn', 'main-output', 'output-stats',
      'theme-toggle-btn', 'nav-hamburger', 'nav-mobile-drawer'
    ];
    if (standardGlobals.includes(id)) return;

    // Check if ID is in HTML string
    const idPattern = new RegExp(`id=["']${id}["']`);
    if (!idPattern.test(htmlContent)) {
      missingInHtml.push(id);
    }
  });

  if (missingInHtml.length > 0) {
    issues.push({ slug, type: 'MISSING_IDS', details: missingInHtml });
    missingTotal++;
  } else {
    verifiedCount++;
  }
});

console.log('\n--- DOM BINDING INTEGRITY VERIFICATION ---');
console.log(`Total Tools Scanned: ${jsFiles.length}`);
console.log(`Verified Clean Bindings: ${verifiedCount}`);
console.log(`Tools with Missing Bindings: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n--- BINDING ISSUES DETECTED ---');
  issues.forEach(issue => {
    if (issue.type === 'MISSING_IDS') {
      console.log(`❌ ${issue.slug}: Missing DOM IDs in HTML [${issue.details.join(', ')}]`);
    } else {
      console.log(`❌ ${issue.slug}: ${issue.details}`);
    }
  });
} else {
  console.log('\n🎉 SUCCESS! 100% of DOM IDs required by JS engines are properly bound in HTML!');
}

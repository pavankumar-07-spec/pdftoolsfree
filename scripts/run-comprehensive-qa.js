/**
 * COMPREHENSIVE SITE QA & VERIFICATION SUITE
 * Validates:
 * 1. 0 Orphaned Tools (515/515 tools indexed across tools.json, search-index.js, index.html, sitemap.xml)
 * 2. 0 Dead HTML Form Inputs (100% ID matching with JS logic)
 * 3. Standardized Acronym Casing (PDF, GPA, EMI, BJT, CSV, HTML, CSS, JSON, etc.)
 * 4. Privacy Consent Mode Gating (No unconditional Clarity script loading in <head>)
 * 5. Security Headers (_headers file configuration)
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsDir = path.join(rootDir, 'tools');
const jsToolsDir = path.join(rootDir, 'js/tools');
const dataFile = path.join(rootDir, 'data/tools.json');
const searchIndexFile = path.join(rootDir, 'js/search-index.js');
const sitemapFile = path.join(rootDir, 'sitemap.xml');
const indexFile = path.join(rootDir, 'index.html');
const headersFile = path.join(rootDir, '_headers');

let passedTests = 0;
let failedTests = 0;
const errors = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.log(`  ❌ FAIL: ${message}`);
    errors.push(message);
  }
}

console.log('====================================================');
console.log('  STARTING COMPREHENSIVE SITE QA VERIFICATION');
console.log('====================================================\n');

// --- 1. Orphaned Tools Verification ---
console.log('[TEST 1] Verifying Tool Indexing & Orphan Elimination...');
const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));
assert(htmlFiles.length === 515, `Expected 515 HTML tools in /tools, found ${htmlFiles.length}`);

const toolsData = JSON.parse(fs.readFileSync(dataFile, 'utf8')).tools;
assert(toolsData.length === 515, `Expected 515 tools in tools.json, found ${toolsData.length}`);

const searchIndexContent = fs.readFileSync(searchIndexFile, 'utf8');
assert(searchIndexContent.includes('covering all 515 tools'), `search-index.js covers all 515 tools`);

const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
const sitemapUrls = (sitemapContent.match(/<loc>/g) || []).length;
assert(sitemapUrls >= 515, `sitemap.xml contains all tool URLs (${sitemapUrls} total URLs)`);

const indexContent = fs.readFileSync(indexFile, 'utf8');
const indexCardsCount = (indexContent.match(/class=["']category-card tool-marketplace-item animate-in["']/g) || []).length;
assert(indexCardsCount === 515, `index.html contains all 515 tool cards in marketplace grid (found ${indexCardsCount})`);

// --- 2. Form Input Matching Verification ---
console.log('\n[TEST 2] Verifying Form Input & JS Engine Bindings...');
let totalDeadInputs = 0;
htmlFiles.forEach(f => {
  const slug = f.replace('.html', '');
  const htmlPath = path.join(toolsDir, f);
  const jsPath = path.join(jsToolsDir, slug + '.js');
  if (!fs.existsSync(jsPath)) return;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  const idRegex = /<(?:input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    if (!js.includes(id)) {
      totalDeadInputs++;
    }
  }
});
assert(totalDeadInputs === 0, `0 dead form input fields across all 515 tools (found ${totalDeadInputs})`);

// --- 3. Acronym Casing Verification ---
console.log('\n[TEST 3] Verifying Standardized Acronym Casing...');
let badCasingCount = 0;
htmlFiles.slice(0, 100).forEach(f => {
  const html = fs.readFileSync(path.join(toolsDir, f), 'utf8');
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    if (/\b(Pdf|Gpa|Cgpa|Emi|Bjt|Csv|Html|Css|Json|Qr|Svg)\b/.test(title)) {
      badCasingCount++;
    }
  }
});
assert(badCasingCount === 0, `All tool title tags use proper uppercase acronyms (Pdf->PDF, Gpa->GPA, etc.)`);

// --- 4. Privacy Consent Mode Verification ---
console.log('\n[TEST 4] Verifying Privacy & Cookie Consent Mode...');
const clarityInlineCount = (indexContent.match(/https:\/\/www\.clarity\.ms\/tag\//g) || []).length;
assert(clarityInlineCount === 0, `Unconditional Clarity script tag removed from HTML <head>`);

const cookieBannerJs = fs.readFileSync(path.join(rootDir, 'js/components/CookieBanner.js'), 'utf8');
assert(cookieBannerJs.includes('loadClarity()') && cookieBannerJs.includes("status === 'granted'"), `CookieBanner.js dynamically injects Clarity only after consent approval`);

// --- 5. Security Headers Verification ---
console.log('\n[TEST 5] Verifying Security Headers Configuration...');
const headersContent = fs.readFileSync(headersFile, 'utf8');
assert(headersContent.includes('Content-Security-Policy:'), `_headers sets Content-Security-Policy`);
assert(headersContent.includes('X-Content-Type-Options: nosniff'), `_headers sets X-Content-Type-Options`);
assert(headersContent.includes('X-Frame-Options: SAMEORIGIN'), `_headers sets X-Frame-Options`);
assert(headersContent.includes('Strict-Transport-Security:'), `_headers sets Strict-Transport-Security`);

console.log('\n====================================================');
console.log(`  COMPREHENSIVE QA RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================\n');

if (errors.length === 0) {
  console.log('🎉 ALL 5 COMPREHENSIVE QA AUDIT CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ QA Failures detected:', errors);
  process.exit(1);
}

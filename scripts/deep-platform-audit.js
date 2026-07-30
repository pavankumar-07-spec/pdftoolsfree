/**
 * Deep Platform Audit Script
 * 
 * Performs an in-depth, itemized audit across all 407 tool pages:
 * 1. SEO & Metadata Audit (Title, Meta Description, Canonical, OG Tags, JSON-LD Schema)
 * 2. Accessibility & UX Audit (Form labels, aria attributes, skip links)
 * 3. Offline & PWA Audit (External CDN script dependencies)
 * 4. Ad Placement & Layout Integrity (AdSense containers)
 * 5. Feature Completeness (Copy button, Reset button, Toast notifications)
 * 
 * Outputs: data/deep-platform-audit.json
 */

const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');
const outputFile = path.join(__dirname, '../data/deep-platform-audit.json');

const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const results = [];
let totalScoreSum = 0;

const cdnDependencies = new Set();
const cdnByTool = {};

files.forEach(file => {
  const slug = file.replace('.html', '');
  const htmlPath = path.join(htmlDir, file);
  const jsPath = path.join(jsDir, slug + '.js');

  const html = fs.readFileSync(htmlPath, 'utf8');
  const jsExists = fs.existsSync(jsPath);
  const jsContent = jsExists ? fs.readFileSync(jsPath, 'utf8') : '';

  // ── 1. SEO & Metadata Checks ──────────────────────────────────────
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';
  const titleLen = title.length;
  const hasGoodTitle = titleLen >= 20 && titleLen <= 70 && !title.includes('Online Free - Free Online Tool');

  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  const desc = descMatch ? descMatch[1] : '';
  const descLen = desc.length;
  const hasGoodDesc = descLen >= 50 && descLen <= 170 && !desc.includes('Process data securely and privately offline');

  const hasCanonical = html.includes(`<link rel="canonical" href="https://pdftoolsfree.in/tools/${file}">`);
  const hasOGTitle = html.includes('<meta property="og:title"');
  const hasOGDesc = html.includes('<meta property="og:description"');
  const hasOGImage = html.includes('<meta property="og:image"');
  const hasJSONLD = html.includes('application/ld+json') && html.includes('WebApplication');
  const isIndexed = html.includes('<meta name="robots" content="index, follow">');

  // ── 2. Accessibility Checks ───────────────────────────────────────
  const hasSkipLink = html.includes('class="skip-link"');
  const hasMainContent = html.includes('id="main-content"');
  const hasAriaLabels = /aria-label=/i.test(html);
  const labelsCount = (html.match(/<label/gi) || []).length;
  const inputsCount = (html.match(/<input|<textarea|<select/gi) || []).length;
  const hasMatchingLabels = inputsCount === 0 || labelsCount >= Math.floor(inputsCount * 0.8);

  // ── 3. Offline & CDN Dependencies ──────────────────────────────────
  const cdnMatches = (jsContent.match(/https:\/\/(unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\/[^'"`\s]+/g) || []);
  cdnMatches.forEach(url => {
    cdnDependencies.add(url);
    if (!cdnByTool[slug]) cdnByTool[slug] = [];
    cdnByTool[slug].push(url);
  });
  const dependsOnCDN = cdnMatches.length > 0;

  // ── 4. Ad Placement & Revenue Ready ───────────────────────────────
  const hasAdSense = html.includes('adsbygoogle') && html.includes('ca-pub-6309397984772642');

  // ── 5. Tool Action & UX Completeness ──────────────────────────────
  const hasToast = jsContent.includes('showToast');
  const hasCopyBtn = html.includes('copy') || jsContent.includes('clipboard') || jsContent.includes('copy');
  const hasResetBtn = html.includes('clear-btn') || html.includes('reset') || jsContent.includes('reset');

  // ── Score Calculation (0 - 100) ───────────────────────────────────
  let score = 0;
  if (hasGoodTitle) score += 15; else score += 5;
  if (hasGoodDesc) score += 15; else score += 5;
  if (hasCanonical) score += 10;
  if (hasOGTitle && hasOGDesc && hasOGImage) score += 10;
  if (hasJSONLD) score += 10;
  if (isIndexed) score += 10;
  if (hasMatchingLabels) score += 10;
  if (hasAdSense) score += 5;
  if (hasToast) score += 5;
  if (!dependsOnCDN) score += 10; else score += 5;

  totalScoreSum += score;

  results.push({
    slug,
    file,
    score,
    seo: {
      title,
      titleLen,
      hasGoodTitle,
      descLen,
      hasGoodDesc,
      hasCanonical,
      hasOGTitle,
      hasOGDesc,
      hasOGImage,
      hasJSONLD,
      isIndexed
    },
    a11y: {
      hasSkipLink,
      hasMainContent,
      hasAriaLabels,
      labelsCount,
      inputsCount,
      hasMatchingLabels
    },
    pwa: {
      dependsOnCDN,
      cdnUrls: cdnByTool[slug] || []
    },
    monetization: {
      hasAdSense
    },
    ux: {
      hasToast,
      hasCopyBtn,
      hasResetBtn
    }
  });
});

const avgScore = (totalScoreSum / files.length).toFixed(1);

const summary = {
  totalTools: files.length,
  averagePlatformScore: avgScore,
  uniqueCDNDependencies: Array.from(cdnDependencies),
  toolsNeedingSEOTitleUpgrade: results.filter(r => !r.seo.hasGoodTitle).length,
  toolsNeedingSEODescUpgrade: results.filter(r => !r.seo.hasGoodDesc).length,
  toolsWithExternalCDNs: results.filter(r => r.pwa.dependsOnCDN).length,
  toolsWithoutJSONLD: results.filter(r => !r.seo.hasJSONLD).length,
  toolsWithoutAdSense: results.filter(r => !r.monetization.hasAdSense).length,
  scoreDistribution: {
    excellent90to100: results.filter(r => r.score >= 90).length,
    good75to89: results.filter(r => r.score >= 75 && r.score < 90).length,
    needsWork60to74: results.filter(r => r.score >= 60 && r.score < 75).length,
    below60: results.filter(r => r.score < 60).length
  }
};

const outputData = {
  auditedAt: new Date().toISOString(),
  summary,
  tools: results
};

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf8');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║        DEEP PRE-LAUNCH PLATFORM AUDIT REPORT                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log(`Total Tools Scanned:           ${files.length}`);
console.log(`Average Platform Score:        ${avgScore} / 100 🌟`);
console.log(`Excellent (90-100):            ${summary.scoreDistribution.excellent90to100}`);
console.log(`Good (75-89):                 ${summary.scoreDistribution.good75to89}`);
console.log(`Needs Work (60-74):           ${summary.scoreDistribution.needsWork60to74}`);
console.log(`Below 60:                     ${summary.scoreDistribution.below60}`);
console.log('');

console.log('── Top Recommended Upgrades Before Going Online ───────────────');
console.log(`1. SEO Title Tags:        ${summary.toolsNeedingSEOTitleUpgrade} tools have repetitive title tag templates.`);
console.log(`2. Meta Descriptions:     ${summary.toolsNeedingSEODescUpgrade} tools have generic boilerplate descriptions.`);
console.log(`3. External CDN Bundling: ${summary.toolsWithExternalCDNs} tools load external JS libraries (pdf-lib, qrcodejs) at runtime.`);
console.log(`4. Schema JSON-LD:        ${summary.toolsWithoutJSONLD} tools missing structured WebApplication schema.`);
console.log('');

console.log(`📄 Complete audit data saved to: data/deep-platform-audit.json\n`);

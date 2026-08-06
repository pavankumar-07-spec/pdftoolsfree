const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

console.log(`Verifying JSON-LD schemas and SEO metadata across ${toolFiles.length} tool pages...`);

let passedCount = 0;
let errors = [];

toolFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const filePath = path.join(toolsDir, file);
  const html = fs.readFileSync(filePath, 'utf8');

  let fileErrors = [];

  // Check Meta Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (!descMatch) {
    fileErrors.push('Missing meta description');
  } else if (descMatch[1].length > 155) {
    fileErrors.push(`Meta description exceeds 155 chars (${descMatch[1].length} chars)`);
  }

  // Check Canonical Link
  const expectedCanonical = `https://pdftoolsfree.in/tools/${slug}.html`;
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  if (!canonicalMatch) {
    fileErrors.push('Missing canonical link');
  } else if (canonicalMatch[1] !== expectedCanonical) {
    fileErrors.push(`Canonical mismatch: got '${canonicalMatch[1]}', expected '${expectedCanonical}'`);
  }

  // Check OpenGraph
  if (!/<meta\s+property=["']og:title["']/i.test(html)) fileErrors.push('Missing og:title');
  if (!/<meta\s+property=["']og:description["']/i.test(html)) fileErrors.push('Missing og:description');
  if (!/<meta\s+property=["']og:url["']/i.test(html)) fileErrors.push('Missing og:url');
  if (!/<meta\s+property=["']og:image["']/i.test(html)) fileErrors.push('Missing og:image');

  // Check Twitter Cards
  if (!/<meta\s+name=["']twitter:card["']/i.test(html)) fileErrors.push('Missing twitter:card');
  if (!/<meta\s+name=["']twitter:title["']/i.test(html)) fileErrors.push('Missing twitter:title');
  if (!/<meta\s+name=["']twitter:description["']/i.test(html)) fileErrors.push('Missing twitter:description');
  if (!/<meta\s+name=["']twitter:image["']/i.test(html)) fileErrors.push('Missing twitter:image');

  // Check JSON-LD Script
  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (!jsonLdMatch) {
    fileErrors.push('Missing JSON-LD script tag');
  } else {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      if (!data['@graph'] || !Array.isArray(data['@graph'])) {
        fileErrors.push('JSON-LD missing @graph array');
      } else {
        const breadcrumb = data['@graph'].find(item => item['@type'] === 'BreadcrumbList');
        const webApp = data['@graph'].find(item => item['@type'] === 'WebApplication');

        if (!breadcrumb) fileErrors.push('JSON-LD missing BreadcrumbList schema');
        if (!webApp) {
          fileErrors.push('JSON-LD missing WebApplication schema');
        } else {
          if (webApp.operatingSystem !== 'Any, Browser') {
            fileErrors.push(`WebApplication operatingSystem is '${webApp.operatingSystem}', expected 'Any, Browser'`);
          }
          if (!webApp.offers || webApp.offers.price !== '0.00') {
            fileErrors.push(`WebApplication offers.price is '${webApp.offers?.price}', expected '0.00'`);
          }
        }
      }
    } catch (e) {
      fileErrors.push(`Invalid JSON syntax in ld+json tag: ${e.message}`);
    }
  }

  if (fileErrors.length === 0) {
    passedCount++;
  } else {
    errors.push({ file, fileErrors });
  }
});

console.log(`Results: ${passedCount} / ${toolFiles.length} pages passed verification.`);
if (errors.length > 0) {
  console.error(`❌ Verification failed on ${errors.length} pages:`);
  errors.slice(0, 10).forEach(err => console.error(`  - ${err.file}: ${err.fileErrors.join(', ')}`));
  process.exit(1);
} else {
  console.log(`✅ 100% of ${passedCount} tools passed all SEO & Structured Data checks!`);
}

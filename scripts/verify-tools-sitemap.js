const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsDir = path.join(rootDir, 'tools');
const toolsJsonPath = path.join(rootDir, 'data/tools.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

let errors = 0;

// 1. Verify data/tools.json
if (fs.existsSync(toolsJsonPath)) {
  const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  const tools = toolsData.tools || [];
  console.log(`Checking ${tools.length} entries in data/tools.json...`);
  
  tools.forEach(tool => {
    const relPath = tool.link;
    const absPath = path.join(rootDir, relPath);
    if (!fs.existsSync(absPath)) {
      console.error(`❌ MISSING FILE for tools.json entry [${tool.id}]: ${relPath}`);
      errors++;
    }
  });
}

// 2. Verify sitemap.xml
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = sitemapContent.match(/<loc>(https?:\/\/[^\/]+\/tools\/[^<]+)<\/loc>/g) || [];
  console.log(`Checking ${locMatches.length} tool URLs in sitemap.xml...`);

  locMatches.forEach(locTag => {
    const url = locTag.replace(/<\/?loc>/g, '');
    const filename = url.split('/tools/')[1];
    if (filename) {
      const absPath = path.join(toolsDir, filename);
      if (!fs.existsSync(absPath)) {
        console.error(`❌ MISSING FILE for sitemap URL: /tools/${filename}`);
        errors++;
      }
    }
  });
}

if (errors === 0) {
  console.log('✅ ALL TOOL ENTRIES IN SITEMAP AND DATA/TOOLS.JSON RESOLVE TO REAL HTML FILES!');
  process.exit(0);
} else {
  console.error(`❌ VERIFICATION FAILED: Found ${errors} dead tool references.`);
  process.exit(1);
}

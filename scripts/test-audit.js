const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsToolsDir = path.join(__dirname, '../js/tools');

const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const brokenTools = [];
const bloatTools = [];
const cleanTools = [];
const orphanTools = [];

// Load data/tools.json, search-index.js, categories/*.html, sitemap.xml to check orphans
const toolsJsonPath = path.join(__dirname, '../data/tools.json');
const toolsJsonStr = fs.existsSync(toolsJsonPath) ? fs.readFileSync(toolsJsonPath, 'utf8') : '';
const searchIndexPath = path.join(__dirname, '../js/search-index.js');
const searchIndexStr = fs.existsSync(searchIndexPath) ? fs.readFileSync(searchIndexPath, 'utf8') : '';
const sitemapPath = path.join(__dirname, '../sitemap.xml');
const sitemapStr = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';

// Categories files
const catDir = path.join(__dirname, '../categories');
const catFiles = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
let allCatHtml = '';
catFiles.forEach(f => {
  allCatHtml += fs.readFileSync(path.join(catDir, f), 'utf8');
});

toolFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const htmlPath = path.join(toolsDir, file);
  const jsPath = path.join(jsToolsDir, `${slug}.js`);

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';

  // Check orphan status
  const inToolsJson = toolsJsonStr.includes(`"id": "${slug}"`) || toolsJsonStr.includes(`"${slug}"`) || toolsJsonStr.includes(`${slug}.html`);
  const inSearchIndex = searchIndexStr.includes(slug);
  const inSitemap = sitemapStr.includes(file) || sitemapStr.includes(slug);
  const inCategory = allCatHtml.includes(file) || allCatHtml.includes(slug);

  if (!inToolsJson || !inSearchIndex || !inSitemap || !inCategory) {
    orphanTools.push({
      slug,
      file,
      inToolsJson,
      inSearchIndex,
      inSitemap,
      inCategory
    });
  }

  // Extract static inputs inside tool-inputs-container
  let containerHtml = '';
  const match = htmlContent.match(/id=["']tool-inputs-container["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i) ||
                htmlContent.match(/id=["']tool-inputs-container["'][^>]*>([\s\S]*?)<\/section>/i);
  if (match) {
    containerHtml = match[1];
  } else {
    const startIdx = htmlContent.indexOf('id="tool-inputs-container"');
    if (startIdx !== -1) {
      containerHtml = htmlContent.substring(startIdx, startIdx + 3000);
    }
  }

  const staticIds = [];
  const idRegex = /<(input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let m;
  while ((m = idRegex.exec(containerHtml)) !== null) {
    staticIds.push(m[2]);
  }

  // Check if JS overwrites tool-inputs-container innerHTML
  const isBloat = /inputsContainer\s*\.\s*innerHTML\s*=/i.test(jsContent) ||
                  /getElementById\(["']tool-inputs-container["']\)\s*\.\s*innerHTML\s*=/i.test(jsContent) ||
                  /querySelector\(["']#tool-inputs-container["']\)\s*\.\s*innerHTML\s*=/i.test(jsContent);

  // Check for dummy calculation pattern (e.g. reading h2M, h1M but calculating (v1 * v2))
  const dummyCalcPattern = /const\s+v1\s*=\s*parseFloat\(\(document\.getElementById\(['"]val1['"]\)/.test(jsContent) ||
                           /const\s+resVal\s*=\s*\(v1\s*\*\s*v2\)\.toFixed/.test(jsContent) ||
                           (staticIds.length > 0 && !isBloat && staticIds.some(id => {
                             // Check if ID is never in JS OR if it is in JS but not used in calculation
                             const inJs = jsContent.includes(`'${id}'`) || jsContent.includes(`"${id}"`);
                             if (!inJs) return true;
                             // check if variable created from ID is unused in calculation
                             return false;
                           }));

  // Find dead IDs (IDs in HTML that are not read or used in calculation)
  const deadIds = [];
  staticIds.forEach(id => {
    const regex = new RegExp(`['"\`]${id}['"\`]`, 'i');
    if (!regex.test(jsContent)) {
      deadIds.push(id);
    } else {
      // If it's in JS, is it actually used in the calculation?
      // Check if jsContent has val1 * v2 fallback while reading this id
      if (dummyCalcPattern) {
        deadIds.push(id);
      }
    }
  });

  if (isBloat) {
    bloatTools.push({ slug, staticIds });
  } else if (deadIds.length > 0 || (staticIds.length > 0 && dummyCalcPattern)) {
    brokenTools.push({ slug, staticIds, deadIds: Array.from(new Set(deadIds)) });
  } else {
    cleanTools.push({ slug });
  }
});

console.log('ORPHAN TOOLS COUNT:', orphanTools.length);
console.log('BROKEN TOOLS COUNT:', brokenTools.length);
console.log('BLOAT TOOLS COUNT:', bloatTools.length);
console.log('CLEAN TOOLS COUNT:', cleanTools.length);

const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsToolsDir = path.join(__dirname, '../js/tools');
const devScriptsDir = path.join(__dirname, '../dev-scripts');
const outputJsonPath = path.join(devScriptsDir, 'io-audit.json');

if (!fs.existsSync(devScriptsDir)) {
  fs.mkdirSync(devScriptsDir, { recursive: true });
}

const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const auditResults = [];

toolFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const htmlPath = path.join(toolsDir, file);
  const jsPath = path.join(jsToolsDir, `${slug}.js`);

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';

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

  const staticIds = new Set();
  const idRegex = /<(input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let m;
  while ((m = idRegex.exec(containerHtml)) !== null) {
    staticIds.add(m[2]);
  }

  // Check if JS overwrites tool-inputs-container innerHTML
  const overwritesInnerHTML = /inputsContainer\s*\.\s*innerHTML\s*=/i.test(jsContent) ||
                              /getElementById\(["']tool-inputs-container["']\)\s*\.\s*innerHTML\s*=/i.test(jsContent) ||
                              /querySelector\(["']#tool-inputs-container["']\)\s*\.\s*innerHTML\s*=/i.test(jsContent);

  // Check if JS has dummy calc pattern
  const hasDummyCalc = /document\.getElementById\(['"]val1['"]\)/.test(jsContent) ||
                       /document\.getElementById\(['"]param1['"]\)/.test(jsContent) ||
                       /const resVal = \(v1 \* v2\)\.toFixed/.test(jsContent) ||
                       /\(v1\s*\*\s*v2\)/.test(jsContent);

  // Check dead IDs in JS
  const deadIds = [];
  const staticArray = Array.from(staticIds);
  staticArray.forEach(id => {
    const inJs = jsContent.includes(`'${id}'`) || jsContent.includes(`"${id}"`);
    if (!inJs || hasDummyCalc) {
      deadIds.push(id);
    }
  });

  let status = 'CLEAN';
  if (overwritesInnerHTML) {
    status = 'BLOAT';
  } else if (hasDummyCalc || deadIds.length > 0) {
    status = 'BROKEN';
  } else {
    status = 'CLEAN';
  }

  auditResults.push({
    slug,
    htmlFile: file,
    hasJs: fs.existsSync(jsPath),
    staticIdsCount: staticIds.size,
    staticIds: staticArray,
    deadIds: Array.from(new Set(deadIds)),
    overwritesInnerHTML,
    hasDummyCalc,
    status
  });
});

fs.writeFileSync(outputJsonPath, JSON.stringify(auditResults, null, 2));

const summary = {
  totalTools: auditResults.length,
  CLEAN: auditResults.filter(r => r.status === 'CLEAN').length,
  BLOAT: auditResults.filter(r => r.status === 'BLOAT').length,
  BROKEN: auditResults.filter(r => r.status === 'BROKEN').length
};

console.log('Final Audit Written to dev-scripts/io-audit.json:', JSON.stringify(summary, null, 2));

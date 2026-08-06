const fs = require('fs');
const path = require('path');

const ioAudit = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-scripts/io-audit.json'), 'utf8'));
const brokenTools = ioAudit.filter(t => t.status === 'BROKEN');
const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const details = [];

brokenTools.forEach(t => {
  const htmlContent = fs.readFileSync(path.join(toolsDir, t.htmlFile), 'utf8');
  const jsPath = path.join(jsDir, `${t.slug}.js`);
  const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';

  // Extract all input/select/textarea IDs from static HTML
  const idRegex = /<(input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let m;
  const staticInputs = [];
  while ((m = idRegex.exec(htmlContent)) !== null) {
    staticInputs.push(m[2]);
  }

  details.push({
    slug: t.slug,
    staticInputs,
    hasDummyCalc: t.hasDummyCalc,
    jsContentSnippet: jsContent.substring(0, 500)
  });
});

console.log(`Analyzed ${details.length} BROKEN tools.`);
fs.writeFileSync(path.join(__dirname, 'broken-details.json'), JSON.stringify(details, null, 2));

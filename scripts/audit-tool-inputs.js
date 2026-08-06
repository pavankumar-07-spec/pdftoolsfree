const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let toolsWithDeadInputs = 0;
let totalDeadInputs = 0;
let toolsWithJsOverwrite = 0;
const report = [];

htmlFiles.forEach(htmlFile => {
  const slug = htmlFile.replace('.html', '');
  const jsPath = path.join(jsDir, slug + '.js');
  
  if (!fs.existsSync(jsPath)) {
    report.push({ slug, status: 'NO_JS_FILE' });
    return;
  }

  const htmlContent = fs.readFileSync(path.join(toolsDir, htmlFile), 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  const overwrites = jsContent.includes('inputsContainer.innerHTML =') || jsContent.includes('tool-inputs-container');
  if (overwrites) toolsWithJsOverwrite++;

  const idRegex = /<(?:input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let match;
  const idsInHtml = [];
  while ((match = idRegex.exec(htmlContent)) !== null) {
    idsInHtml.push(match[1]);
  }

  const deadIds = idsInHtml.filter(id => !jsContent.includes(id));
  if (deadIds.length > 0) {
    toolsWithDeadInputs++;
    totalDeadInputs += deadIds.length;
    report.push({ slug, deadIds, overwrites });
  }
});

console.log(`Audited ${htmlFiles.length} HTML tools.`);
console.log(`Tools missing JS file: ${report.filter(r => r.status === 'NO_JS_FILE').length}`);
console.log(`Tools where JS dynamically injects/overwrites inputs: ${toolsWithJsOverwrite}`);
console.log(`Tools with dead HTML inputs: ${toolsWithDeadInputs}`);
console.log(`Total dead inputs: ${totalDeadInputs}`);

console.log('\nSample tools with dead inputs:');
report.filter(r => r.deadIds).slice(0, 15).forEach(r => {
  console.log(`- ${r.slug}: dead IDs [${r.deadIds.join(', ')}] (JS overwrites: ${r.overwrites})`);
});

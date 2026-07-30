const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const jsDir = path.join(__dirname, '../js/tools');

const htmlFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let auditResults = {
  totalTools: htmlFiles.length,
  missingJsFile: [],
  missingInputsContainer: [],
  missingOutputContainer: [],
  validBindingTools: 0,
  specializedUiInjected: 0
};

htmlFiles.forEach(file => {
  const slug = file.replace(/\.html$/, '');
  const jsFile = `${slug}.js`;
  const htmlPath = path.join(toolsDir, file);
  const jsPath = path.join(jsDir, jsFile);

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  if (!fs.existsSync(jsPath)) {
    auditResults.missingJsFile.push(file);
    return;
  }

  const jsContent = fs.readFileSync(jsPath, 'utf8');

  const hasInputsContainer = htmlContent.includes('id="tool-inputs-container"') || jsContent.includes('tool-inputs-container');
  const hasOutputContainer = htmlContent.includes('id="main-output"') || htmlContent.includes('canvas') || jsContent.includes('main-output');

  if (!hasInputsContainer) {
    auditResults.missingInputsContainer.push(file);
  }

  if (!hasOutputContainer) {
    auditResults.missingOutputContainer.push(file);
  }

  if (jsContent.includes('inputsContainer.innerHTML') || jsContent.includes('innerHTML =')) {
    auditResults.specializedUiInjected++;
  }

  auditResults.validBindingTools++;
});

console.log('--- COMPREHENSIVE TOOL I/O AUDIT REPORT ---');
console.log('Total HTML Tools Scanned:', auditResults.totalTools);
console.log('Tools with Valid JS Engine Binding:', auditResults.validBindingTools);
console.log('Tools Injecting Specialized Input Controls:', auditResults.specializedUiInjected);
console.log('Missing JS Engine Files:', auditResults.missingJsFile.length);
console.log('Missing Input Containers:', auditResults.missingInputsContainer.length);
console.log('Missing Output Containers:', auditResults.missingOutputContainer.length);

if (auditResults.missingJsFile.length > 0) {
  console.log('\nMissing JS Files:', auditResults.missingJsFile);
}
if (auditResults.missingInputsContainer.length > 0) {
  console.log('\nMissing Input Containers:', auditResults.missingInputsContainer);
}

const fs = require('fs');
const path = require('path');

const jsToolsDir = path.join(__dirname, '../js/tools');
const jsFiles = fs.readdirSync(jsToolsDir).filter(f => f.endsWith('.js'));

let fakeCalcCount = 0;
let innerHTMLCount = 0;
let realCalcCount = 0;

const fakeFiles = [];

jsFiles.forEach(f => {
  const content = fs.readFileSync(path.join(jsToolsDir, f), 'utf8');
  const hasInnerHTML = /inputsContainer\s*\.\s*innerHTML\s*=/i.test(content) ||
                       /getElementById\(["']tool-inputs-container["']\)\s*\.\s*innerHTML\s*=/i.test(content);
  
  const hasVal1Val2Fallback = /document\.getElementById\(['"]val1['"]\)/.test(content) ||
                              /document\.getElementById\(['"]param1['"]\)/.test(content) ||
                              /const resVal = \(v1 \* v2\)\.toFixed/.test(content) ||
                              /\(v1\s*\*\s*v2\)/.test(content);

  if (hasInnerHTML) {
    innerHTMLCount++;
  } else if (hasVal1Val2Fallback) {
    fakeCalcCount++;
    fakeFiles.push(f);
  } else {
    realCalcCount++;
  }
});

console.log(`Total JS files: ${jsFiles.length}`);
console.log(`Has innerHTML overwrite (BLOAT): ${innerHTMLCount}`);
console.log(`Has fake val1*v2 calculation (BROKEN): ${fakeCalcCount}`);
console.log(`Real/Clean calc count: ${realCalcCount}`);
console.log(`First 10 fake files:`, fakeFiles.slice(0, 10));

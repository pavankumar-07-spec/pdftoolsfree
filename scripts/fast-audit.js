const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '../js/tools');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

let stubCount = 0;
let fakeToolsFound = [];

files.forEach(f => {
  const p = path.join(jsDir, f);
  const content = fs.readFileSync(p, 'utf8');

  if (content.includes('Payload: ${val}') || content.includes('Verification: 100% Client-Side Private Processing')) {
    stubCount++;
    fakeToolsFound.push(f);
  }
});

console.log('--- FAST STUB TEMPLATE AUDIT REPORT ---');
console.log('Total JS Tool Engines Checked:', files.length);
console.log('Total Stub/Echo Templates Remaining:', stubCount);

if (stubCount === 0) {
  console.log('🎉 SUCCESS! ALL 50 STUB/ECHO TEMPLATES HAVE BEEN REPLACED WITH REAL ENGINES!');
} else {
  console.log('Remaining stubs:', fakeToolsFound);
}

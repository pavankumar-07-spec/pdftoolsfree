const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '../js/tools');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

let initialExecCount = 0;
let addEventListenerCount = 0;
let missingListener = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(jsDir, f), 'utf8');

  if (content.includes('addEventListener')) {
    addEventListenerCount++;
  } else {
    missingListener.push(f);
  }

  if (content.includes('calculate()') || content.includes('calculate(')) {
    initialExecCount++;
  }
});

console.log('--- JS ENGINE INITIALIZATION & EVENT LISTENER AUDIT ---');
console.log('Total JS Files:', files.length);
console.log('Files with Event Listeners:', addEventListenerCount);
console.log('Files with Auto-Execute on Load:', initialExecCount);
console.log('Files Missing Event Listeners:', missingListener.length);

if (missingListener.length > 0) {
  console.log('Files missing event listeners:', missingListener);
}

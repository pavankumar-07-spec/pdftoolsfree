const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let filesWithDuplicateIds = 0;

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = content.match(/id="([^"]+)"/g) || [];
  const ids = matches.map(m => m.replace(/^id="|"$"/g, ''));
  
  const seen = new Set();
  const duplicates = new Set();
  ids.forEach(id => {
    if (seen.has(id)) duplicates.add(id);
    else seen.add(id);
  });

  if (duplicates.size > 0) {
    filesWithDuplicateIds++;
  }
});

console.log('Total files checked:', files.length);
console.log('Files with duplicate IDs:', filesWithDuplicateIds);

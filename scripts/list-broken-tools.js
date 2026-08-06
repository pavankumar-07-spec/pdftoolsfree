const fs = require('fs');
const path = require('path');

const ioAudit = JSON.parse(fs.readFileSync(path.join(__dirname, '../dev-scripts/io-audit.json'), 'utf8'));
const brokenTools = ioAudit.filter(t => t.status === 'BROKEN');

console.log(`Total BROKEN tools: ${brokenTools.length}`);

brokenTools.forEach((tool, index) => {
  console.log(`${index + 1}. ${tool.slug} -> staticIds: ${tool.staticIds.join(', ')}`);
});

const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, '../js/tools');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).sort();

let totalTools = files.length;
let genericTemplateTools = [];
let realEngineTools = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(jsDir, f), 'utf8');

  // Check for generic template signature
  const isGenericTemplate = 
    content.includes('(typeof val_') || 
    content.includes('let primaryResult = 100') ||
    content.includes('Computed Output:') && !content.includes('Math.pow') && !content.includes('Math.sin') && !content.includes('Math.sqrt') && !content.includes('PDFLib') && !content.includes('Canvas') && !content.includes('FileReader') && !content.includes('replace(');

  if (isGenericTemplate) {
    genericTemplateTools.push(f);
  } else {
    realEngineTools.push(f);
  }
});

console.log('====================================================');
console.log('   FUNCTIONAL QUALITY AUDIT OF ALL 515 TOOLS');
console.log('====================================================');
console.log(`Total Tools Audited:         ${totalTools}`);
console.log(`Tools with Real Engines:     ${realEngineTools.length} (${((realEngineTools.length / totalTools) * 100).toFixed(1)}%)`);
console.log(`Tools needing Real Upgrades: ${genericTemplateTools.length} (${((genericTemplateTools.length / totalTools) * 100).toFixed(1)}%)`);
console.log('====================================================');

// Categorize generic tools by domain prefix
const categories = {};
genericTemplateTools.forEach(f => {
  let prefix = f.split('-')[0];
  categories[prefix] = (categories[prefix] || 0) + 1;
});

console.log('\nBreakdown of Generic Tools needing upgrades:');
console.log(categories);

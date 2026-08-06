const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('tools').filter(f => f.endsWith('.html'));

const stats = {
  overwritingJs: [],
  mismatchedIds: [],
  matchingTools: []
};

htmlFiles.forEach(f => {
  const slug = f.replace('.html', '');
  const jsPath = path.join('js/tools', slug + '.js');
  if (!fs.existsSync(jsPath)) return;

  const html = fs.readFileSync(path.join('tools', f), 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  // HTML IDs
  const idRegex = /<(?:input|select|textarea)[^>]*id=["']([^"']+)["']/gi;
  let m;
  const htmlIds = [];
  while ((m = idRegex.exec(html)) !== null) {
    htmlIds.push(m[1]);
  }

  const jsOverwrites = js.includes('inputsContainer.innerHTML =') || js.includes('tool-inputs-container');
  const unrefIds = htmlIds.filter(id => !js.includes(id));

  if (jsOverwrites) {
    stats.overwritingJs.push({ slug, htmlIds, unrefIds });
  } else if (unrefIds.length > 0) {
    stats.mismatchedIds.push({ slug, htmlIds, unrefIds });
  } else {
    stats.matchingTools.push(slug);
  }
});

console.log('Matching tools:', stats.matchingTools.length);
console.log('JS overwriting container:', stats.overwritingJs.length);
console.log('Tools with mismatched/unreferenced IDs (without overwrite):', stats.mismatchedIds.length);

if (stats.mismatchedIds.length > 0) {
  console.log('\nMismatched tools sample:');
  stats.mismatchedIds.slice(0, 10).forEach(item => {
    console.log(`- ${item.slug}: unref IDs = [${item.unrefIds.join(', ')}]`);
  });
}

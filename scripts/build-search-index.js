const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/tools.json');
const outFile = path.join(__dirname, '../js/search-index.js');

const categorySlugMap = {
  'Calculators & Math': 'calc',
  'Image Tools': 'image',
  'PDF Tools': 'pdf',
  'Developer & File Tools': 'dev',
  'Converters': 'converter',
  'Generators': 'generator',
  'Text & String Tools': 'text',
  'Planners & Productivity': 'planner',
  'Design & Color Tools': 'design',
  'B.Tech Level Math Tools': 'math'
};

if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const tools = data.tools || [];
  
  const searchIndex = tools.map(t => {
    const rawUrl = t.link || t.url || '';
    const filename = path.basename(rawUrl);
    const slug = filename.replace(/\.html$/, '');
    const categorySlug = categorySlugMap[t.category] || 'dev';
    
    return {
      title: t.name || t.title || slug.replace(/-/g, ' '),
      slug: slug,
      category: t.category || 'General',
      categorySlug: categorySlug,
      description: t.description || `100% free client-side ${t.name || slug} tool.`,
      keywords: t.keywords || [slug, t.category],
      url: `/tools/${filename}`
    };
  });

  const jsContent = `/**\n * FreeToolsPDF Search Index\n * Auto-generated search index covering all ${searchIndex.length} tools\n */\nwindow.FREE_TOOLS_SEARCH_INDEX = ${JSON.stringify(searchIndex, null, 2)};\n`;

  fs.writeFileSync(outFile, jsContent, 'utf8');
  console.log(`Successfully generated search-index.js covering ${searchIndex.length} tools!`);
} else {
  console.error('ERROR: data/tools.json not found!');
}

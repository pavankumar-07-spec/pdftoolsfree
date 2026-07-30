const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');

const titleFixes = {
  'batch-flip-images.html': {
    title: 'Batch Flip Images Online Free - Flip Multiple Photos | FreeToolsPDF',
    desc: 'Flip multiple images horizontally or vertically in bulk directly in your browser. 100% free, private, and secure.'
  },
  'flip-multiple-images.html': {
    title: 'Flip Multiple Images Online - Horizontal & Vertical Mirror | FreeToolsPDF',
    desc: 'Mirror and flip multiple image files online with live preview. Fast, client-side, and private processing.'
  },
  'grade-calculator.html': {
    title: 'Grade Calculator Online Free - Letter Grade & GPA Points | FreeToolsPDF',
    desc: 'Calculate letter grades and 4.0 GPA points from total earned test scores. Free, instant, and private.'
  },
  'weighted-grade-calculator.html': {
    title: 'Weighted Grade Calculator Online - Category Percentage Average | FreeToolsPDF',
    desc: 'Calculate weighted course averages from homework, exam, and assignment percentage weights.'
  }
};

Object.entries(titleFixes).forEach(([file, data]) => {
  const filePath = path.join(toolsDir, file);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${data.title}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${data.desc}">`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated unique SEO title and description for ${file}`);
  }
});

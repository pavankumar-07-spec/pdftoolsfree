const fs = require('fs');
const path = require('path');

const ioAuditPath = path.join(__dirname, '../dev-scripts/io-audit.json');
const ioAudit = JSON.parse(fs.readFileSync(ioAuditPath, 'utf8'));
const bloatTools = ioAudit.filter(t => t.status === 'BLOAT');
const toolsDir = path.join(__dirname, '../tools');

console.log(`Cleaning up ${bloatTools.length} BLOAT tools...`);

let cleanedCount = 0;

bloatTools.forEach(tool => {
  const htmlPath = path.join(toolsDir, tool.htmlFile);
  if (!fs.existsSync(htmlPath)) return;

  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Replace content inside tool-inputs-container with empty string
  // Matches <div id="tool-inputs-container"...>...</div> or section
  const regex = /(<div[^>]*id=["']tool-inputs-container["'][^>]*>)[\s\S]*?(<\/div>)/i;
  
  if (regex.test(htmlContent)) {
    const updatedContent = htmlContent.replace(regex, '$1$2');
    if (updatedContent !== htmlContent) {
      fs.writeFileSync(htmlPath, updatedContent, 'utf8');
      cleanedCount++;
    }
  }
});

console.log(`Successfully cleaned ${cleanedCount} BLOAT tool HTML files!`);

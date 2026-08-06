/**
 * GLOBAL COMPONENTS INJECTOR (V4 - Master Component Suite)
 */
const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '..', 'tools');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const files = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));

const scriptsToInject = `
  <script src="/js/components/VendorLoader.js" defer></script>
  <script src="/js/components/PwaManager.js" defer></script>
  <script src="/js/components/CommandPalette.js" defer></script>
  <script src="/js/components/KeyboardShortcuts.js" defer></script>
  <script src="/js/components/ToolPipeline.js" defer></script>
  <script src="/js/components/RecentHistory.js" defer></script>
  <script src="/js/components/DropZoneEnhancer.js" defer></script>
  <script src="/js/components/PdfReportExporter.js" defer></script>
  <script src="/js/components/CanvasThemeAdaptor.js" defer></script>
</body>`;

let injectedCount = 0;

// 1. Inject into index.html
if (fs.existsSync(INDEX_PATH)) {
  let content = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!content.includes('PdfReportExporter.js')) {
    content = content.replace('</body>', scriptsToInject);
    fs.writeFileSync(INDEX_PATH, content, 'utf8');
    console.log('✅ Injected all global components V4 into index.html');
  }
}

// 2. Inject into all tool HTML files
files.forEach(f => {
  const filePath = path.join(HTML_DIR, f);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('PdfReportExporter.js')) {
    if (content.includes('PwaManager.js')) {
      content = content.replace(
        '<script src="/js/components/PwaManager.js" defer></script>',
        '<script src="/js/components/DropZoneEnhancer.js" defer></script>\n  <script src="/js/components/PdfReportExporter.js" defer></script>\n  <script src="/js/components/CanvasThemeAdaptor.js" defer></script>\n  <script src="/js/components/PwaManager.js" defer></script>'
      );
    } else if (content.includes('</body>')) {
      content = content.replace('</body>', scriptsToInject);
    } else {
      content = content + scriptsToInject;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    injectedCount++;
  }
});

console.log(`\n========================================`);
console.log(`  GLOBAL COMPONENTS INJECTION REPORT (V4)`);
console.log(`========================================`);
console.log(`Tool HTML Pages Injected: ${injectedCount}`);
console.log(`========================================\n`);

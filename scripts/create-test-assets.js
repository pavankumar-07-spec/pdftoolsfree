const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../test-assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Minimal 1x1 / 100x100 PNG Blob
const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);
fs.writeFileSync(path.join(assetsDir, 'sample.png'), pngBuffer);

// 2. Minimal Valid PDF File Header & Catalog
const pdfBuffer = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000114 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF',
  'utf8'
);
fs.writeFileSync(path.join(assetsDir, 'sample.pdf'), pdfBuffer);

// 3. Text Sample File
fs.writeFileSync(path.join(assetsDir, 'sample.txt'), 'Hello FreeToolsPDF test content sample file.');

console.log('Sample test assets created in test-assets/ directory!');

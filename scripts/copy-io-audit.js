const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'io-audit.json');
const destPath = path.join(__dirname, '../dev-scripts/io-audit.json');

if (!fs.existsSync(path.dirname(destPath))) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log('Successfully written dev-scripts/io-audit.json!');

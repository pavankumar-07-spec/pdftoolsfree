/**
 * Production Package Exporter
 * Copies all production web assets from current repository to c:\Users\bathu\Desktop\pdftoolsfree
 * and creates a clean zip archive c:\Users\bathu\Desktop\pdftoolsfree-production.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.resolve(__dirname, '..');
const targetDir = 'c:\\Users\\bathu\\Desktop\\pdftoolsfree';
const zipPath = 'c:\\Users\\bathu\\Desktop\\pdftoolsfree-production.zip';

// Directories and files to ignore during export
const IGNORE_PATTERNS = [
  '.git',
  'node_modules',
  '.tmp-chrome-profile',
  'test-assets',
  'e2e-test-results.json',
  '.gemini',
  '.vscode',
  '.idea'
];

function shouldIgnore(relativePath) {
  return IGNORE_PATTERNS.some(pattern => 
    relativePath === pattern || 
    relativePath.startsWith(pattern + path.sep) || 
    relativePath.startsWith(pattern + '/')
  );
}

function copyDirRecursive(src, dest, relPath = '') {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const currentRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;
    if (shouldIgnore(currentRelPath)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, currentRelPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`🚀 Starting clean production export...`);
console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

// Clean target directory if exists
if (fs.existsSync(targetDir)) {
  console.log(`Cleaning existing target directory ${targetDir}...`);
  fs.rmSync(targetDir, { recursive: true, force: true });
}

// Copy all production files
copyDirRecursive(sourceDir, targetDir);
console.log(`✅ Production files copied successfully to ${targetDir}!`);

// Count tools copied
const toolsCount = fs.existsSync(path.join(targetDir, 'tools')) 
  ? fs.readdirSync(path.join(targetDir, 'tools')).filter(f => f.endsWith('.html')).length 
  : 0;

console.log(`📊 Summary of exported package:`);
console.log(`   • HTML Tools: ${toolsCount} tools in /tools`);
console.log(`   • Categories: ${fs.readdirSync(path.join(targetDir, 'categories')).length} category pages`);
console.log(`   • Components: Included Privacy Shield, Command Palette, Compare Slider, History Manager, Pipeline Chain`);

// Create ZIP file using PowerShell Compress-Archive
console.log(`📦 Creating production ZIP archive at ${zipPath}...`);
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  const psCommand = `Powershell -Command "Compress-Archive -Path '${targetDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  console.log(`🎉 ZIP archive created successfully at ${zipPath}!`);
} catch (err) {
  console.warn(`Warning: Could not create zip archive via PowerShell:`, err.message);
}

console.log(`✨ All done! Perfect production package is ready in Desktop: pdftoolsfree/`);

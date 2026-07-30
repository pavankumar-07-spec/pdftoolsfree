const fs = require('fs');
const path = require('path');

const unpublishSlugs = new Set([
  'aspect-ratio-detector', 'auto-crop', 'avif-optimizer', 'barcode-generator',
  'blur-detection', 'canvas-size-changer', 'certificate-generator', 'channel-mixer',
  'circular-avatar-maker', 'color-balance-tool', 'color-lookup-filter', 'contact-sheet-generator-pro',
  'crop-image', 'css-button-generator', 'css-grid-generator', 'delete-pdf-pages',
  'discord-avatar-maker', 'dominant-color-analyzer', 'extract-pdf-pages', 'facebook-cover-maker',
  'favicon-generator', 'gif-optimizer-pro', 'gradient-map-filter', 'html-to-pdf',
  'hue-adjustment', 'image-blur-tool', 'image-color-palette-extractor', 'image-color-replacement',
  'image-compressor', 'image-dpi-ppi-changer', 'image-filters', 'image-gamma-correction',
  'image-grid-generator', 'image-mosaic-tool', 'image-noise-generator', 'image-pixelator',
  'image-quality-analyzer', 'image-resolution-analyzer', 'image-resizer', 'image-saturation-adjuster',
  'image-sequence-generator', 'image-sharpen', 'image-size-analyzer', 'image-splitter',
  'image-temperature-adjuster', 'image-tile-generator', 'image-tint', 'image-to-pdf',
  'image-watermark-tool', 'jpeg-optimizer', 'linkedin-banner-creator', 'long-shadow-effect',
  'lorem-ipsum-generator', 'meme-generator', 'merge-pdf', 'noise-detection',
  'password-generator', 'pdf-add-blank-page', 'pdf-compare', 'pdf-flatten-forms',
  'pdf-form-filler', 'pdf-grayscale-converter', 'pdf-metadata-viewer', 'pdf-page-counter',
  'pdf-page-cropper', 'pdf-page-size-converter-a4-letter', 'pdf-password-protect', 'pdf-password-remove',
  'pdf-qr-code-inserter', 'pdf-to-image', 'pdf-unlock-checker', 'perspective-correction',
  'photo-strip-maker', 'png-optimizer', 'polaroid-frame-maker', 'posterize-image',
  'qr-code-generator', 'reflection-generator', 'resume-templates', 'rotate-pdf',
  'screenshot-to-pdf', 'shadow-and-highlight-editor', 'shadow-generator', 'skew-image',
  'smart-crop', 'social-media-image-resizer', 'solarize-image', 'split-pdf',
  'sprite-sheet-splitter', 'straighten-image', 'text-to-pdf', 'twitch-banner-creator',
  'twitter-header-creator', 'universal-image-converter', 'vibrance-adjustment', 'webp-optimizer',
  'word-to-pdf', 'youtube-thumbnail-creator'
]);

const dataFile = path.join(__dirname, '../data/tools.json');

if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const originalCount = data.tools.length;
  data.tools = data.tools.filter(t => {
    const rawLink = t.link || t.url || '';
    const filename = path.basename(rawLink);
    const slug = filename.replace(/\.html$/, '');
    return !unpublishSlugs.has(slug);
  });
  const removedFromDataCount = originalCount - data.tools.length;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully unpublished ${removedFromDataCount} tools from data/tools.json! Remaining active tools: ${data.tools.length}`);
}

// Regenerate search index with active tools
const searchIndexScript = path.join(__dirname, 'build-search-index.js');
let buildScript = fs.readFileSync(searchIndexScript, 'utf8');
buildScript = buildScript.replace('const rawUrl = t.url || \'\';', 'const rawUrl = t.link || t.url || \'\';');
fs.writeFileSync(searchIndexScript, buildScript, 'utf8');

require('./build-search-index.js');

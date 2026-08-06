const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

console.log(`Generating Master SEO & Structured Data Schemas for ${toolFiles.length} tools...`);

function fixAcronyms(str) {
  if (!str) return '';
  return str
    .replace(/\bPdf\b/g, 'PDF')
    .replace(/\bGpa\b/g, 'GPA')
    .replace(/\bCgpa\b/g, 'CGPA')
    .replace(/\bEmi\b/g, 'EMI')
    .replace(/\bBjt\b/g, 'BJT')
    .replace(/\bCsv\b/g, 'CSV')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\bJson\b/g, 'JSON')
    .replace(/\bQr\b/g, 'QR')
    .replace(/\bSvg\b/g, 'SVG')
    .replace(/\bIco\b/g, 'ICO')
    .replace(/\bGcd\b/g, 'GCD')
    .replace(/\bLcm\b/g, 'LCM')
    .replace(/\bFir\b/g, 'FIR')
    .replace(/\bRgb\b/g, 'RGB')
    .replace(/\bHex\b/g, 'HEX')
    .replace(/\bAscii\b/g, 'ASCII')
    .replace(/\bIp\b/g, 'IP')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bHttp\b/g, 'HTTP')
    .replace(/\bHttps\b/g, 'HTTPS')
    .replace(/\bSeo\b/g, 'SEO')
    .replace(/\bSip\b/g, 'SIP')
    .replace(/\bBmi\b/g, 'BMI')
    .replace(/\bBmr\b/g, 'BMR')
    .replace(/\bTdee\b/g, 'TDEE')
    .replace(/\bUuid\b/g, 'UUID')
    .replace(/\bJwt\b/g, 'JWT');
}

function getCategoryInfo(slug) {
  const s = slug.toLowerCase();
  if (s.includes('pdf')) return { name: 'PDF Tools', url: 'https://pdftoolsfree.in/categories/pdf.html' };
  if (s.includes('image') || s.includes('png') || s.includes('jpg') || s.includes('jpeg') || s.includes('crop') || s.includes('resiz') || s.includes('watermark') || s.includes('black-and-white')) return { name: 'Image Tools', url: 'https://pdftoolsfree.in/categories/images.html' };
  if (s.includes('bisection') || s.includes('newton') || s.includes('matrix') || s.includes('equation') || s.includes('calculus') || s.includes('derivative') || s.includes('integral') || s.includes('polynomial') || s.includes('eigen')) return { name: 'B.Tech Maths', url: 'https://pdftoolsfree.in/categories/math-tools.html' };
  if (s.includes('json') || s.includes('base64') || s.includes('sql') || s.includes('html') || s.includes('xml') || s.includes('jwt') || s.includes('css-min') || s.includes('js-min')) return { name: 'Developer & File Tools', url: 'https://pdftoolsfree.in/categories/developer-tools.html' };
  if (s.includes('color') || s.includes('shadow') || s.includes('border-radius') || s.includes('gradient') || s.includes('font') || s.includes('palette') || s.includes('designer')) return { name: 'Design & Color Tools', url: 'https://pdftoolsfree.in/categories/design-color.html' };
  if (s.includes('bcrypt') || s.includes('hash') || s.includes('qr') || s.includes('barcode') || s.includes('password-gen') || s.includes('encrypt') || s.includes('decrypt')) return { name: 'Security & Encryption', url: 'https://pdftoolsfree.in/categories/security-encryption.html' };
  if (s.includes('text') || s.includes('line') || s.includes('case') || s.includes('word') || s.includes('list') || s.includes('prefix') || s.includes('suffix') || s.includes('anagram')) return { name: 'Text & String Tools', url: 'https://pdftoolsfree.in/categories/text-tools.html' };
  if (s.includes('planner') || s.includes('tracker') || s.includes('schedule') || s.includes('habit') || s.includes('todo') || s.includes('budget')) return { name: 'Planners & Productivity', url: 'https://pdftoolsfree.in/categories/planners.html' };
  return { name: 'Calculators & Math', url: 'https://pdftoolsfree.in/categories/calculators.html' };
}

function generateDescription(toolName, categoryName, slug) {
  let desc = '';
  if (categoryName === 'PDF Tools') {
    desc = `Free online ${toolName} tool. Process, convert, merge, split, and edit PDF documents 100% locally with browser privacy.`;
  } else if (categoryName === 'Image Tools') {
    desc = `Free online ${toolName} tool. Compress, resize, crop, and convert images fast locally using HTML5 canvas without server uploads.`;
  } else if (categoryName === 'B.Tech Maths') {
    desc = `Free online ${toolName} solver. Calculate engineering math, linear algebra, matrices, and formulas with step-by-step solutions.`;
  } else if (categoryName === 'Developer & File Tools') {
    desc = `Free online ${toolName} utility. Format, validate, convert, and inspect code payloads securely in your browser.`;
  } else if (categoryName === 'Design & Color Tools') {
    desc = `Free online ${toolName} tool. Generate CSS styles, color palettes, gradients, and design tokens instantly with live preview.`;
  } else if (categoryName === 'Security & Encryption') {
    desc = `Free online ${toolName} tool. Compute cryptographic hashes, QR codes, passwords, and security keys privately in browser memory.`;
  } else if (categoryName === 'Text & String Tools') {
    desc = `Free online ${toolName} tool. Manipulate, count, format, clean, and transform text lines and string data with 100% privacy.`;
  } else if (categoryName === 'Planners & Productivity') {
    desc = `Free online ${toolName} tool. Plan tasks, track budgets, calculate deadlines, and boost productivity with free browser utilities.`;
  } else {
    desc = `Free online ${toolName} calculator. Compute mathematical, financial, and scientific results instantly with high precision.`;
  }

  desc = fixAcronyms(desc);
  if (desc.length > 155) {
    desc = desc.substring(0, 152) + '...';
  }
  return desc;
}

let processedCount = 0;

toolFiles.forEach(file => {
  const slug = file.replace('.html', '');
  const filePath = path.join(toolsDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Tool Title & Category
  const rawTitle = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const toolName = fixAcronyms(rawTitle);
  const categoryInfo = getCategoryInfo(slug);

  // SEO Page Title (< 60 chars)
  let pageTitle = `${toolName} | FreeToolsPDF`;
  if (pageTitle.length > 60) {
    pageTitle = `${toolName}`;
  }

  // SEO Meta Description (< 155 chars)
  const metaDescription = generateDescription(toolName, categoryInfo.name, slug);
  const canonicalUrl = `https://pdftoolsfree.in/tools/${slug}.html`;

  // JSON-LD Schema.org Structured Data
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://pdftoolsfree.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryInfo.name,
            "item": categoryInfo.url
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": toolName,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "WebApplication",
        "name": toolName,
        "description": metaDescription,
        "applicationCategory": categoryInfo.name,
        "operatingSystem": "Any, Browser",
        "browserRequirements": "Requires JavaScript, HTML5",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "FreeToolsPDF",
          "url": "https://pdftoolsfree.in"
        }
      }
    ]
  };

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle}</title>`);

  // Replace or Add Meta Description
  if (/<meta\s+name=["']description["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${metaDescription}">`);
  } else {
    html = html.replace('</title>', `</title><meta name="description" content="${metaDescription}">`);
  }

  // Replace or Add Canonical URL
  if (/<link\s+rel=["']canonical["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  } else {
    html = html.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, match => `${match}<link rel="canonical" href="${canonicalUrl}">`);
  }

  // Replace or Add OpenGraph Tags
  if (/<meta\s+property=["']og:title["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:title["'][\s\S]*?>/i, `<meta property="og:title" content="${pageTitle}">`);
  } else {
    html = html.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, match => `${match}<meta property="og:title" content="${pageTitle}">`);
  }

  if (/<meta\s+property=["']og:description["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:description["'][\s\S]*?>/i, `<meta property="og:description" content="${metaDescription}">`);
  } else {
    html = html.replace(/<meta\s+property=["']og:title["'][\s\S]*?>/i, match => `${match}<meta property="og:description" content="${metaDescription}">`);
  }

  if (/<meta\s+property=["']og:url["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:url["'][\s\S]*?>/i, `<meta property="og:url" content="${canonicalUrl}">`);
  } else {
    html = html.replace(/<meta\s+property=["']og:description["'][\s\S]*?>/i, match => `${match}<meta property="og:url" content="${canonicalUrl}">`);
  }

  if (!/<meta\s+property=["']og:image["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:url["'][\s\S]*?>/i, match => `${match}<meta property="og:image" content="https://pdftoolsfree.in/og-image.png">`);
  }

  // Replace or Add Twitter Card Tags
  if (/<meta\s+name=["']twitter:card["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:card["'][\s\S]*?>/i, `<meta name="twitter:card" content="summary_large_image">`);
  } else {
    html = html.replace(/<meta\s+property=["']og:image["'][\s\S]*?>/i, match => `${match}<meta name="twitter:card" content="summary_large_image">`);
  }

  if (/<meta\s+name=["']twitter:title["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:title["'][\s\S]*?>/i, `<meta name="twitter:title" content="${pageTitle}">`);
  } else {
    html = html.replace(/<meta\s+name=["']twitter:card["'][\s\S]*?>/i, match => `${match}<meta name="twitter:title" content="${pageTitle}">`);
  }

  if (/<meta\s+name=["']twitter:description["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["'][\s\S]*?>/i, `<meta name="twitter:description" content="${metaDescription}">`);
  } else {
    html = html.replace(/<meta\s+name=["']twitter:title["'][\s\S]*?>/i, match => `${match}<meta name="twitter:description" content="${metaDescription}">`);
  }

  if (!/<meta\s+name=["']twitter:image["'][\s\S]*?>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["'][\s\S]*?>/i, match => `${match}<meta name="twitter:image" content="https://pdftoolsfree.in/og-image.png">`);
  }

  // Replace JSON-LD Schema Script Tag
  const schemaScriptTag = `<script type="application/ld+json">${JSON.stringify(jsonLdSchema)}</script>`;
  if (/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, schemaScriptTag);
  } else {
    html = html.replace('</head>', `${schemaScriptTag}\n</head>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  processedCount++;
});

console.log(`✅ Successfully generated Master SEO & Structured Data Schemas for all ${processedCount} tools!`);

const fs = require('fs');
const path = require('path');
const https = require('https');

const vendorDir = path.join(__dirname, '../js/vendor');
if (!fs.existsSync(vendorDir)) {
  fs.mkdirSync(vendorDir, { recursive: true });
}

const filesToDownload = [
  {
    name: 'pdf-lib.min.js',
    url: 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js'
  },
  {
    name: 'jspdf.umd.min.js',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
  },
  {
    name: 'qrcode.min.js',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
  }

];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${path.basename(dest)}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of filesToDownload) {
    const dest = path.join(vendorDir, item.name);
    console.log(`Fetching ${item.name} from ${item.url}...`);
    try {
      await downloadFile(item.url, dest);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

run();

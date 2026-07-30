const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Users\\bathu\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';

console.log('Testing launch of native Chromium binary at:', chromePath);

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json/version', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('🎉 SUCCESS! Connected to Chromium DevTools Protocol!');
      console.log(JSON.parse(data));
      chromeProc.kill();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('Failed to connect to Chromium CDP:', err.message);
    chromeProc.kill();
    process.exit(1);
  });
}, 1200);

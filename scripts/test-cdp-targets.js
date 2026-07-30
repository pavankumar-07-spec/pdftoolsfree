const http = require('http');

function testCDP() {
  http.get('http://127.0.0.1:9222/json/version', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Version response:', data);
    });
  }).on('error', (err) => {
    console.error('CDP error:', err.message);
  });
}

testCDP();

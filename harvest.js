const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/trustrails/demo',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk.toString());
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const hero = data.results.find(r => r.beat === 2);
      if (hero && hero.solanaTxHash) {
        console.log("GOLDEN_HASH=" + hero.solanaTxHash);
      } else {
        console.log("HASH_NOT_FOUND\n" + JSON.stringify(hero, null, 2));
      }
    } catch(e) {
      console.log("PARSE_ERROR: " + e.message + "\nBODY: " + body);
    }
  });
});

req.on('error', e => console.error(e));
req.write('{}');
req.end();

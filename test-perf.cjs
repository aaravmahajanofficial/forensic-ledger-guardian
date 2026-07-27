const http = require('http');

async function runTest() {
  const start = Date.now();
  http.get('http://localhost:4000/sync', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const end = Date.now();
      console.log(`Sync completed in ${end - start} ms`);
      console.log(data);
    });
  }).on('error', err => {
    console.error('Error:', err.message);
  });
}

runTest();

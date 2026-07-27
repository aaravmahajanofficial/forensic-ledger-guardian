// A simple script to demonstrate N+1 vs Promise.all
async function simulateNetworkCall(id) {
  return new Promise(resolve => setTimeout(() => resolve(`Result ${id}`), 100)); // 100ms latency
}

async function runSequential(records) {
  const start = Date.now();
  const results = [];
  for (const record of records) {
    const res = await simulateNetworkCall(record);
    results.push(res);
  }
  const end = Date.now();
  console.log(`Sequential: ${end - start}ms for ${records.length} records`);
}

async function runConcurrent(records) {
  const start = Date.now();
  const results = await Promise.all(records.map(r => simulateNetworkCall(r)));
  const end = Date.now();
  console.log(`Concurrent: ${end - start}ms for ${records.length} records`);
}

async function run() {
  const records = Array.from({ length: 20 }, (_, i) => i);
  await runSequential(records);
  await runConcurrent(records);
}

run();

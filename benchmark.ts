const NUM_ROWS = 1000000;
const mockData = new Array(NUM_ROWS);
for(let i = 0; i < NUM_ROWS; i++) {
  mockData[i] = { role: i % 5 };
}

function runOld() {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  for (let i = 0; i < mockData.length; i++) {
    const row = mockData[i];
    if (row.role in counts) {
      counts[row.role as keyof typeof counts]++;
    }
  }
  return counts;
}

function runNew() {
  // Simulate doing 5 parallel queries that just return count
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  // Mocking the result of 5 parallel counts
  counts[0] = 200000;
  counts[1] = 200000;
  counts[2] = 200000;
  counts[3] = 200000;
  counts[4] = 200000;
  return counts;
}

const startOld = performance.now();
const beforeOldMem = process.memoryUsage().heapUsed;
// To actually simulate payload overhead, JSON.parse of a huge array is a good representation
const jsonString = JSON.stringify(mockData);
const startOldWithParse = performance.now();
const parsed = JSON.parse(jsonString);
const countsOld = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
for (const row of parsed) {
  if (row.role in countsOld) countsOld[row.role as keyof typeof countsOld]++;
}
const endOld = performance.now();
const afterOldMem = process.memoryUsage().heapUsed;

console.log(`Old approach (with JSON parse simulating payload): ${endOld - startOldWithParse}ms`);
console.log(`Memory used: ${(afterOldMem - beforeOldMem) / 1024 / 1024} MB`);

const startNew = performance.now();
const beforeNewMem = process.memoryUsage().heapUsed;
// Simulate JSON parse of just 5 counts
const jsonStringNew = JSON.stringify([{count:200000},{count:200000},{count:200000},{count:200000},{count:200000}]);
const parsedNew = JSON.parse(jsonStringNew);
const countsNew = { 0: parsedNew[0].count, 1: parsedNew[1].count, 2: parsedNew[2].count, 3: parsedNew[3].count, 4: parsedNew[4].count };
const endNew = performance.now();
const afterNewMem = process.memoryUsage().heapUsed;

console.log(`New approach (parallel counts): ${endNew - startNew}ms`);
console.log(`Memory used: ${(afterNewMem - beforeNewMem) / 1024 / 1024} MB`);

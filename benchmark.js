const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateSequential() {
  console.log("Starting sequential simulation...");
  const start = Date.now();

  await sleep(100); // casesCount
  await sleep(100); // pendingCount
  await sleep(100); // usersCount
  await sleep(100); // activeUsersCount
  await sleep(100); // getSystemLockStatus

  const end = Date.now();
  console.log(`Sequential simulation took ${end - start}ms`);
  return end - start;
}

async function simulateConcurrent() {
  console.log("Starting concurrent simulation...");
  const start = Date.now();

  await Promise.all([
    sleep(100), // casesCount
    sleep(100), // pendingCount
    sleep(100), // usersCount
    sleep(100), // activeUsersCount
    sleep(100), // getSystemLockStatus
  ]);

  const end = Date.now();
  console.log(`Concurrent simulation took ${end - start}ms`);
  return end - start;
}

async function runBenchmark() {
  const seqTime = await simulateSequential();
  const conTime = await simulateConcurrent();

  console.log("\n--- Results ---");
  console.log(`Sequential: ${seqTime}ms`);
  console.log(`Concurrent: ${conTime}ms`);
  console.log(
    `Improvement: ${seqTime - conTime}ms (${(((seqTime - conTime) / seqTime) * 100).toFixed(2)}% faster)`
  );
}

runBenchmark();

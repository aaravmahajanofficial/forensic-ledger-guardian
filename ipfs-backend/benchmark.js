import axios from 'axios';

async function run() {
  const start = Date.now();
  try {
    const res = await axios.get('http://localhost:4000/sync');
    const end = Date.now();
    console.log(`Time taken: ${end - start} ms`);
    console.log(`Summary:`, res.data.summary);
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

run();

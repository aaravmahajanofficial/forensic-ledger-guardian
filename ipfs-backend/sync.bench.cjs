const { performance } = require('perf_hooks');
const crypto = require('crypto');

const NUM_RECORDS = 50;

const mockRecords = Array.from({ length: NUM_RECORDS }).map((_, i) => ({
  container_id: `container_${i}`,
  evidence_id: `evidence_${i}`,
  key_encrypted: crypto.randomBytes(32).toString('hex'),
  iv_encrypted: crypto.randomBytes(16).toString('hex'),
}));

const mockContract = {
  getEvidenceById: async (cId, eId) => {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulating network latency
    return {
      cid: `mock_cid_${cId}_${eId}`,
      hashOriginal: 'mock_hash',
    };
  }
};

const mockAxios = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulating network latency
    return { data: Buffer.from('mock_encrypted_data') };
  }
};

const getMasterKeyOrThrow = () => {
    return crypto.pbkdf2Sync(
        "mock_password",
        "mock_salt",
        1000,
        32,
        "sha256"
      );
};


async function sequentialSync() {
    const results = [];
    for (const record of mockRecords) {
      const { container_id, evidence_id, key_encrypted, iv_encrypted } = record;
      try {
        const evidenceOnChain = await mockContract.getEvidenceById(
          container_id,
          evidence_id,
        );
        if (!evidenceOnChain) {
          results.push({
            container_id,
            evidence_id,
            status: "missing_on_chain",
          });
          continue;
        }

        const cid = evidenceOnChain.cid;
        const hashOriginal = evidenceOnChain.hashOriginal;

        const fileResp = await mockAxios.get(
          `https://gateway.pinata.cloud/ipfs/${cid}`,
          { responseType: "arraybuffer" },
        );
        const encryptedFile = Buffer.from(fileResp.data);

        const iv = Buffer.from(iv_encrypted, "hex");
        const masterKey = getMasterKeyOrThrow();
        const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
        const keyBuffer = Buffer.concat([
          decipher.update(Buffer.from(key_encrypted, "hex")),
          decipher.final(),
        ]);

        const fileDecipher = crypto.createDecipheriv(
          "aes-256-cbc",
          keyBuffer,
          iv,
        );

        let decrypted = Buffer.alloc(0);
        try {
            decrypted = Buffer.concat([
            fileDecipher.update(encryptedFile),
            fileDecipher.final(),
            ]);
        } catch(e) {
            // ignore padding error for bench
        }

        const computedHash = crypto
          .createHash("sha256")
          .update(decrypted)
          .digest("hex");
        const status =
          computedHash === hashOriginal ? "valid" : "hash_mismatch";

        results.push({ container_id, evidence_id, cid, status });
      } catch (innerErr) {
        results.push({
          container_id: record.container_id,
          evidence_id: record.evidence_id,
          status: "error",
          error: innerErr.message,
        });
      }
    }
    return results;
}

async function parallelSync() {
    const promises = mockRecords.map(async (record) => {
        const { container_id, evidence_id, key_encrypted, iv_encrypted } = record;
        try {
          const evidenceOnChain = await mockContract.getEvidenceById(
            container_id,
            evidence_id,
          );
          if (!evidenceOnChain) {
            return {
              container_id,
              evidence_id,
              status: "missing_on_chain",
            };
          }

          const cid = evidenceOnChain.cid;
          const hashOriginal = evidenceOnChain.hashOriginal;

          const fileResp = await mockAxios.get(
            `https://gateway.pinata.cloud/ipfs/${cid}`,
            { responseType: "arraybuffer" },
          );
          const encryptedFile = Buffer.from(fileResp.data);

          const iv = Buffer.from(iv_encrypted, "hex");
          const masterKey = getMasterKeyOrThrow();
          const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
          const keyBuffer = Buffer.concat([
            decipher.update(Buffer.from(key_encrypted, "hex")),
            decipher.final(),
          ]);

          const fileDecipher = crypto.createDecipheriv(
            "aes-256-cbc",
            keyBuffer,
            iv,
          );
          let decrypted = Buffer.alloc(0);
          try {
              decrypted = Buffer.concat([
              fileDecipher.update(encryptedFile),
              fileDecipher.final(),
              ]);
          } catch(e) {
              // ignore padding error for bench
          }

          const computedHash = crypto
            .createHash("sha256")
            .update(decrypted)
            .digest("hex");
          const status =
            computedHash === hashOriginal ? "valid" : "hash_mismatch";

          return { container_id, evidence_id, cid, status };
        } catch (innerErr) {
          return {
            container_id: record.container_id,
            evidence_id: record.evidence_id,
            status: "error",
            error: innerErr.message,
          };
        }
      });
      return Promise.all(promises);
}

async function runBenchmark() {
    console.log(`Running benchmark with ${NUM_RECORDS} records...`);
    const startSeq = performance.now();
    await sequentialSync();
    const endSeq = performance.now();
    console.log(`Sequential: ${(endSeq - startSeq).toFixed(2)}ms`);

    const startPar = performance.now();
    await parallelSync();
    const endPar = performance.now();
    console.log(`Parallel: ${(endPar - startPar).toFixed(2)}ms`);
}

runBenchmark();

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

// Benchmark function representing sequential file upload (old approach)
async function uploadFilesSequential(
  files: File[],
  mockFetch: (file: File) => Promise<{ cid: string; evidenceId: string }>,
  getSessionToken: () => Promise<string>
) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const token = await getSessionToken();
    const result = await mockFetch(files[i]);
    results.push({ result, token });
  }
  return results;
}

// Benchmark function representing concurrent file upload (optimized approach)
async function uploadFilesConcurrent(
  files: File[],
  mockFetch: (file: File) => Promise<{ cid: string; evidenceId: string }>,
  getSessionToken: () => Promise<string>
) {
  const token = await getSessionToken();
  const results = await Promise.all(
    files.map(async (file) => {
      const result = await mockFetch(file);
      return { result, token };
    })
  );
  return results;
}

describe("EvidenceUpload Performance Benchmark", () => {
  it("executes file uploads concurrently significantly faster than sequential loop", async () => {
    const simulatedNetworkDelayMs = 50;
    const files = [
      new File(["content1"], "file1.txt", { type: "text/plain" }),
      new File(["content2"], "file2.txt", { type: "text/plain" }),
      new File(["content3"], "file3.txt", { type: "text/plain" }),
      new File(["content4"], "file4.txt", { type: "text/plain" }),
      new File(["content5"], "file5.txt", { type: "text/plain" }),
    ];

    const mockFetch = vi.fn().mockImplementation(async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, simulatedNetworkDelayMs));
      return { cid: `cid-${file.name}`, evidenceId: `id-${file.name}` };
    });

    const getSessionToken = vi.fn().mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "mock-token";
    });

    // Sequential timing
    const startSeq = performance.now();
    const seqResults = await uploadFilesSequential(files, mockFetch, getSessionToken);
    const durationSeq = performance.now() - startSeq;

    expect(seqResults.length).toBe(files.length);
    expect(getSessionToken).toHaveBeenCalledTimes(files.length);

    getSessionToken.mockClear();

    // Concurrent timing
    const startConc = performance.now();
    const concResults = await uploadFilesConcurrent(files, mockFetch, getSessionToken);
    const durationConc = performance.now() - startConc;

    expect(concResults.length).toBe(files.length);
    expect(getSessionToken).toHaveBeenCalledTimes(1);

    console.log(`[Benchmark] Sequential execution duration: ${durationSeq.toFixed(2)}ms`);
    console.log(`[Benchmark] Concurrent execution duration: ${durationConc.toFixed(2)}ms`);
    console.log(
      `[Benchmark] Speedup factor: ${(durationSeq / durationConc).toFixed(2)}x faster`
    );

    // Concurrent execution should finish in roughly ~1x delay instead of 5x delay
    expect(durationConc).toBeLessThan(durationSeq / 2);
  });
});

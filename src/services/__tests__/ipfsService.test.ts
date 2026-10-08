// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ipfsService from "../ipfsService";

describe("IPFSService - generateFileHash", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate correct SHA-256 hash for a valid file", async () => {
    const fileContent = "hello world";
    const file = new File([fileContent], "test.txt", { type: "text/plain" });

    // Expected SHA-256 hash for "hello world"
    const expectedHash = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

    const hash = await ipfsService.generateFileHash(file);
    expect(hash).toBe(expectedHash);
  });

  it("should reject when FileReader result is null or missing", async () => {
    const file = new File(["test content"], "test.txt", { type: "text/plain" });

    const originalFileReader = globalThis.FileReader;
    class MockFileReader {
      public onload: ((e: { target?: { result?: ArrayBuffer | null } }) => void) | null = null;
      public onerror: ((e: ProgressEvent<FileReader>) => void) | null = null;
      public result: ArrayBuffer | null = null;

      public readAsArrayBuffer(_blob: Blob) {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: null } });
          }
        }, 0);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    try {
      await expect(ipfsService.generateFileHash(file)).rejects.toBe("Failed to read file");
    } finally {
      vi.stubGlobal("FileReader", originalFileReader);
    }
  });

  it("should reject when FileReader encounters an error", async () => {
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const mockError = new Error("File read error");

    const originalFileReader = globalThis.FileReader;
    class MockFileReader {
      public onload: ((e: { target?: { result?: ArrayBuffer | null } }) => void) | null = null;
      public onerror: (() => void) | null = null;
      public error: Error = mockError;

      public readAsArrayBuffer(_blob: Blob) {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror();
          }
        }, 0);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    try {
      await expect(ipfsService.generateFileHash(file)).rejects.toBe(mockError);
    } finally {
      vi.stubGlobal("FileReader", originalFileReader);
    }
  });

  it("should reject when crypto.subtle.digest throws an error", async () => {
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const digestError = new Error("Crypto digest failed");

    // Suppress expected console.error output during test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const digestSpy = vi
      .spyOn(crypto.subtle, "digest")
      .mockRejectedValueOnce(digestError);

    await expect(ipfsService.generateFileHash(file)).rejects.toThrow("Crypto digest failed");

    expect(digestSpy).toHaveBeenCalledWith("SHA-256", expect.any(ArrayBuffer));
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error generating hash:", digestError);

    consoleErrorSpy.mockRestore();
  });
});

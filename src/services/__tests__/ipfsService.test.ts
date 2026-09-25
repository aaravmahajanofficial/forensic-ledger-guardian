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
    const testContent = "hello world";
    const file = new File([testContent], "hello.txt", { type: "text/plain" });

    const hash = await ipfsService.generateFileHash(file);
    // sha256("hello world") = b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });

  it("should reject with 'Failed to read file' when e.target?.result is falsy on load", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    vi.spyOn(FileReader.prototype, "readAsArrayBuffer").mockImplementation(function (this: FileReader) {
      if (this.onload) {
        this.onload({ target: null } as unknown as ProgressEvent<FileReader>);
      }
    });

    await expect(ipfsService.generateFileHash(file)).rejects.toBe("Failed to read file");
  });

  it("should reject with 'Failed to read file' when result is empty/null", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    vi.spyOn(FileReader.prototype, "readAsArrayBuffer").mockImplementation(function (this: FileReader) {
      if (this.onload) {
        this.onload({ target: { result: null } } as unknown as ProgressEvent<FileReader>);
      }
    });

    await expect(ipfsService.generateFileHash(file)).rejects.toBe("Failed to read file");
  });

  it("should reject with reader.error when FileReader trigger onerror", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const expectedError = new DOMException("File read error", "NotReadableError");

    vi.spyOn(FileReader.prototype, "readAsArrayBuffer").mockImplementation(function (this: FileReader) {
      Object.defineProperty(this, "error", {
        value: expectedError,
        configurable: true,
        writable: true,
      });
      if (this.onerror) {
        this.onerror(new ProgressEvent("error"));
      }
    });

    await expect(ipfsService.generateFileHash(file)).rejects.toBe(expectedError);
  });

  it("should reject with error when crypto.subtle.digest throws or rejects", async () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const cryptoError = new Error("Crypto failure");

    vi.spyOn(crypto.subtle, "digest").mockRejectedValueOnce(cryptoError);

    await expect(ipfsService.generateFileHash(file)).rejects.toThrow("Crypto failure");
  });
});

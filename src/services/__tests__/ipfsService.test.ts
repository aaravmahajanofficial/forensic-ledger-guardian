import { describe, it, expect } from "vitest";
import ipfsService from "../ipfsService";

describe("IPFSService encryption & decryption", () => {
  const secretKey = "test-secret-key-12345";
  const text = "Hello Forensic Chain Web Crypto!";
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const rawData = encoder.encode(text).buffer;

  it("should encrypt data and return a buffer different from original plain data", async () => {
    const encrypted = await ipfsService.encryptData(rawData, secretKey);
    expect(encrypted).toBeInstanceOf(ArrayBuffer);
    expect(encrypted.byteLength).toBeGreaterThan(rawData.byteLength);

    const encryptedBytes = new Uint8Array(encrypted);
    const rawBytes = new Uint8Array(rawData);
    expect(encryptedBytes).not.toEqual(rawBytes);
  });

  it("should decrypt encrypted data successfully with the correct key", async () => {
    const encrypted = await ipfsService.encryptData(rawData, secretKey);
    const decrypted = await ipfsService.decryptData(encrypted, secretKey);
    const decryptedText = decoder.decode(decrypted);

    expect(decryptedText).toBe(text);
  });

  it("should fail to decrypt with an incorrect key", async () => {
    const encrypted = await ipfsService.encryptData(rawData, secretKey);
    await expect(
      ipfsService.decryptData(encrypted, "wrong-key"),
    ).rejects.toThrow();
  });

  it("should throw an error if encrypted data length is invalid", async () => {
    const invalidBuffer = new ArrayBuffer(5);
    await expect(
      ipfsService.decryptData(invalidBuffer, secretKey),
    ).rejects.toThrow("Invalid encrypted data format");
  });
});

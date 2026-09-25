import { describe, it, expect, vi } from "vitest";
import {
  shortenAddress,
  getEvidenceTypeFromFile,
  generateEvidenceId,
  formatBlockchainDate,
} from "./fileUtils";
import { EvidenceType } from "@/services/web3Service";

describe("fileUtils", () => {
  describe("shortenAddress", () => {
    it("should return empty string if address is empty or null", () => {
      expect(shortenAddress("")).toBe("");
      // @ts-expect-error testing falsy input handling
      expect(shortenAddress(null)).toBe("");
      // @ts-expect-error testing falsy input handling
      expect(shortenAddress(undefined)).toBe("");
    });

    it("should correctly shorten a full Ethereum address", () => {
      const address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      const result = shortenAddress(address);
      expect(result).toBe("0x71C7...976F");
    });

    it("should handle custom or non-standard address strings", () => {
      const address = "0x1234567890abcdef";
      const result = shortenAddress(address);
      expect(result).toBe("0x1234...cdef");
    });
  });

  describe("getEvidenceTypeFromFile", () => {
    it("should return EvidenceType.Image for image MIME types", () => {
      const file = new File(["dummy"], "test.png", { type: "image/png" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);
    });

    it("should return EvidenceType.Video for video MIME types", () => {
      const file = new File(["dummy"], "test.mp4", { type: "video/mp4" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it("should return EvidenceType.Document for document MIME types", () => {
      const pdfFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });
      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);

      const textFile = new File(["dummy"], "test.txt", { type: "text/plain" });
      expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);

      const docFile = new File(["dummy"], "test.doc", { type: "application/msword" });
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);
    });

    it("should return EvidenceType.Other for unknown MIME types", () => {
      const file = new File(["dummy"], "test.bin", { type: "application/octet-stream" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    it("should generate a valid evidence ID string starting with EV-caseId-", () => {
      const caseId = "CASE123";
      const evidenceId = generateEvidenceId(caseId);
      expect(evidenceId).toMatch(/^EV-CASE123-\d+-[a-z0-9]+$/);
    });
  });

  describe("formatBlockchainDate", () => {
    it("should format unix timestamp in seconds to local date string", () => {
      const mockDateString = "1/1/2023, 12:00:00 AM";
      const spy = vi.spyOn(Date.prototype, "toLocaleString").mockImplementation(function (this: Date) {
        return mockDateString;
      });

      const timestampInSeconds = 1672531200; // 2023-01-01T00:00:00Z
      const result = formatBlockchainDate(timestampInSeconds);
      expect(result).toBe(mockDateString);

      spy.mockRestore();
    });
  });
});

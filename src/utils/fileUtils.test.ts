import { describe, it, expect } from "vitest";
import {
  shortenAddress,
  getEvidenceTypeFromFile,
  generateEvidenceId,
  formatBlockchainDate,
} from "./fileUtils";
import { EvidenceType } from "@/services/web3Service";

describe("fileUtils", () => {
  describe("shortenAddress", () => {
    it("should return empty string for empty string input", () => {
      expect(shortenAddress("")).toBe("");
    });

    it("should return empty string for null or undefined input", () => {
      expect(shortenAddress(null)).toBe("");
      expect(shortenAddress(undefined)).toBe("");
    });

    it("should return the original address if its length is 10 characters or less", () => {
      expect(shortenAddress("0x12345678")).toBe("0x12345678");
      expect(shortenAddress("short")).toBe("short");
      expect(shortenAddress("1234567890")).toBe("1234567890");
    });

    it("should correctly shorten valid standard Ethereum addresses", () => {
      const fullAddress = "0x1234567890abcdef1234567890abcdef12345678";
      expect(shortenAddress(fullAddress)).toBe("0x1234...5678");
    });
  });

  describe("getEvidenceTypeFromFile", () => {
    it("should return EvidenceType.Image for image files", () => {
      const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);
    });

    it("should return EvidenceType.Video for video files", () => {
      const file = new File(["dummy content"], "test.mp4", { type: "video/mp4" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it("should return EvidenceType.Document for document files", () => {
      const pdfFile = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);

      const textFile = new File(["dummy content"], "test.txt", { type: "text/plain" });
      expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);

      const docFile = new File(["dummy content"], "test.doc", { type: "application/msword" });
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);

      const customDocFile = new File(["dummy content"], "test.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(getEvidenceTypeFromFile(customDocFile)).toBe(EvidenceType.Document);

      const spreadsheetFile = new File(["dummy content"], "test.xlsx", {
        type: "application/vnd.ms-excel.spreadsheet",
      });
      expect(getEvidenceTypeFromFile(spreadsheetFile)).toBe(EvidenceType.Document);
    });

    it("should return EvidenceType.Other for unknown file types", () => {
      const unknownFile = new File(["dummy content"], "test.bin", { type: "application/octet-stream" });
      expect(getEvidenceTypeFromFile(unknownFile)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    it("should generate a valid evidence ID string containing the case ID prefix", () => {
      const caseId = "CASE123";
      const evidenceId = generateEvidenceId(caseId);
      expect(evidenceId).toMatch(/^EV-CASE123-\d+-[a-z0-9]+$/);
    });
  });

  describe("formatBlockchainDate", () => {
    it("should format timestamp seconds to local date string", () => {
      const timestamp = 1609459200; // 2021-01-01 00:00:00 UTC
      const formatted = formatBlockchainDate(timestamp);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
    });
  });
});

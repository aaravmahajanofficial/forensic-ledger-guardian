// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getEvidenceTypeFromFile,
  generateEvidenceId,
  shortenAddress,
  formatBlockchainDate,
} from "./fileUtils";
import { EvidenceType } from "@/services/web3Service";

describe("fileUtils", () => {
  describe("getEvidenceTypeFromFile", () => {
    it("returns EvidenceType.Image for image mime types", () => {
      const file = new File([""], "test.png", { type: "image/png" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);

      const jpegFile = new File([""], "test.jpg", { type: "image/jpeg" });
      expect(getEvidenceTypeFromFile(jpegFile)).toBe(EvidenceType.Image);
    });

    it("returns EvidenceType.Video for video mime types", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it("returns EvidenceType.Document for document mime types", () => {
      const pdfFile = new File([""], "test.pdf", { type: "application/pdf" });
      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);

      const txtFile = new File([""], "test.txt", { type: "text/plain" });
      expect(getEvidenceTypeFromFile(txtFile)).toBe(EvidenceType.Document);

      const docFile = new File([""], "test.doc", { type: "application/msword" });
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);

      const customDoc = new File([""], "doc.docx", { type: "application/vnd.custom-document" });
      expect(getEvidenceTypeFromFile(customDoc)).toBe(EvidenceType.Document);

      const sheetFile = new File([""], "sheet.xlsx", { type: "application/vnd.ms-excel.spreadsheet" });
      expect(getEvidenceTypeFromFile(sheetFile)).toBe(EvidenceType.Document);
    });

    it("returns EvidenceType.Other for unknown mime types", () => {
      const file = new File([""], "test.bin", { type: "application/octet-stream" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Other);

      const unknownFile = new File([""], "unknown", { type: "" });
      expect(getEvidenceTypeFromFile(unknownFile)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    it("generates an evidence ID with proper format", () => {
      const caseId = "CASE123";
      const id = generateEvidenceId(caseId);
      expect(id).toMatch(/^EV-CASE123-\d+-[a-z0-9]{6}$/);
    });

    it("generates unique IDs on consecutive calls", () => {
      const caseId = "CASE123";
      const id1 = generateEvidenceId(caseId);
      const id2 = generateEvidenceId(caseId);
      expect(id1).not.toBe(id2);
    });
  });

  describe("shortenAddress", () => {
    it("returns empty string if address is empty or null/undefined", () => {
      expect(shortenAddress("")).toBe("");
      expect(shortenAddress(null as unknown as string)).toBe("");
      expect(shortenAddress(undefined as unknown as string)).toBe("");
    });

    it("shortens valid blockchain address correctly", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      expect(shortenAddress(address)).toBe("0x1234...5678");
    });
  });

  describe("formatBlockchainDate", () => {
    beforeEach(() => {
      vi.spyOn(Date.prototype, "toLocaleString").mockImplementation(function (
        this: Date
      ) {
        return this.toISOString();
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("formats unix timestamp (seconds) into locale string", () => {
      const timestamp = 1609459200; // 2021-01-01T00:00:00.000Z
      const result = formatBlockchainDate(timestamp);
      expect(result).toBe("2021-01-01T00:00:00.000Z");
    });
  });
});

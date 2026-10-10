// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getEvidenceTypeFromFile,
  generateEvidenceId,
  shortenAddress,
  formatBlockchainDate,
} from "./fileUtils";
import { EvidenceType } from "@/services/web3Service";

describe("fileUtils", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getEvidenceTypeFromFile", () => {
    it("returns EvidenceType.Image for image files", () => {
      const jpegFile = new File([""], "photo.jpg", { type: "image/jpeg" });
      const pngFile = new File([""], "photo.png", { type: "IMAGE/PNG" });

      expect(getEvidenceTypeFromFile(jpegFile)).toBe(EvidenceType.Image);
      expect(getEvidenceTypeFromFile(pngFile)).toBe(EvidenceType.Image);
    });

    it("returns EvidenceType.Video for video files", () => {
      const mp4File = new File([""], "clip.mp4", { type: "video/mp4" });
      const webmFile = new File([""], "clip.webm", { type: "VIDEO/WEBM" });

      expect(getEvidenceTypeFromFile(mp4File)).toBe(EvidenceType.Video);
      expect(getEvidenceTypeFromFile(webmFile)).toBe(EvidenceType.Video);
    });

    it("returns EvidenceType.Document for document files", () => {
      const pdfFile = new File([""], "doc.pdf", { type: "application/pdf" });
      const textFile = new File([""], "notes.txt", { type: "text/plain" });
      const mswordFile = new File([""], "report.doc", { type: "application/msword" });
      const docxFile = new File([""], "report.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const excelFile = new File([""], "data.xlsx", {
        type: "application/vnd.ms-excel.spreadsheet.macroEnabled.12",
      });

      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(mswordFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docxFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(excelFile)).toBe(EvidenceType.Document);
    });

    it("returns EvidenceType.Other for unknown or empty MIME types", () => {
      const binaryFile = new File([""], "data.bin", { type: "application/octet-stream" });
      const audioFile = new File([""], "song.mp3", { type: "audio/mp3" });
      const unknownFile = new File([""], "unknown", { type: "" });

      expect(getEvidenceTypeFromFile(binaryFile)).toBe(EvidenceType.Other);
      expect(getEvidenceTypeFromFile(audioFile)).toBe(EvidenceType.Other);
      expect(getEvidenceTypeFromFile(unknownFile)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    it("generates an evidence ID with the correct prefix and case ID", () => {
      const caseId = "CASE-101";
      const evidenceId = generateEvidenceId(caseId);

      expect(evidenceId).toMatch(/^EV-CASE-101-\d+-[a-z0-9]{6}$/);
    });
  });

  describe("shortenAddress", () => {
    it("returns empty string when address is empty or falsy", () => {
      expect(shortenAddress("")).toBe("");
    });

    it("shortens valid blockchain address to start and end characters", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      expect(shortenAddress(address)).toBe("0x1234...5678");
    });
  });

  describe("formatBlockchainDate", () => {
    it("formats unix timestamp (seconds) into locale string", () => {
      vi.spyOn(Date.prototype, "toLocaleString").mockImplementation(function (
        this: Date
      ) {
        return this.toISOString();
      });

      const timestampInSeconds = 1700000000;
      const result = formatBlockchainDate(timestampInSeconds);

      expect(result).toBe(new Date(timestampInSeconds * 1000).toISOString());
    });
  });
});

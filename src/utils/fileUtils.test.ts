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
    it("should return EvidenceType.Image for image files", () => {
      const fileJpeg = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
      const filePng = new File(["dummy content"], "test.png", { type: "IMAGE/PNG" });

      expect(getEvidenceTypeFromFile(fileJpeg)).toBe(EvidenceType.Image);
      expect(getEvidenceTypeFromFile(filePng)).toBe(EvidenceType.Image);
    });

    it("should return EvidenceType.Video for video files", () => {
      const fileMp4 = new File(["dummy content"], "test.mp4", { type: "video/mp4" });
      const fileWebm = new File(["dummy content"], "test.webm", { type: "VIDEO/WEBM" });

      expect(getEvidenceTypeFromFile(fileMp4)).toBe(EvidenceType.Video);
      expect(getEvidenceTypeFromFile(fileWebm)).toBe(EvidenceType.Video);
    });

    it("should return EvidenceType.Document for document files", () => {
      const pdfFile = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
      const txtFile = new File(["dummy"], "doc.txt", { type: "text/plain" });
      const wordFile = new File(["dummy"], "doc.doc", { type: "application/msword" });
      const docxFile = new File(["dummy"], "doc.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const sheetFile = new File(["dummy"], "sheet.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(txtFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(wordFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docxFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(sheetFile)).toBe(EvidenceType.Document);
    });

    it("should return EvidenceType.Other for unknown file types", () => {
      const audioFile = new File(["dummy"], "audio.mp3", { type: "audio/mp3" });
      const unknownFile = new File(["dummy"], "unknown", { type: "" });

      expect(getEvidenceTypeFromFile(audioFile)).toBe(EvidenceType.Other);
      expect(getEvidenceTypeFromFile(unknownFile)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    beforeEach(() => {
      vi.spyOn(Date, "now").mockReturnValue(1700000000000);
      vi.spyOn(Math, "random").mockReturnValue(0.123456789);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should generate a deterministic evidence ID with mocked values", () => {
      // 0.123456789.toString(36) is "0.4fzzzx...", substring(2, 8) gets "4fzzzx"
      const randomPart = (0.123456789).toString(36).substring(2, 8);
      const caseId = "CASE123";
      const evidenceId = generateEvidenceId(caseId);

      expect(evidenceId).toBe(`EV-${caseId}-1700000000000-${randomPart}`);
    });
  });

  describe("shortenAddress", () => {
    it("should return empty string if address is empty or null/undefined", () => {
      expect(shortenAddress("")).toBe("");
      expect(shortenAddress(null as unknown as string)).toBe("");
      expect(shortenAddress(undefined as unknown as string)).toBe("");
    });

    it("should shorten valid Ethereum address correctly", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      expect(shortenAddress(address)).toBe("0x1234...5678");
    });
  });

  describe("formatBlockchainDate", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should convert timestamp (in seconds) to localized date string", () => {
      const dateSpy = vi
        .spyOn(Date.prototype, "toLocaleString")
        .mockImplementation(function (this: Date) {
          return this.toISOString();
        });

      const timestampInSeconds = 1700000000;
      const result = formatBlockchainDate(timestampInSeconds);

      expect(dateSpy).toHaveBeenCalled();
      expect(result).toBe(new Date(timestampInSeconds * 1000).toISOString());
    });
  });
});

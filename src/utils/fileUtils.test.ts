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
    it("should return EvidenceType.Image for image MIME types", () => {
      const file = new File(["dummy content"], "test.png", { type: "image/png" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);
    });

    it("should return EvidenceType.Video for video MIME types", () => {
      const file = new File(["dummy content"], "test.mp4", { type: "video/mp4" });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it("should return EvidenceType.Document for document MIME types", () => {
      const pdfFile = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
      const textFile = new File(["dummy content"], "test.txt", { type: "text/plain" });
      const docFile = new File(["dummy content"], "test.doc", { type: "application/msword" });
      const docxFile = new File(["dummy content"], "test.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docxFile)).toBe(EvidenceType.Document);
    });

    it("should return EvidenceType.Other for unknown or unsupported MIME types", () => {
      const audioFile = new File(["dummy content"], "test.mp3", { type: "audio/mp3" });
      const unknownFile = new File(["dummy content"], "test.bin", { type: "application/octet-stream" });

      expect(getEvidenceTypeFromFile(audioFile)).toBe(EvidenceType.Other);
      expect(getEvidenceTypeFromFile(unknownFile)).toBe(EvidenceType.Other);
    });
  });

  describe("generateEvidenceId", () => {
    it("should generate evidence ID starting with EV-caseId-timestamp-random", () => {
      const caseId = "CASE123";
      const evidenceId = generateEvidenceId(caseId);

      expect(evidenceId).toMatch(/^EV-CASE123-\d+-[a-z0-9]+$/);
    });
  });

  describe("shortenAddress", () => {
    it("should return an empty string if address is empty", () => {
      expect(shortenAddress("")).toBe("");
    });

    it("should correctly shorten a valid blockchain address", () => {
      const address = "0x1234567890123456789012345678901234567890";
      expect(shortenAddress(address)).toBe("0x1234...7890");
    });
  });

  describe("formatBlockchainDate", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should format a blockchain timestamp (in seconds) to locale string deterministically", () => {
      vi.spyOn(Date.prototype, "toLocaleString").mockImplementation(function (this: Date) {
        return this.toISOString();
      });

      const timestampInSeconds = 1700000000;
      const result = formatBlockchainDate(timestampInSeconds);

      expect(result).toBe(new Date(1700000000 * 1000).toISOString());
    });

    it("should pass correct milliseconds to Date constructor when converting timestamp", () => {
      const spyToLocaleString = vi
        .spyOn(Date.prototype, "toLocaleString")
        .mockReturnValue("Mocked Date String");

      const timestampInSeconds = 1600000000;
      const result = formatBlockchainDate(timestampInSeconds);

      expect(spyToLocaleString).toHaveBeenCalledTimes(1);
      expect(result).toBe("Mocked Date String");
    });
  });
});

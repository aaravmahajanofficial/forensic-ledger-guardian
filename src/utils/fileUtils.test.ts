import { describe, it, expect } from "vitest";
import { getEvidenceTypeFromFile } from "./fileUtils";
import { EvidenceType } from "@/services/web3Service";

describe("getEvidenceTypeFromFile", () => {
  it("should return EvidenceType.Image for image MIME types", () => {
    const file = new File([""], "image.png", { type: "image/png" });
    expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);

    const jpegFile = new File([""], "image.jpg", { type: "image/jpeg" });
    expect(getEvidenceTypeFromFile(jpegFile)).toBe(EvidenceType.Image);
  });

  it("should return EvidenceType.Video for video MIME types", () => {
    const file = new File([""], "video.mp4", { type: "video/mp4" });
    expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);

    const webmFile = new File([""], "video.webm", { type: "video/webm" });
    expect(getEvidenceTypeFromFile(webmFile)).toBe(EvidenceType.Video);
  });

  it("should return EvidenceType.Document for specific document MIME types", () => {
    const pdfFile = new File([""], "doc.pdf", { type: "application/pdf" });
    expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);

    const textFile = new File([""], "doc.txt", { type: "text/plain" });
    expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);

    const mswordFile = new File([""], "doc.doc", { type: "application/msword" });
    expect(getEvidenceTypeFromFile(mswordFile)).toBe(EvidenceType.Document);
  });

  it("should return EvidenceType.Document for MIME types including 'document' or 'spreadsheet'", () => {
    const wordxFile = new File([""], "doc.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    expect(getEvidenceTypeFromFile(wordxFile)).toBe(EvidenceType.Document);

    const sheetFile = new File([""], "sheet.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    expect(getEvidenceTypeFromFile(sheetFile)).toBe(EvidenceType.Document);
  });

  it("should handle uppercase MIME types correctly", () => {
    // Note: The File constructor automatically lowercases the type property in some environments,
    // but the function getEvidenceTypeFromFile calls toLowerCase() on the type just in case.
    // To explicitly test the toLowerCase behavior, we could mock the object,
    // but since getEvidenceTypeFromFile expects a File, we'll cast a custom object.
    const mockFile = { type: "IMAGE/PNG" } as File;
    expect(getEvidenceTypeFromFile(mockFile)).toBe(EvidenceType.Image);
  });

  it("should return EvidenceType.Other for unknown MIME types", () => {
    const audioFile = new File([""], "audio.mp3", { type: "audio/mpeg" });
    expect(getEvidenceTypeFromFile(audioFile)).toBe(EvidenceType.Other);

    const zipFile = new File([""], "archive.zip", { type: "application/zip" });
    expect(getEvidenceTypeFromFile(zipFile)).toBe(EvidenceType.Other);
  });

  it("should return EvidenceType.Other for empty MIME type", () => {
    const emptyFile = new File([""], "unknown", { type: "" });
    expect(getEvidenceTypeFromFile(emptyFile)).toBe(EvidenceType.Other);
  });
});

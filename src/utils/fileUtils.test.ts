// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateEvidenceId,
  getEvidenceTypeFromFile,
  shortenAddress,
  formatBlockchainDate,
} from './fileUtils';
import { EvidenceType } from '@/services/web3Service';

describe('fileUtils', () => {
  describe('generateEvidenceId', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate an evidence ID formatted as EV-{caseId}-{timestamp}-{randomPart}', () => {
      const mockTimestamp = 1700000000000;
      const mockRandom = 0.123456789; // Math.random().toString(36) -> "0.4fzyo82mvyr", substring(2, 8) -> "4fzyo8"

      vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
      vi.spyOn(Math, 'random').mockReturnValue(mockRandom);

      const caseId = 'CASE-101';
      const expectedRandomPart = mockRandom.toString(36).substring(2, 8);
      const result = generateEvidenceId(caseId);

      expect(result).toBe(`EV-${caseId}-${mockTimestamp}-${expectedRandomPart}`);
    });

    it('should include the provided caseId in the returned string', () => {
      const caseId = 'XYZ-999';
      const result = generateEvidenceId(caseId);

      expect(result).toContain(`EV-${caseId}-`);
    });

    it('should produce unique evidence IDs on subsequent calls when random values or timestamps differ', () => {
      const caseId = 'CASE-101';
      const id1 = generateEvidenceId(caseId);
      const id2 = generateEvidenceId(caseId);

      // Unless Math.random() generates exact same string, IDs should be distinct
      expect(id1).not.toBe(id2);
    });
  });

  describe('getEvidenceTypeFromFile', () => {
    it('should return EvidenceType.Image for image MIME types', () => {
      const file = new File([''], 'photo.png', { type: 'image/png' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);
    });

    it('should return EvidenceType.Video for video MIME types', () => {
      const file = new File([''], 'clip.mp4', { type: 'video/mp4' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it('should return EvidenceType.Document for document MIME types', () => {
      const pdfFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
      const txtFile = new File([''], 'notes.txt', { type: 'text/plain' });
      const docFile = new File([''], 'file.doc', { type: 'application/msword' });

      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(txtFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);
    });

    it('should return EvidenceType.Other for unknown MIME types', () => {
      const file = new File([''], 'archive.zip', { type: 'application/zip' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Other);
    });
  });

  describe('shortenAddress', () => {
    it('should return empty string for falsy address input', () => {
      expect(shortenAddress('')).toBe('');
    });

    it('should correctly format a standard blockchain address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(shortenAddress(address)).toBe('0x1234...5678');
    });
  });

  describe('formatBlockchainDate', () => {
    it('should format epoch seconds to local date string', () => {
      const timestamp = 1700000000; // seconds
      const spy = vi
        .spyOn(Date.prototype, 'toLocaleString')
        .mockImplementation(function (this: Date) {
          return this.toISOString();
        });

      const formatted = formatBlockchainDate(timestamp);
      expect(formatted).toBe(new Date(1700000000000).toISOString());
      spy.mockRestore();
    });
  });
});

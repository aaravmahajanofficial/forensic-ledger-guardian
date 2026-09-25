// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEvidenceTypeFromFile,
  generateEvidenceId,
  shortenAddress,
  formatBlockchainDate,
} from './fileUtils';
import { EvidenceType } from '@/services/web3Service';

describe('fileUtils', () => {
  describe('getEvidenceTypeFromFile', () => {
    it('should identify image MIME types as EvidenceType.Image', () => {
      const file = new File([''], 'photo.png', { type: 'image/png' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);
    });

    it('should identify video MIME types as EvidenceType.Video', () => {
      const file = new File([''], 'video.mp4', { type: 'video/mp4' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);
    });

    it('should identify document MIME types as EvidenceType.Document', () => {
      const pdfFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
      const txtFile = new File([''], 'notes.txt', { type: 'text/plain' });
      const docFile = new File([''], 'word.doc', { type: 'application/msword' });
      const sheetFile = new File([''], 'sheet.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(txtFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(docFile)).toBe(EvidenceType.Document);
      expect(getEvidenceTypeFromFile(sheetFile)).toBe(EvidenceType.Document);
    });

    it('should default to EvidenceType.Other for unknown MIME types', () => {
      const file = new File([''], 'unknown.bin', { type: 'application/octet-stream' });
      expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Other);
    });
  });

  describe('generateEvidenceId', () => {
    it('should generate a valid evidence ID with case ID prefix', () => {
      const caseId = 'CASE-123';
      const evidenceId = generateEvidenceId(caseId);

      expect(evidenceId).toMatch(/^EV-CASE-123-\d+-[a-z0-9]{6}$/);
    });
  });

  describe('shortenAddress', () => {
    it('should shorten an Ethereum address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(shortenAddress(address)).toBe('0x1234...7890');
    });

    it('should return empty string for empty input', () => {
      expect(shortenAddress('')).toBe('');
    });
  });

  describe('formatBlockchainDate', () => {
    beforeEach(() => {
      vi.spyOn(Date.prototype, 'toLocaleString').mockImplementation(function (
        this: Date
      ) {
        return this.toISOString();
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should convert Unix timestamp in seconds to locale string format', () => {
      const timestampInSeconds = 1700000000; // 2023-11-14T22:13:20.000Z
      const result = formatBlockchainDate(timestampInSeconds);

      expect(result).toBe(new Date(1700000000000).toISOString());
    });

    it('should handle zero timestamp', () => {
      const result = formatBlockchainDate(0);
      expect(result).toBe(new Date(0).toISOString());
    });
  });
});

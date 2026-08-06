// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { getEvidenceTypeFromFile } from './fileUtils';
import { EvidenceType } from '@/services/web3Service';

describe('getEvidenceTypeFromFile', () => {
  it('identifies image files', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Image);

    const jpegFile = new File([''], 'test.jpg', { type: 'IMAGE/JPEG' });
    expect(getEvidenceTypeFromFile(jpegFile)).toBe(EvidenceType.Image);
  });

  it('identifies video files', () => {
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    expect(getEvidenceTypeFromFile(file)).toBe(EvidenceType.Video);

    const webmFile = new File([''], 'test.webm', { type: 'VIDEO/WEBM' });
    expect(getEvidenceTypeFromFile(webmFile)).toBe(EvidenceType.Video);
  });

  it('identifies document files', () => {
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    expect(getEvidenceTypeFromFile(pdfFile)).toBe(EvidenceType.Document);

    const textFile = new File([''], 'test.txt', { type: 'text/plain' });
    expect(getEvidenceTypeFromFile(textFile)).toBe(EvidenceType.Document);

    const wordFile = new File([''], 'test.doc', { type: 'application/msword' });
    expect(getEvidenceTypeFromFile(wordFile)).toBe(EvidenceType.Document);

    const openDocFile = new File([''], 'test.odt', { type: 'application/vnd.oasis.opendocument.text' });
    expect(getEvidenceTypeFromFile(openDocFile)).toBe(EvidenceType.Document);

    const spreadsheetFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    expect(getEvidenceTypeFromFile(spreadsheetFile)).toBe(EvidenceType.Document);
  });

  it('identifies other files', () => {
    const jsonFile = new File([''], 'test.json', { type: 'application/json' });
    expect(getEvidenceTypeFromFile(jsonFile)).toBe(EvidenceType.Other);

    const binFile = new File([''], 'test.bin', { type: 'application/octet-stream' });
    expect(getEvidenceTypeFromFile(binFile)).toBe(EvidenceType.Other);

    const audioFile = new File([''], 'test.mp3', { type: 'audio/mp3' });
    expect(getEvidenceTypeFromFile(audioFile)).toBe(EvidenceType.Other);
  });

  it('handles empty type', () => {
    const noTypeFile = new File([''], 'test');
    expect(getEvidenceTypeFromFile(noTypeFile)).toBe(EvidenceType.Other);
  });
});

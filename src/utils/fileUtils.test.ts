import { describe, it, expect } from 'vitest';
import { formatBlockchainDate } from './fileUtils';

describe('formatBlockchainDate', () => {
  it('should format a standard blockchain timestamp correctly', () => {
    // 1672531200 is 2023-01-01T00:00:00.000Z
    const timestamp = 1672531200;
    const expectedDate = new Date(timestamp * 1000).toLocaleString();
    expect(formatBlockchainDate(timestamp)).toBe(expectedDate);
  });

  it('should handle zero timestamp correctly', () => {
    // 0 is the Unix Epoch (1970-01-01T00:00:00.000Z)
    const timestamp = 0;
    const expectedDate = new Date(timestamp * 1000).toLocaleString();
    expect(formatBlockchainDate(timestamp)).toBe(expectedDate);
  });

  it('should handle a future timestamp correctly', () => {
    // 2000000000 is 2033-05-18T03:33:20.000Z
    const timestamp = 2000000000;
    const expectedDate = new Date(timestamp * 1000).toLocaleString();
    expect(formatBlockchainDate(timestamp)).toBe(expectedDate);
  });

  it('should handle a negative timestamp correctly', () => {
    // -1672531200 is 1917-01-01T00:00:00.000Z
    const timestamp = -1672531200;
    const expectedDate = new Date(timestamp * 1000).toLocaleString();
    expect(formatBlockchainDate(timestamp)).toBe(expectedDate);
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateEvidenceId } from './fileUtils';

describe('generateEvidenceId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate an ID starting with "EV-"', () => {
    const id = generateEvidenceId('test-case');
    expect(id.startsWith('EV-')).toBe(true);
  });

  it('should include the provided caseId', () => {
    const id = generateEvidenceId('case-123');
    expect(id).toContain('case-123');
  });

  it('should generate a deterministic ID when Date and Math.random are mocked', () => {
    const mockDate = 1625097600000;
    vi.spyOn(Date, 'now').mockReturnValue(mockDate);

    const mockRandomValue = 0.123456789;
    vi.spyOn(Math, 'random').mockReturnValue(mockRandomValue);

    const id = generateEvidenceId('mocked-case');

    const expectedRandomPart = mockRandomValue.toString(36).substring(2, 8);
    expect(id).toBe(`EV-mocked-case-${mockDate}-${expectedRandomPart}`);
  });

  it('should generate unique IDs on subsequent calls', () => {
    const id1 = generateEvidenceId('case-abc');
    const id2 = generateEvidenceId('case-abc');

    expect(id1).not.toBe(id2);
  });
});

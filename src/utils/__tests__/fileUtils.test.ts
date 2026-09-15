import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateEvidenceId } from '../fileUtils';

describe('generateEvidenceId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate an ID with the correct format', () => {
    const caseId = 'CASE123';
    const id = generateEvidenceId(caseId);

    // EV-{caseId}-{timestamp}-{randomPart (length up to 6)}
    expect(id).toMatch(/^EV-CASE123-\d+-[a-z0-9]{1,6}$/);
  });

  it('should generate a predictable ID when Date and Math.random are mocked', () => {
    const mockDate = 1620000000000;
    vi.spyOn(Date, 'now').mockReturnValue(mockDate);

    // Math.random() = 0.999999 -> .toString(36) -> "0.zzzz..."
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);

    const caseId = 'TESTCASE';
    const id = generateEvidenceId(caseId);

    const randomPart = 0.999999.toString(36).substring(2, 8);
    expect(id).toBe(`EV-TESTCASE-${mockDate}-${randomPart}`);
  });

  it('should handle edge cases like random being 0', () => {
    const mockDate = 1620000000000;
    vi.spyOn(Date, 'now').mockReturnValue(mockDate);

    // Math.random() = 0 -> .toString(36) -> "0"
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const caseId = 'TESTCASE';
    const id = generateEvidenceId(caseId);

    const randomPart = (0).toString(36).substring(2, 8);
    expect(id).toBe(`EV-TESTCASE-${mockDate}-${randomPart}`);
  });

  it('should generate unique IDs on subsequent calls', () => {
    const id1 = generateEvidenceId('CASE1');
    const id2 = generateEvidenceId('CASE1');

    // Because timestamp might be the same, Math.random provides uniqueness
    expect(id1).not.toBe(id2);
  });
});

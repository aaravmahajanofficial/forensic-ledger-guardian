import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { formatBlockchainDate } from "../fileUtils";

describe("formatBlockchainDate", () => {
  beforeEach(() => {
    // Mock the locale to ensure tests are completely deterministic across environments
    vi.spyOn(Date.prototype, 'toLocaleString').mockImplementation(function(this: Date) {
      return this.toISOString();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("formats a blockchain timestamp (seconds) correctly", () => {
    const timestamp = 1704110400; // 2024-01-01T12:00:00.000Z
    const expected = "2024-01-01T12:00:00.000Z";

    expect(formatBlockchainDate(timestamp)).toBe(expected);
  });

  it("handles zero timestamp (epoch)", () => {
    const timestamp = 0; // 1970-01-01T00:00:00.000Z
    const expected = "1970-01-01T00:00:00.000Z";

    expect(formatBlockchainDate(timestamp)).toBe(expected);
  });

  it("handles negative timestamps", () => {
    const timestamp = -86400; // 1969-12-31T00:00:00.000Z
    const expected = "1969-12-31T00:00:00.000Z";

    expect(formatBlockchainDate(timestamp)).toBe(expected);
  });
});

import { describe, it, expect } from "vitest";
import { sanitizeInput } from "./utils/sanitizer.js";

describe("sanitizeInput", () => {
  it("strips HTML and script tags from input strings", () => {
    const maliciousInput = "<script>alert('xss')</script>Case Title";
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe("alert('xss')Case Title");
  });

  it("trims whitespace from input strings", () => {
    const paddedInput = "   Case Description   ";
    const sanitized = sanitizeInput(paddedInput);
    expect(sanitized).toBe("Case Description");
  });

  it("strips control characters", () => {
    const controlInput = "Line\x00One\x07Two";
    const sanitized = sanitizeInput(controlInput);
    expect(sanitized).toBe("LineOneTwo");
  });

  it("handles non-string inputs gracefully", () => {
    expect(sanitizeInput(null as unknown as string)).toBeNull();
    expect(sanitizeInput(123 as unknown as string)).toBe(123);
  });
});

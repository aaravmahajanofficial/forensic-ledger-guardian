import { describe, it, expect } from "vitest";
import { sanitizeInput, sanitizeLog } from "./utils/sanitizer.js";

describe("sanitizeInput", () => {
  it("strips HTML tags and quotes to prevent element injection", () => {
    const maliciousInput = "<script>alert('xss')</script>Case Title";
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe("scriptalert(xss)/scriptCase Title");
  });

  it("strips quotes and angle brackets", () => {
    const input = 'Fish & "Chips" / <Bread>';
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("Fish & Chips / Bread");
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

  it("sanitizes route query parameters removing single quotes and special characters", () => {
    const maliciousParam = "container-123' OR '1'='1";
    const sanitized = sanitizeInput(maliciousParam);
    expect(sanitized).toBe("container-123 OR 1=1");
  });
});

describe("sanitizeLog", () => {
  it("encodes newlines and control characters in log entries", () => {
    const logData = "CASE-123\nHTTP/1.1 200 OK\r\n";
    expect(sanitizeLog(logData)).toBe("CASE-123HTTP%2F1.1%20200%20OK");
  });
});

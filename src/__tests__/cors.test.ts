import { describe, it, expect } from "vitest";

function getAllowedOrigins(allowedOriginsEnv?: string, frontendUrlEnv?: string) {
  return allowedOriginsEnv
    ? allowedOriginsEnv.split(",").map((o) => o.trim()).filter(Boolean)
    : [frontendUrlEnv || "http://localhost:5173"];
}

function checkCorsOrigin(origin: string | undefined, allowedOrigins: string[]): boolean {
  return !origin || allowedOrigins.includes(origin);
}

describe("CORS configuration tests", () => {
  it("allows origin configured in ALLOWED_ORIGINS", () => {
    const allowedOrigins = getAllowedOrigins("http://example.com, https://app.example.com");
    expect(allowedOrigins).toEqual(["http://example.com", "https://app.example.com"]);
    expect(checkCorsOrigin("http://example.com", allowedOrigins)).toBe(true);
    expect(checkCorsOrigin("https://unauthorized.com", allowedOrigins)).toBe(false);
  });

  it("defaults to FRONTEND_URL when ALLOWED_ORIGINS is empty", () => {
    const allowedOrigins = getAllowedOrigins(undefined, "https://my-frontend.com");
    expect(allowedOrigins).toEqual(["https://my-frontend.com"]);
    expect(checkCorsOrigin("https://my-frontend.com", allowedOrigins)).toBe(true);
    expect(checkCorsOrigin("http://localhost:5173", allowedOrigins)).toBe(false);
  });

  it("defaults to http://localhost:5173 when no env vars are set", () => {
    const allowedOrigins = getAllowedOrigins(undefined, undefined);
    expect(allowedOrigins).toEqual(["http://localhost:5173"]);
    expect(checkCorsOrigin("http://localhost:5173", allowedOrigins)).toBe(true);
    expect(checkCorsOrigin("http://localhost:8080", allowedOrigins)).toBe(false);
  });

  it("allows non-browser/curl requests with undefined origin", () => {
    const allowedOrigins = getAllowedOrigins(undefined, undefined);
    expect(checkCorsOrigin(undefined, allowedOrigins)).toBe(true);
  });
});

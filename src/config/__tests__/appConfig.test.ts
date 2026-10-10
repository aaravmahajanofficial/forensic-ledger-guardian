import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateEnv, appConfig } from "../appConfig";

describe("appConfig / validateEnv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return custom VITE_BACKEND_URL when set", () => {
    vi.stubEnv("VITE_BACKEND_URL", "https://api.example.com");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const backendUrl = validateEnv();

    expect(backendUrl).toBe("https://api.example.com");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should warn and return default URL when VITE_BACKEND_URL is not set", () => {
    vi.stubEnv("VITE_BACKEND_URL", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const backendUrl = validateEnv();

    expect(backendUrl).toBe("http://localhost:4000");
    expect(warnSpy).toHaveBeenCalledWith(
      "VITE_BACKEND_URL is not set. Defaulting to http://localhost:4000. Set VITE_BACKEND_URL in your .env file for production."
    );
  });

  it("should export appConfig object with backendUrl property", () => {
    expect(appConfig).toBeDefined();
    expect(typeof appConfig.backendUrl).toBe("string");
  });
});

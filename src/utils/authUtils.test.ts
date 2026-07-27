import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { forceAuthReset, clearAllAuthData, isDevUser } from "./authUtils";

describe("authUtils", () => {
  describe("clearAllAuthData", () => {
    beforeEach(() => {
      localStorage.setItem("forensicLedgerUser", "test-user");
      localStorage.setItem("walletconnect", "test-wallet");
      localStorage.setItem("WALLETCONNECT_DEEPLINK_CHOICE", "test-deeplink");
      sessionStorage.setItem("forensicLedgerUser", "test-user-session");
    });

    afterEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it("should remove all auth-related items from localStorage and sessionStorage", () => {
      clearAllAuthData();

      expect(localStorage.getItem("forensicLedgerUser")).toBeNull();
      expect(localStorage.getItem("walletconnect")).toBeNull();
      expect(localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE")).toBeNull();
      expect(sessionStorage.getItem("forensicLedgerUser")).toBeNull();
    });
  });

  describe("isDevUser", () => {
    it("should always return false for production safety", () => {
      expect(isDevUser({ id: "1", email: "test@test.com" })).toBe(false);
      expect(isDevUser(null)).toBe(false);
      expect(isDevUser({})).toBe(false);
    });
  });

  describe("forceAuthReset", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { reload: vi.fn() },
      });

      // Set up some dummy data to verify clearAllAuthData is called
      localStorage.setItem("forensicLedgerUser", "test-user");
      sessionStorage.setItem("forensicLedgerUser", "test-user");
    });

    afterEach(() => {
      // Restore window.location
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
      localStorage.clear();
      sessionStorage.clear();
      vi.restoreAllMocks();
    });

    it("should clear auth data and reload the page", () => {
      forceAuthReset();

      // Verify clearAllAuthData ran
      expect(localStorage.getItem("forensicLedgerUser")).toBeNull();
      expect(sessionStorage.getItem("forensicLedgerUser")).toBeNull();

      // Verify window.location.reload was called
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});

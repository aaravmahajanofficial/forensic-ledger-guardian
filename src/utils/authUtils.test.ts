import { describe, it, expect, beforeEach } from "vitest";
import { clearAllAuthData } from "./authUtils";

describe("authUtils", () => {
  describe("clearAllAuthData", () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it("should remove forensicLedgerUser from localStorage and sessionStorage", () => {
      localStorage.setItem("forensicLedgerUser", "some_data");
      sessionStorage.setItem("forensicLedgerUser", "some_data");

      clearAllAuthData();

      expect(localStorage.getItem("forensicLedgerUser")).toBeNull();
      expect(sessionStorage.getItem("forensicLedgerUser")).toBeNull();
    });

    it("should remove walletconnect data from localStorage", () => {
      localStorage.setItem("walletconnect", "some_data");
      localStorage.setItem("WALLETCONNECT_DEEPLINK_CHOICE", "some_data");

      clearAllAuthData();

      expect(localStorage.getItem("walletconnect")).toBeNull();
      expect(localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE")).toBeNull();
    });

    it("should not throw error if storage is already empty", () => {
      expect(() => clearAllAuthData()).not.toThrow();
    });
  });
});

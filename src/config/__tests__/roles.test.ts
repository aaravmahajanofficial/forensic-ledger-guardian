import { describe, it, expect } from "vitest";
import { isValidRole } from "../roles";
import { Role } from "@/services/web3Service";

describe("roles config", () => {
  describe("isValidRole", () => {
    it("should return true for valid numeric roles", () => {
      expect(isValidRole(Role.None)).toBe(true);
      expect(isValidRole(Role.Court)).toBe(true);
      expect(isValidRole(Role.Officer)).toBe(true);
      expect(isValidRole(Role.Forensic)).toBe(true);
      expect(isValidRole(Role.Lawyer)).toBe(true);

      // Also test the literal numbers to be sure
      expect(isValidRole(0)).toBe(true);
      expect(isValidRole(1)).toBe(true);
      expect(isValidRole(2)).toBe(true);
      expect(isValidRole(3)).toBe(true);
      expect(isValidRole(4)).toBe(true);
    });

    it("should return false for invalid numeric roles", () => {
      expect(isValidRole(-1)).toBe(false);
      expect(isValidRole(5)).toBe(false);
      expect(isValidRole(100)).toBe(false);
    });

    it("should return false for other invalid types", () => {
      expect(isValidRole(null)).toBe(false);
      expect(isValidRole(undefined)).toBe(false);
      expect(isValidRole({})).toBe(false);
      expect(isValidRole([])).toBe(false);
      expect(isValidRole(true)).toBe(false);
      expect(isValidRole(false)).toBe(false);
      expect(isValidRole("0")).toBe(false);
      expect(isValidRole("1")).toBe(false);
    });
  });
});

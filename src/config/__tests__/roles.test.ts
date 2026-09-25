import { describe, it, expect } from "vitest";
import { isValidRole, getRoleNavigation, ROLE_NAVIGATION } from "../roles";
import { Role } from "@/services/web3Service";

describe("roles config", () => {
  describe("getRoleNavigation", () => {
    it("should return navigation items for valid roles", () => {
      expect(getRoleNavigation(Role.None)).toEqual(ROLE_NAVIGATION[Role.None]);
      expect(getRoleNavigation(Role.Court)).toEqual(ROLE_NAVIGATION[Role.Court]);
      expect(getRoleNavigation(Role.Officer)).toEqual(ROLE_NAVIGATION[Role.Officer]);
      expect(getRoleNavigation(Role.Forensic)).toEqual(ROLE_NAVIGATION[Role.Forensic]);
      expect(getRoleNavigation(Role.Lawyer)).toEqual(ROLE_NAVIGATION[Role.Lawyer]);

      expect(getRoleNavigation(Role.None)).toEqual([]);
      expect(getRoleNavigation(Role.Court).length).toBeGreaterThan(0);
      expect(getRoleNavigation(Role.Officer).length).toBeGreaterThan(0);
      expect(getRoleNavigation(Role.Forensic).length).toBeGreaterThan(0);
      expect(getRoleNavigation(Role.Lawyer).length).toBeGreaterThan(0);
    });

    it("should return empty array for invalid roles", () => {
      expect(getRoleNavigation(-1 as Role)).toEqual([]);
      expect(getRoleNavigation(999 as Role)).toEqual([]);
      expect(getRoleNavigation(null as unknown as Role)).toEqual([]);
      expect(getRoleNavigation(undefined as unknown as Role)).toEqual([]);
    });
  });

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

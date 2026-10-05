import { describe, it, expect } from "vitest";
import { isValidRole, getRoleConfig, ROLE_CONFIGS } from "../roles";
import { Role } from "@/services/web3Service";

describe("roles config", () => {
  describe("getRoleConfig", () => {
    it("should return the correct RoleConfig for each valid Role enum", () => {
      expect(getRoleConfig(Role.None)).toBe(ROLE_CONFIGS[Role.None]);
      expect(getRoleConfig(Role.Court)).toBe(ROLE_CONFIGS[Role.Court]);
      expect(getRoleConfig(Role.Officer)).toBe(ROLE_CONFIGS[Role.Officer]);
      expect(getRoleConfig(Role.Forensic)).toBe(ROLE_CONFIGS[Role.Forensic]);
      expect(getRoleConfig(Role.Lawyer)).toBe(ROLE_CONFIGS[Role.Lawyer]);
    });

    it("should return fallback ROLE_CONFIGS[Role.None] for invalid or unknown roles", () => {
      expect(getRoleConfig(999 as Role)).toBe(ROLE_CONFIGS[Role.None]);
      expect(getRoleConfig(-1 as Role)).toBe(ROLE_CONFIGS[Role.None]);
      expect(getRoleConfig(undefined as unknown as Role)).toBe(
        ROLE_CONFIGS[Role.None],
      );
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

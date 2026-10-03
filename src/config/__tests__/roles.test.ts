import { describe, it, expect } from "vitest";
import { isValidRole, hasPermission } from "../roles";
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

  describe("hasPermission", () => {
    it("should return true for valid permissions assigned to Court role", () => {
      expect(hasPermission(Role.Court, "manage", "users")).toBe(true);
      expect(hasPermission(Role.Court, "assign", "roles")).toBe(true);
      expect(hasPermission(Role.Court, "configure", "system")).toBe(true);
      expect(hasPermission(Role.Court, "view", "audit_logs")).toBe(true);
      expect(hasPermission(Role.Court, "view", "reports")).toBe(true);
      expect(hasPermission(Role.Court, "create", "cases")).toBe(true);
      expect(hasPermission(Role.Court, "approve", "cases")).toBe(true);
      expect(hasPermission(Role.Court, "close", "cases")).toBe(true);
      expect(hasPermission(Role.Court, "seal", "cases")).toBe(true);
    });

    it("should return true for valid permissions assigned to Officer role", () => {
      expect(hasPermission(Role.Officer, "create", "fir")).toBe(true);
      expect(hasPermission(Role.Officer, "update", "cases")).toBe(true);
      expect(hasPermission(Role.Officer, "confirm", "evidence")).toBe(true);
      expect(hasPermission(Role.Officer, "view", "reports")).toBe(true);
      expect(hasPermission(Role.Officer, "create", "cases")).toBe(true);
    });

    it("should return true for valid permissions assigned to Forensic role", () => {
      expect(hasPermission(Role.Forensic, "analyze", "evidence")).toBe(true);
      expect(hasPermission(Role.Forensic, "verify", "technical_data")).toBe(true);
      expect(hasPermission(Role.Forensic, "upload", "evidence")).toBe(true);
      expect(hasPermission(Role.Forensic, "view", "reports")).toBe(true);
    });

    it("should return true for valid permissions assigned to Lawyer role", () => {
      expect(hasPermission(Role.Lawyer, "verify", "custody_chain")).toBe(true);
      expect(hasPermission(Role.Lawyer, "create", "legal_docs")).toBe(true);
      expect(hasPermission(Role.Lawyer, "prepare", "court_cases")).toBe(true);
      expect(hasPermission(Role.Lawyer, "manage", "clients")).toBe(true);
      expect(hasPermission(Role.Lawyer, "view", "reports")).toBe(true);
    });

    it("should return false for permissions not assigned to Role.None", () => {
      expect(hasPermission(Role.None, "manage", "users")).toBe(false);
      expect(hasPermission(Role.None, "create", "fir")).toBe(false);
      expect(hasPermission(Role.None, "analyze", "evidence")).toBe(false);
      expect(hasPermission(Role.None, "view", "reports")).toBe(false);
    });

    it("should return false when checking valid action with mismatched resource", () => {
      expect(hasPermission(Role.Officer, "create", "users")).toBe(false);
      expect(hasPermission(Role.Forensic, "upload", "users")).toBe(false);
      expect(hasPermission(Role.Lawyer, "manage", "users")).toBe(false);
    });

    it("should return false when checking mismatched action with valid resource", () => {
      expect(hasPermission(Role.Court, "delete", "users")).toBe(false);
      expect(hasPermission(Role.Officer, "delete", "cases")).toBe(false);
      expect(hasPermission(Role.Forensic, "delete", "evidence")).toBe(false);
    });

    it("should return false for completely unknown actions and resources", () => {
      expect(hasPermission(Role.Court, "invalid_action", "invalid_resource")).toBe(false);
      expect(hasPermission(Role.Officer, "invalid_action", "invalid_resource")).toBe(false);
    });

    it("should return false for invalid or out-of-bounds role values", () => {
      expect(hasPermission(999 as Role, "manage", "users")).toBe(false);
      expect(hasPermission(-1 as Role, "create", "fir")).toBe(false);
    });
  });
});

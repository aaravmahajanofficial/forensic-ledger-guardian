import { describe, it, expect } from "vitest";
import {
  getRoleConfig,
  hasPermission,
  getRoleNavigation,
  isValidRole,
  getRoleTitle,
  getRoleColor,
  getRoleBackgroundColor,
  ROLE_CONFIGS,
  ROLE_PERMISSIONS,
  ROLE_NAVIGATION,
} from "./roles";
import { Role } from "@/services/web3Service";

describe("roles.ts configuration utilities", () => {
  describe("getRoleConfig", () => {
    it("should return the correct configuration for a valid role", () => {
      const config = getRoleConfig(Role.Court);
      expect(config).toEqual(ROLE_CONFIGS[Role.Court]);
      expect(config.name).toBe("Court");
    });

    it("should return Role.None configuration for an invalid role", () => {
      // @ts-expect-error Testing invalid role
      const config = getRoleConfig(999);
      expect(config).toEqual(ROLE_CONFIGS[Role.None]);
    });

    it("should return Role.None configuration for Role.None", () => {
      const config = getRoleConfig(Role.None);
      expect(config).toEqual(ROLE_CONFIGS[Role.None]);
    });
  });

  describe("hasPermission", () => {
    it("should return true when a role has the specified permission", () => {
      // Using an actual permission from the configuration: Court has manage users
      expect(hasPermission(Role.Court, "manage", "users")).toBe(true);

      // Officer has create fir
      expect(hasPermission(Role.Officer, "create", "fir")).toBe(true);
    });

    it("should return false when a role does not have the specified action but has access to the resource", () => {
      // Court does not have "delete" action on "users" (based on our actual config)
      expect(hasPermission(Role.Court, "delete", "users")).toBe(false);
    });

    it("should return false when a role has the specified action but not on the resource", () => {
      // Officer has "create" action, but not on "users" resource
      expect(hasPermission(Role.Officer, "create", "users")).toBe(false);
    });

    it("should return false when an invalid role is provided", () => {
      // @ts-expect-error Testing invalid role
      expect(hasPermission(999, "manage", "users")).toBe(false);
    });

    it("should return false for Role.None on any permission", () => {
      expect(hasPermission(Role.None, "manage", "users")).toBe(false);
    });
  });

  describe("getRoleNavigation", () => {
    it("should return the navigation items for a valid role", () => {
      const nav = getRoleNavigation(Role.Lawyer);
      expect(nav).toEqual(ROLE_NAVIGATION[Role.Lawyer]);
      expect(nav.length).toBeGreaterThan(0);
    });

    it("should return an empty array for an invalid role", () => {
      // @ts-expect-error Testing invalid role
      const nav = getRoleNavigation(999);
      expect(nav).toEqual([]);
    });

    it("should return an empty array for Role.None", () => {
      const nav = getRoleNavigation(Role.None);
      expect(nav).toEqual([]);
    });
  });

  describe("isValidRole", () => {
    it("should return true for valid roles", () => {
      expect(isValidRole(Role.None)).toBe(true);
      expect(isValidRole(Role.Court)).toBe(true);
      expect(isValidRole(Role.Officer)).toBe(true);
      expect(isValidRole(Role.Forensic)).toBe(true);
      expect(isValidRole(Role.Lawyer)).toBe(true);
    });

    it("should return false for invalid roles", () => {
      expect(isValidRole(999)).toBe(false);
      expect(isValidRole(-1)).toBe(false);
      expect(isValidRole(null)).toBe(false);
      expect(isValidRole(undefined)).toBe(false);
      expect(isValidRole("invalid")).toBe(false);
    });
  });

  describe("UI styling utilities", () => {
    it("getRoleTitle should return the correct title for a role", () => {
      expect(getRoleTitle(Role.Forensic)).toBe("Forensic Expert");
      // @ts-expect-error Testing invalid role
      expect(getRoleTitle(999)).toBe("No Role"); // Falls back to None
    });

    it("getRoleColor should return the correct text color for a role", () => {
      expect(getRoleColor(Role.Lawyer)).toBe("text-purple-600");
      // @ts-expect-error Testing invalid role
      expect(getRoleColor(999)).toBe("text-gray-500"); // Falls back to None
    });

    it("getRoleBackgroundColor should return the correct background color for a role", () => {
      expect(getRoleBackgroundColor(Role.Officer)).toBe("bg-forensic-800");
      // @ts-expect-error Testing invalid role
      expect(getRoleBackgroundColor(999)).toBe("bg-gray-500"); // Falls back to None
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { authService, AuthUser } from "../authService";
import { Role } from "@/services/web3Service";

describe("AuthService hasPermission", () => {
  beforeEach(() => {
    // Reset private currentUser state via prototype/internal property cast for isolated testing
    (authService as unknown as { currentUser: AuthUser | null }).currentUser = null;
  });

  it("should return false if no user is logged in", () => {
    expect(authService.hasPermission("create", "fir")).toBe(false);
  });

  it("should return true for any permission when user is Court role", () => {
    (authService as unknown as { currentUser: AuthUser | null }).currentUser = {
      id: "1",
      email: "court@test.com",
      name: "Court Official",
      role: Role.Court,
      roleTitle: "Court Official",
      authType: "email",
    };

    expect(authService.hasPermission("manage", "users")).toBe(true);
    expect(authService.hasPermission("any_action", "any_resource")).toBe(true);
  });

  it("should check granular permissions for Officer role", () => {
    (authService as unknown as { currentUser: AuthUser | null }).currentUser = {
      id: "2",
      email: "officer@test.com",
      name: "Officer Test",
      role: Role.Officer,
      roleTitle: "Police Officer",
      authType: "email",
    };

    expect(authService.hasPermission("create", "fir")).toBe(true);
    expect(authService.hasPermission("confirm", "evidence")).toBe(true);
    expect(authService.hasPermission("manage", "users")).toBe(false);
    expect(authService.hasPermission("analyze", "evidence")).toBe(false);
  });

  it("should check granular permissions for Forensic role", () => {
    (authService as unknown as { currentUser: AuthUser | null }).currentUser = {
      id: "3",
      email: "forensic@test.com",
      name: "Forensic Test",
      role: Role.Forensic,
      roleTitle: "Forensic Expert",
      authType: "email",
    };

    expect(authService.hasPermission("analyze", "evidence")).toBe(true);
    expect(authService.hasPermission("upload", "evidence")).toBe(true);
    expect(authService.hasPermission("create", "fir")).toBe(false);
  });

  it("should check granular permissions for Lawyer role", () => {
    (authService as unknown as { currentUser: AuthUser | null }).currentUser = {
      id: "4",
      email: "lawyer@test.com",
      name: "Lawyer Test",
      role: Role.Lawyer,
      roleTitle: "Legal Counsel",
      authType: "email",
    };

    expect(authService.hasPermission("verify", "custody_chain")).toBe(true);
    expect(authService.hasPermission("manage", "clients")).toBe(true);
    expect(authService.hasPermission("create", "fir")).toBe(false);
  });
});

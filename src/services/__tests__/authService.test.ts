// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import authService, { AuthUser } from "../authService";
import { Role } from "../web3Service";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: null,
}));

vi.mock("../roleManagementService", () => ({
  roleManagementService: {
    getRoleForWallet: vi.fn(),
  },
}));

vi.mock("../web3Service", () => ({
  default: {
    isContractOwner: vi.fn(),
    initializeAdminRole: vi.fn(),
    getUserRole: vi.fn(),
  },
  Role: {
    None: 0,
    Court: 1,
    Officer: 2,
    Forensic: 3,
    Lawyer: 4,
  },
}));

describe("AuthService security - storage isolation", () => {
  const dummyUser: AuthUser = {
    id: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    role: Role.Officer,
    roleTitle: "Police Officer",
    authType: "email",
  };

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await authService.logout();
  });

  it("should store auth state in sessionStorage instead of localStorage", () => {
    // @ts-expect-error accessing private field for testing
    authService.currentUser = dummyUser;
    // @ts-expect-error accessing private method for testing
    authService.saveAuthState();

    const sessionStored = sessionStorage.getItem("forensicLedgerUser");
    const localStored = localStorage.getItem("forensicLedgerUser");

    expect(sessionStored).not.toBeNull();
    expect(JSON.parse(sessionStored!)).toEqual(dummyUser);
    expect(localStored).toBeNull();
  });

  it("should initialize auth user from sessionStorage", async () => {
    sessionStorage.setItem("forensicLedgerUser", JSON.stringify(dummyUser));

    const user = await authService.initializeFromStorage();

    expect(user).toEqual(dummyUser);
    expect(authService.getCurrentUser()).toEqual(dummyUser);
  });

  it("should migrate user from localStorage to sessionStorage during initialization and clean up localStorage", async () => {
    localStorage.setItem("forensicLedgerUser", JSON.stringify(dummyUser));

    const user = await authService.initializeFromStorage();

    expect(user).toEqual(dummyUser);
    expect(localStorage.getItem("forensicLedgerUser")).toBeNull();
    expect(sessionStorage.getItem("forensicLedgerUser")).not.toBeNull();
  });

  it("should clear both sessionStorage and localStorage on logout", async () => {
    sessionStorage.setItem("forensicLedgerUser", JSON.stringify(dummyUser));
    localStorage.setItem("forensicLedgerUser", JSON.stringify(dummyUser));

    await authService.logout();

    expect(sessionStorage.getItem("forensicLedgerUser")).toBeNull();
    expect(localStorage.getItem("forensicLedgerUser")).toBeNull();
    expect(authService.getCurrentUser()).toBeNull();
  });
});

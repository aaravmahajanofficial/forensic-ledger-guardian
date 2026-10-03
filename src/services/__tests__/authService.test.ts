// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock supabase client module
vi.mock("@/lib/supabaseClient", () => {
  return {
    supabase: {
      auth: {
        signOut: vi.fn(),
        signInWithPassword: vi.fn(),
        getSession: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

// Mock web3Service and roleManagementService to prevent side-effects during imports
vi.mock("@/services/web3Service", () => ({
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

vi.mock("@/services/roleManagementService", () => ({
  roleManagementService: {
    getRoleForWallet: vi.fn(),
    assignWalletToRole: vi.fn(),
    createCourtAdminProfile: vi.fn(),
  },
}));

import { supabase } from "@/lib/supabaseClient";
import { authService } from "../authService";

describe("AuthService logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully logout and notify listeners when remote signOut succeeds", async () => {
    if (supabase) {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as unknown as ReturnType<typeof supabase.auth.signOut>);
    }

    const listener = vi.fn();
    authService.subscribe(listener);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await authService.logout();

    if (supabase) {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    }
    expect(authService.getCurrentUser()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(listener).toHaveBeenCalledWith(null);
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should handle remote logout failure gracefully by clearing local state and notifying listeners", async () => {
    const logoutError = new Error("Network error during signOut");
    if (supabase) {
      vi.mocked(supabase.auth.signOut).mockRejectedValue(logoutError);
    }

    const listener = vi.fn();
    authService.subscribe(listener);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await authService.logout();

    if (supabase) {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith("Logout error:", logoutError);
    expect(authService.getCurrentUser()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(listener).toHaveBeenCalledWith(null);

    consoleErrorSpy.mockRestore();
  });

  it("should clear state and notify listeners when supabase signOut throws", async () => {
    const originalSignOut = supabase?.auth.signOut;

    if (supabase) {
      vi.mocked(supabase.auth.signOut).mockImplementationOnce(() => {
        throw new Error("Supabase unavailable");
      });
    }

    const listener = vi.fn();
    authService.subscribe(listener);

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await authService.logout();

    expect(authService.getCurrentUser()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("forensicLedgerUser");
    expect(listener).toHaveBeenCalledWith(null);

    consoleErrorSpy.mockRestore();
    if (supabase && originalSignOut) {
      vi.mocked(supabase.auth.signOut).mockImplementation(originalSignOut);
    }
  });
});

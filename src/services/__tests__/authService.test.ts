// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService, AuthUser } from "../authService";
import { roleManagementService } from "@/services/roleManagementService";
import { Role } from "@/services/web3Service";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: null,
}));

vi.mock("@/services/roleManagementService", () => ({
  roleManagementService: {
    getRoleForWallet: vi.fn(),
  },
}));

vi.mock("@/services/web3Service", () => ({
  default: {
    getUserRole: vi.fn(),
    isContractOwner: vi.fn(),
    initializeAdminRole: vi.fn(),
  },
  Role: {
    None: 0,
    Court: 1,
    Officer: 2,
    Forensic: 3,
    Lawyer: 4,
  },
}));

describe("authService", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    // Reset authService instance state by logging out / clearing auth state
    await authService.logout();
  });

  describe("initializeFromStorage error handling for wallet role verification", () => {
    it("should warn and use cached user data when roleManagementService.getRoleForWallet fails with a network error", async () => {
      const cachedWalletUser: AuthUser = {
        id: "wallet-0x1234567890123456789012345678901234567890",
        email: "0x1234567890123456789012345678901234567890@wallet.local",
        name: "Officer (0x1234...7890)",
        role: Role.Officer,
        roleTitle: "Law Enforcement Officer",
        address: "0x1234567890123456789012345678901234567890",
        authType: "wallet",
      };

      localStorage.setItem(
        "forensicLedgerUser",
        JSON.stringify(cachedWalletUser),
      );

      const networkError = new Error("Network connection error");
      vi.mocked(roleManagementService.getRoleForWallet).mockRejectedValueOnce(
        networkError,
      );

      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const result = await authService.initializeFromStorage();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Could not verify wallet role, using cached data:",
        networkError,
      );

      expect(result).toEqual(cachedWalletUser);
      expect(authService.getCurrentUser()).toEqual(cachedWalletUser);
    });
  });
});

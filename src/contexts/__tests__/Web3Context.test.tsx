// @vitest-environment jsdom
import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Web3Provider, useWeb3 } from "../Web3Context";
import web3Service, { Role } from "@/services/web3Service";
import { roleManagementService } from "@/services/roleManagementService";

// Mock dependent services
vi.mock("@/services/web3Service", () => {
  return {
    default: {
      getUserRole: vi.fn(),
      getRoleString: vi.fn((role: Role) => Role[role] || "None"),
      isContractOwner: vi.fn(),
      initializeAdminRole: vi.fn(),
      syncUserRole: vi.fn(),
      testContractConnection: vi.fn(),
      getCurrentAccount: vi.fn(),
      connectWallet: vi.fn(),
    },
    Role: {
      None: 0,
      Officer: 1,
      Forensic: 2,
      Lawyer: 3,
      Court: 4,
      Admin: 5,
    },
  };
});

vi.mock("@/services/roleManagementService", () => {
  return {
    roleManagementService: {
      getRoleForWallet: vi.fn(),
    },
  };
});

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("Web3Context - refreshRole database sync error handling", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const mockAccount = "0x1234567890123456789012345678901234567890";

  const renderAndRefreshWeb3Hook = async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Web3Provider>{children}</Web3Provider>
    );

    const hookResult = renderHook(() => useWeb3(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await hookResult.result.current.refreshRole();
    });

    return hookResult.result;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    Object.defineProperty(window, "ethereum", {
      value: {
        request: vi.fn().mockImplementation(async ({ method }: { method: string }) => {
          if (method === "eth_chainId") return "0xaa36a7";
          return null;
        }),
        on: vi.fn(),
        removeAllListeners: vi.fn(),
      },
      writable: true,
      configurable: true,
    });

    vi.mocked(web3Service.testContractConnection).mockResolvedValue(true);
    vi.mocked(web3Service.getCurrentAccount).mockResolvedValue(mockAccount);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should catch and log error when roleManagementService.getRoleForWallet fails during secondary sync in refreshRole", async () => {
    const dbError = new Error("Database connection error");

    vi.mocked(web3Service.getUserRole).mockResolvedValue(Role.Officer);
    vi.mocked(roleManagementService.getRoleForWallet).mockRejectedValue(dbError);

    const contextVal = await renderAndRefreshWeb3Hook();

    expect(contextVal.current.userRole).toBe(Role.Officer);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Web3Context: Error checking database role for sync:",
      dbError
    );
  });

  it("should catch and log error when checking primary database role when blockchain role is None", async () => {
    const dbError = new Error("Database error during primary check");

    vi.mocked(web3Service.getUserRole).mockResolvedValue(Role.None);
    vi.mocked(web3Service.isContractOwner).mockResolvedValue(false);
    vi.mocked(roleManagementService.getRoleForWallet).mockRejectedValue(dbError);

    const contextVal = await renderAndRefreshWeb3Hook();

    expect(contextVal.current.userRole).toBe(Role.None);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Web3Context: Error checking database role:",
      dbError
    );
  });
});

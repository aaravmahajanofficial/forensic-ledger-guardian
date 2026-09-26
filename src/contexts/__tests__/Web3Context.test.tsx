// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { Web3Provider, useWeb3 } from "../Web3Context";
import web3Service, { Role } from "@/services/web3Service";

vi.mock("@/services/web3Service", async () => {
  const actual = await vi.importActual<typeof import("@/services/web3Service")>(
    "@/services/web3Service"
  );
  return {
    ...actual,
    default: {
      getUserRole: vi.fn(),
      isContractOwner: vi.fn(),
      initializeAdminRole: vi.fn(),
      getRoleString: actual.default.getRoleString,
      testContractConnection: vi.fn().mockResolvedValue(false),
      getCurrentAccount: vi.fn().mockResolvedValue(null),
    },
  };
});

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

const TestComponent = () => {
  const { userRole, account } = useWeb3();
  return (
    <div>
      <span data-testid="account">{account || "none"}</span>
      <span data-testid="role">{userRole}</span>
    </div>
  );
};

describe("Web3Context performance optimization", () => {
  let accountsChangedCallback: (accounts: string[]) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    (window as unknown as { ethereum?: unknown }).ethereum = {
      isMetaMask: true,
      request: vi.fn().mockImplementation(async ({ method }) => {
        if (method === "eth_chainId") return "0xaa36a7";
        return null;
      }),
      on: vi.fn().mockImplementation((event, cb) => {
        if (event === "accountsChanged") {
          accountsChangedCallback = cb;
        }
      }),
      removeAllListeners: vi.fn(),
    };
  });

  it("sets Role.Court directly without redundant getUserRole call when initializeAdminRole succeeds during account change", async () => {
    vi.mocked(web3Service.getUserRole).mockResolvedValueOnce(Role.None);
    vi.mocked(web3Service.isContractOwner).mockResolvedValueOnce(true);
    vi.mocked(web3Service.initializeAdminRole).mockResolvedValueOnce(true);

    const { getByTestId } = render(
      <Web3Provider>
        <TestComponent />
      </Web3Provider>
    );

    // Trigger account change
    await act(async () => {
      accountsChangedCallback(["0x456"]);
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    await waitFor(() => {
      expect(getByTestId("account").textContent).toBe("0x456");
      expect(getByTestId("role").textContent).toBe(String(Role.Court));
    });

    // getUserRole is called only once now (initial check), eliminated second network call
    expect(web3Service.getUserRole).toHaveBeenCalledTimes(1);
    expect(web3Service.initializeAdminRole).toHaveBeenCalledTimes(1);
  });
});

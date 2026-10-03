// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService, AuthUser } from "../authService";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock("@/services/roleManagementService", () => ({
  roleManagementService: {
    getRoleForWallet: vi.fn(),
    assignWalletToRole: vi.fn(),
    createCourtAdminProfile: vi.fn(),
  },
}));

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

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("authService listener notifications", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should catch errors thrown by a listener and safely continue notifying other listeners", async () => {
    const errorListener = vi.fn().mockImplementation(() => {
      throw new Error("Listener throwing error");
    });
    const normalListener = vi.fn();

    const unsubscribeError = authService.subscribe(errorListener);
    const unsubscribeNormal = authService.subscribe(normalListener);

    try {
      await authService.logout();

      expect(errorListener).toHaveBeenCalledWith(null);
      expect(normalListener).toHaveBeenCalledWith(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in auth listener:",
        expect.any(Error),
      );
    } finally {
      unsubscribeError();
      unsubscribeNormal();
    }
  });

  it("should allow subscribing and unsubscribing listeners correctly", async () => {
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);

    await authService.logout();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();

    await authService.logout();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

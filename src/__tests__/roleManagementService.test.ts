import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSupabase } = vi.hoisted(() => {
  return {
    mockSupabase: {
      from: vi.fn(),
    },
  };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: mockSupabase,
}));

import { roleManagementService } from "@/services/roleManagementService";

describe("roleManagementService - isWalletAssigned", () => {
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return false if supabase client is null", async () => {
    const mockModule = await import("@/lib/supabaseClient");
    const originalSupabase = mockModule.supabase;
    // @ts-expect-error Mocking supabase as null for testing early return
    mockModule.supabase = null;

    const result = await roleManagementService.isWalletAssigned(validAddress);
    expect(result).toBe(false);

    // Restore
    // @ts-expect-error Restoring mocked supabase
    mockModule.supabase = originalSupabase;
  });

  it("should return false if wallet address format is invalid", async () => {
    const invalidAddress = "0xinvalid";
    const result = await roleManagementService.isWalletAssigned(invalidAddress);
    expect(result).toBe(false);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should return false when supabase query returns an error", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database query failed", code: "500" },
    });
    const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 });

    mockSupabase.from.mockReturnValue({ select: selectMock });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
    expect(mockSupabase.from).toHaveBeenCalledWith("role_assignments");
    expect(selectMock).toHaveBeenCalledWith("address");
    expect(eqMock1).toHaveBeenCalledWith("address", validAddress.toLowerCase());
    expect(eqMock2).toHaveBeenCalledWith("is_active", true);
  });

  it("should return false when wallet is not assigned (data is null)", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 });

    mockSupabase.from.mockReturnValue({ select: selectMock });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
  });

  it("should return true when wallet is assigned (data returned)", async () => {
    const uppercaseAddress = "0x1234567890123456789012345678901234567890".toUpperCase().replace("0X", "0x");
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: { address: validAddress.toLowerCase() },
      error: null,
    });
    const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 });

    mockSupabase.from.mockReturnValue({ select: selectMock });

    const result = await roleManagementService.isWalletAssigned(uppercaseAddress);

    expect(result).toBe(true);
    expect(eqMock1).toHaveBeenCalledWith("address", validAddress.toLowerCase());
  });

  it("should return false when an unexpected error occurs in query chain", async () => {
    mockSupabase.from.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
  });
});

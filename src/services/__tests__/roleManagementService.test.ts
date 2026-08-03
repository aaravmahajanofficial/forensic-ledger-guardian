import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { roleManagementService } from '@/services/roleManagementService';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('roleManagementService.isWalletAssigned', () => {
  const validAddress = '0x1234567890123456789012345678901234567890';
  const invalidAddress = '0xinvalid';

  let mockMaybeSingle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockMaybeSingle = vi.fn();
    const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

    // @ts-expect-error - Mocking Supabase client
    supabase.from.mockReturnValue({ select: mockSelect });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when wallet is assigned', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { address: validAddress }, error: null });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('role_assignments');
  });

  it('returns false when wallet is not assigned', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
  });

  it('returns false when wallet address is invalid', async () => {
    const result = await roleManagementService.isWalletAssigned(invalidAddress);

    expect(result).toBe(false);
    expect(console.warn).toHaveBeenCalledWith(
      'Invalid wallet address format:',
      invalidAddress
    );
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('returns false and logs error when Supabase query fails', async () => {
    const errorMsg = { message: 'Database error', code: '500' };
    mockMaybeSingle.mockResolvedValue({ data: null, error: errorMsg });

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Error checking wallet assignment:',
      errorMsg
    );
  });

  it('returns false and logs error when an unexpected exception is thrown', async () => {
    const exception = new Error('Network failure');
    mockMaybeSingle.mockRejectedValue(exception);

    const result = await roleManagementService.isWalletAssigned(validAddress);

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Unexpected error checking wallet assignment:',
      exception
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { roleManagementService } from './roleManagementService';
import { supabase } from '@/lib/supabaseClient';

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('RoleManagementService', () => {
  describe('isWalletAssigned', () => {
    const validAddress = '0x1234567890123456789012345678901234567890';
    const invalidAddress = '0xinvalid';

    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('returns true when a wallet is assigned (database returns data)', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: { address: validAddress.toLowerCase() }, error: null });

      // @ts-expect-error Mocking Supabase from
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        maybeSingle: mockMaybeSingle,
      });

      const result = await roleManagementService.isWalletAssigned(validAddress);

      expect(result).toBe(true);
      // @ts-expect-error Mocking Supabase from
      expect(supabase.from).toHaveBeenCalledWith('role_assignments');
    });

    it('returns false when a wallet is not assigned (database returns null)', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });

      // @ts-expect-error Mocking Supabase from
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        maybeSingle: mockMaybeSingle,
      });

      const result = await roleManagementService.isWalletAssigned(validAddress);

      expect(result).toBe(false);
    });

    it('returns false and logs an error when Supabase returns an error', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockError = new Error('Database error');
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });

      // @ts-expect-error Mocking Supabase from
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        maybeSingle: mockMaybeSingle,
      });

      const result = await roleManagementService.isWalletAssigned(validAddress);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Error checking wallet assignment:', mockError);
    });

    it('returns false and logs an error when an unexpected exception is thrown', async () => {
      const mockError = new Error('Unexpected exception');

      // @ts-expect-error Mocking Supabase from
      supabase.from.mockImplementation(() => {
        throw mockError;
      });

      const result = await roleManagementService.isWalletAssigned(validAddress);

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Unexpected error checking wallet assignment:', mockError);
    });

    it('returns false and logs a warning for invalid wallet addresses', async () => {
      const result = await roleManagementService.isWalletAssigned(invalidAddress);

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('Invalid wallet address format:', invalidAddress);
      // @ts-expect-error Mocking Supabase from
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });
});

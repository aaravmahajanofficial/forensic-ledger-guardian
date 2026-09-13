import { describe, it, expect, vi, beforeEach } from 'vitest';
import { roleManagementService } from './roleManagementService';
import { Role } from './web3Service';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('RoleManagementService', () => {
  const validAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('getRoleForWallet', () => {
    it('should return Role.None for invalid wallet address', async () => {
      const role = await roleManagementService.getRoleForWallet('invalid-address');
      expect(role).toBe(Role.None);
    });

    it('should handle Supabase error during retrieval', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Supabase error' }
      });
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      (supabase?.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const role = await roleManagementService.getRoleForWallet(validAddress);
      expect(role).toBe(Role.None);
      expect(console.error).toHaveBeenCalledWith('Error getting role for wallet:', { message: 'Supabase error' });
    });

    it('should handle missing data gracefully', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null
      });
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      (supabase?.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const role = await roleManagementService.getRoleForWallet(validAddress);
      expect(role).toBe(Role.None);
    });

    it('should handle successful role retrieval', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { role: Role.Lawyer },
        error: null
      });
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      (supabase?.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const role = await roleManagementService.getRoleForWallet(validAddress);
      expect(role).toBe(Role.Lawyer);
    });

    it('should handle unexpected exceptions thrown during query', async () => {
      const mockMaybeSingle = vi.fn().mockRejectedValue(new Error('Unexpected Network Error'));
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });

      (supabase?.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: mockSelect,
      });

      const role = await roleManagementService.getRoleForWallet(validAddress);
      expect(role).toBe(Role.None);
      expect(console.error).toHaveBeenCalledWith('Unexpected error getting role for wallet:', expect.any(Error));
    });
  });
});

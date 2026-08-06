// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { useEvidenceManager } from '../useEvidenceManager';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/services/ipfsService', () => ({
  default: {
    uploadFile: vi.fn(),
  }
}));

vi.mock('@/services/web3Service', () => ({
  default: {},
  EvidenceType: {}
}));

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } })
    }
  }
}));

describe('useEvidenceManager', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('evidence activity localStorage parsing', () => {
    it('should successfully parse valid JSON and set recent activity', () => {
      const validActivity = [
        { action: 'upload', evidenceId: 'EV-123', timestamp: '2023-01-01T00:00:00.000Z' }
      ];
      localStorage.setItem('evidenceActivity', JSON.stringify(validActivity));

      const { result } = renderHook(() => useEvidenceManager());

      expect(result.current.recentActivity).toEqual(validActivity);
    });

    it('should handle invalid JSON from localStorage gracefully and log error', () => {
      localStorage.setItem('evidenceActivity', 'invalid json data {[');

      const consoleErrorSpy = vi.spyOn(console, 'error');

      const { result } = renderHook(() => useEvidenceManager());

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to parse activity:",
        expect.any(SyntaxError)
      );
      expect(result.current.recentActivity).toEqual([]);
    });

    it('should track new activity and save to localStorage', async () => {
      const { result } = renderHook(() => useEvidenceManager());

      act(() => {
        result.current.viewEvidence('EV-TEST-1');
      });

      expect(result.current.recentActivity).toHaveLength(1);
      expect(result.current.recentActivity[0].action).toBe('view');
      expect(result.current.recentActivity[0].evidenceId).toBe('EV-TEST-1');

      const stored = localStorage.getItem('evidenceActivity');
      expect(stored).toBeTruthy();
      const parsedStored = JSON.parse(stored!);
      expect(parsedStored).toHaveLength(1);
      expect(parsedStored[0].action).toBe('view');
      expect(parsedStored[0].evidenceId).toBe('EV-TEST-1');
    });
  });
});

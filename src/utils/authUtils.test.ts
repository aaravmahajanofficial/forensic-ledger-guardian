// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('clearAllAuthData', () => {
    it('should remove authentication and wallet data from localStorage and sessionStorage', () => {
      const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');

      clearAllAuthData();

      expect(localStorageSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorageSpy).toHaveBeenCalledWith('walletconnect');
      expect(localStorageSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(localStorageSpy).toHaveBeenCalledTimes(4); // 3 for localStorage + 1 for sessionStorage
    });
  });

  describe('forceAuthReset', () => {
    it('should clear auth data and reload window location', () => {
      const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');
      const reloadSpy = vi.fn();

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...window.location,
          reload: reloadSpy,
        },
      });

      forceAuthReset();

      expect(localStorageSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorageSpy).toHaveBeenCalledWith('walletconnect');
      expect(localStorageSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });
});

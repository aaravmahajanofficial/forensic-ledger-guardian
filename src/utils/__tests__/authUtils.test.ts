// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from '../authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('clearAllAuthData', () => {
    it('should remove forensicLedgerUser and walletconnect keys from localStorage and sessionStorage', () => {
      const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');

      localStorage.setItem('forensicLedgerUser', 'user_data');
      sessionStorage.setItem('forensicLedgerUser', 'session_data');
      localStorage.setItem('walletconnect', 'wc_data');
      localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'choice_data');

      clearAllAuthData();

      expect(localStorageSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorageSpy).toHaveBeenCalledWith('walletconnect');
      expect(localStorageSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');

      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();
    });
  });

  describe('forceAuthReset', () => {
    it('should clear all auth data and reload the window', () => {
      const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');
      const reloadSpy = vi.fn();

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...window.location,
          reload: reloadSpy,
        },
      });

      localStorage.setItem('forensicLedgerUser', 'user_data');

      forceAuthReset();

      expect(localStorageSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });
});

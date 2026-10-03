// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('clearAllAuthData', () => {
    it('should remove forensicLedgerUser, walletconnect, and WALLETCONNECT_DEEPLINK_CHOICE from localStorage and sessionStorage', () => {
      const localRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      localStorage.setItem('forensicLedgerUser', 'user_data');
      localStorage.setItem('walletconnect', 'wc_data');
      localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'choice_data');
      sessionStorage.setItem('forensicLedgerUser', 'session_user_data');

      clearAllAuthData();

      expect(localRemoveItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('walletconnect');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');

      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();
      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();
    });
  });

  describe('forceAuthReset', () => {
    it('should clear all auth data and trigger location reload', () => {
      const localRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { ...window.location, reload: reloadMock },
        writable: true,
        configurable: true,
      });

      localStorage.setItem('forensicLedgerUser', 'user_data');

      forceAuthReset();

      expect(localRemoveItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });
});

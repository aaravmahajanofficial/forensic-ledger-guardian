// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    originalLocation = window.location;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  describe('clearAllAuthData', () => {
    it('should remove authentication and wallet data from localStorage and sessionStorage', () => {
      const localStorageRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      clearAllAuthData();

      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('walletconnect');
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      // In jsdom, localStorage and sessionStorage both use Storage.prototype.
      // So the spy catches calls to both. Since 'forensicLedgerUser' is called for both,
      // it should be called at least once (actually twice).
      expect(localStorageRemoveItemSpy.mock.calls.some(call => call[0] === 'forensicLedgerUser')).toBe(true);
    });

    it('should correctly remove items from specific storage', () => {
      // Setup actual items
      localStorage.setItem('forensicLedgerUser', 'local-user');
      sessionStorage.setItem('forensicLedgerUser', 'session-user');
      localStorage.setItem('walletconnect', 'wallet-data');
      localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'choice');
      localStorage.setItem('otherItem', 'keep-me');

      clearAllAuthData();

      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();
      expect(localStorage.getItem('otherItem')).toBe('keep-me');
    });
  });

  describe('forceAuthReset', () => {
    it('should clear all auth data and reload the page', () => {
      const mockReload = vi.fn();

      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          reload: mockReload,
        },
        writable: true,
      });

      localStorage.setItem('forensicLedgerUser', 'local-user');

      forceAuthReset();

      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(mockReload).toHaveBeenCalled();
    });
  });
});

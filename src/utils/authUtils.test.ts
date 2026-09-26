// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('clearAllAuthData', () => {
    it('should call removeItem on localStorage and sessionStorage for required keys', () => {
      const localRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      clearAllAuthData();

      expect(localRemoveItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('walletconnect');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
    });

    it('should actually clear auth and wallet data stored in localStorage and sessionStorage', () => {
      localStorage.setItem('forensicLedgerUser', 'user_data');
      localStorage.setItem('walletconnect', 'wc_data');
      localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'wc_choice');
      localStorage.setItem('otherKey', 'keep_me');

      sessionStorage.setItem('forensicLedgerUser', 'session_user');
      sessionStorage.setItem('otherSessionKey', 'keep_me_too');

      clearAllAuthData();

      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();
      expect(localStorage.getItem('otherKey')).toBe('keep_me');

      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(sessionStorage.getItem('otherSessionKey')).toBe('keep_me_too');
    });
  });

  describe('forceAuthReset', () => {
    it('should clear all auth data and reload the page', () => {
      const localRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      const originalLocation = window.location;
      const reloadMock = vi.fn();

      // Replace window.location to mock reload
      delete (window as unknown as { location?: unknown }).location;
      window.location = { ...originalLocation, reload: reloadMock } as unknown as Location;

      forceAuthReset();

      expect(localRemoveItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('walletconnect');
      expect(localRemoveItemSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(reloadMock).toHaveBeenCalledTimes(1);

      // Restore original window.location
      window.location = originalLocation;
    });
  });
});

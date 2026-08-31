// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  let originalLocation: Location;

  beforeEach(() => {
    // Mock localStorage and sessionStorage
    vi.spyOn(Storage.prototype, 'removeItem');
    vi.spyOn(Storage.prototype, 'clear');

    // Mock window.location.reload
    originalLocation = window.location;
    // @ts-expect-error - overriding window.location for testing
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.location = originalLocation;
  });

  describe('clearAllAuthData', () => {
    it('should clear user and wallet data from storage', () => {
      clearAllAuthData();

      expect(localStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorage.removeItem).toHaveBeenCalledWith('walletconnect');
      expect(localStorage.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
    });
  });

  describe('forceAuthReset', () => {
    it('should clear auth data and reload the page', () => {
      forceAuthReset();

      expect(localStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});

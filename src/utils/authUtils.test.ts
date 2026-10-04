// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clearAllAuthData, forceAuthReset } from './authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    // Mock Storage.prototype.removeItem instead of instance
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('clearAllAuthData', () => {
    it('should remove the correct keys from localStorage and sessionStorage', () => {
      clearAllAuthData();

      // In JSDOM, both localStorage and sessionStorage inherit from Storage.
      // Because we spy on Storage.prototype.removeItem, calling it on EITHER
      // localStorage OR sessionStorage will count towards the same spy instance.
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('walletconnect');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(Storage.prototype.removeItem).toHaveBeenCalledTimes(4); // 3 for local + 1 for session
    });
  });

  describe('forceAuthReset', () => {
    it('should call clearAllAuthData and window.location.reload', () => {
      forceAuthReset();

      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('walletconnect');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(Storage.prototype.removeItem).toHaveBeenCalledTimes(4);

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { forceRoleRefresh, clearAuthenticationState } from './roleUtils';

describe('roleUtils', () => {
  beforeEach(() => {
    // Populate localStorage and sessionStorage with test data
    localStorage.setItem('forensicLedgerUser', 'test-user-data');
    sessionStorage.setItem('forensicLedgerUser', 'test-user-data-session');
    localStorage.setItem('walletconnect', 'test-wallet-data');
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'test-choice');

    // Spy on window.dispatchEvent
    vi.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    // Clean up
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('forceRoleRefresh', () => {
    it('should clear authentication state and dispatch forceRoleRefresh event', async () => {
      await forceRoleRefresh();

      // Check if localStorage items were removed
      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();

      // Check if sessionStorage items were removed
      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();

      // Check if event was dispatched
      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);

      const dispatchedEvent = vi.mocked(window.dispatchEvent).mock.calls[0][0] as CustomEvent;
      expect(dispatchedEvent.type).toBe('forceRoleRefresh');
    });
  });

  describe('clearAuthenticationState', () => {
    it('should clear authentication state', () => {
      clearAuthenticationState();

      // Check if localStorage items were removed
      expect(localStorage.getItem('forensicLedgerUser')).toBeNull();
      expect(localStorage.getItem('walletconnect')).toBeNull();
      expect(localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')).toBeNull();

      // Check if sessionStorage items were removed
      expect(sessionStorage.getItem('forensicLedgerUser')).toBeNull();

      // Check that event was NOT dispatched
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });
  });
});

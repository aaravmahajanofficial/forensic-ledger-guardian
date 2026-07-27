import { describe, it, expect, beforeEach, vi } from 'vitest';
// @vitest-environment jsdom
import { forceRoleRefresh, clearAuthenticationState } from './roleUtils';

describe('roleUtils', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();

    // Set up storage mocks
    const localStorageMock = {
      removeItem: vi.fn(),
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    const sessionStorageMock = {
      removeItem: vi.fn(),
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });

    // Set up window.dispatchEvent mock
    vi.spyOn(window, 'dispatchEvent');
  });

  describe('forceRoleRefresh', () => {
    it('should clear specific keys from localStorage and sessionStorage and dispatch forceRoleRefresh event', async () => {
      await forceRoleRefresh();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('walletconnect');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');

      expect(window.dispatchEvent).toHaveBeenCalledTimes(1);

      const eventArg = vi.mocked(window.dispatchEvent).mock.calls[0][0] as CustomEvent;
      expect(eventArg).toBeInstanceOf(Event); // CustomEvent might be tricky in some envs depending on setup, but it's an Event
      expect(eventArg.type).toBe('forceRoleRefresh');
    });
  });

  describe('clearAuthenticationState', () => {
    it('should clear specific keys from localStorage and sessionStorage', () => {
      clearAuthenticationState();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('walletconnect');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');

      // Should not dispatch any events
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });
  });
});

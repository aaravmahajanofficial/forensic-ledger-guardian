import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clearAuthenticationState } from './roleUtils';

describe('clearAuthenticationState', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should remove forensicLedgerUser from localStorage and sessionStorage', () => {
    clearAuthenticationState();

    expect(localStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('forensicLedgerUser');
  });

  it('should remove walletconnect and WALLETCONNECT_DEEPLINK_CHOICE from localStorage', () => {
    clearAuthenticationState();

    expect(localStorage.removeItem).toHaveBeenCalledWith('walletconnect');
    expect(localStorage.removeItem).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
  });
});

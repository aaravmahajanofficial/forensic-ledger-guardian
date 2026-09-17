// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { forceRoleRefresh } from './roleUtils';

describe('roleUtils', () => {
  describe('forceRoleRefresh', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should remove authentication and wallet data from storage and dispatch a custom event', async () => {
      const localStorageSpy = vi.spyOn(Storage.prototype, 'removeItem');
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      await forceRoleRefresh();

      expect(localStorageSpy).toHaveBeenCalledWith('forensicLedgerUser');
      expect(localStorageSpy).toHaveBeenCalledWith('walletconnect');
      expect(localStorageSpy).toHaveBeenCalledWith('WALLETCONNECT_DEEPLINK_CHOICE');
      expect(localStorageSpy).toHaveBeenCalledTimes(4); // 3 calls for localStorage, 1 call for sessionStorage

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('forceRoleRefresh');
      expect(event instanceof CustomEvent).toBe(true);
    });

    it('should clear specific item from sessionStorage', async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      await forceRoleRefresh();

      expect(removeItemSpy).toHaveBeenCalledWith('forensicLedgerUser');
    });

    it('should dispatch forceRoleRefresh custom event on window', async () => {
      let eventFired = false;
      let eventType = '';

      const handleEvent = (e: Event) => {
        eventFired = true;
        eventType = e.type;
      };

      window.addEventListener('forceRoleRefresh', handleEvent);
      await forceRoleRefresh();
      window.removeEventListener('forceRoleRefresh', handleEvent);

      expect(eventFired).toBe(true);
      expect(eventType).toBe('forceRoleRefresh');
    });
  });
});

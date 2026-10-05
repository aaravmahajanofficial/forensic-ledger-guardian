// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import authService from "../authService";
import { supabase } from "@/lib/supabaseClient";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe("authService - logout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should clear local auth state and notify listeners when remote signOut succeeds", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);

    await authService.logout();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledWith("forensicLedgerUser");
    expect(authService.getCurrentUser()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });

  it("should clear local auth state and notify listeners when remote signOut fails/throws an error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(supabase.auth.signOut).mockRejectedValue(new Error("Network connection error"));

    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const listener = vi.fn();
    const unsubscribe = authService.subscribe(listener);

    await authService.logout();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Logout error:",
      expect.any(Error)
    );
    expect(removeItemSpy).toHaveBeenCalledWith("forensicLedgerUser");
    expect(authService.getCurrentUser()).toBeNull();
    expect(listener).toHaveBeenCalledWith(null);

    unsubscribe();
  });
});

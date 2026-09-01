// authUtils.ts
// Utility functions for authentication management

/**
 * Clears all authentication-related data from localStorage and session storage
 */
export const clearAllAuthData = (): void => {
  localStorage.removeItem("forensicLedgerUser");
  sessionStorage.removeItem("forensicLedgerUser");

  // Clear any wallet connection data if needed
  localStorage.removeItem("walletconnect");
  localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
};

/**
 * Checks if the current user is a development user - DISABLED FOR PRODUCTION
 */
export const isDevUser = (
  user: { id?: string; email?: string } | null,
): boolean => {
  // Always return false for production - no dev users allowed
  return false;
};

/**
 * Forces a complete authentication reset
 */
export const forceAuthReset = (): void => {
  clearAllAuthData();

  // Force page reload to reset all state
  window.location.reload();
};

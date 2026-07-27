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
 * Forces a complete authentication reset
 */
export const forceAuthReset = (): void => {
  clearAllAuthData();

  // Force page reload to reset all state
  window.location.reload();
};

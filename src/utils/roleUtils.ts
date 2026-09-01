// roleUtils.ts
// Utility functions for role management and refreshing

/**
 * Force refresh all authentication and role state
 * Useful when switching between authentication methods
 */
export const forceRoleRefresh = async (): Promise<void> => {
  // Clear any cached authentication data
  localStorage.removeItem("forensicLedgerUser");
  sessionStorage.removeItem("forensicLedgerUser");

  // Clear wallet connection data that might interfere
  localStorage.removeItem("walletconnect");
  localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");

  // Dispatch a custom event to notify components to refresh
  window.dispatchEvent(new CustomEvent("forceRoleRefresh"));
};

/**
 * Clear all authentication state for clean logout
 */
export const clearAuthenticationState = (): void => {
  localStorage.removeItem("forensicLedgerUser");
  sessionStorage.removeItem("forensicLedgerUser");
  localStorage.removeItem("walletconnect");
  localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
};

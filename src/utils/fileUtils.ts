// Generate a unique evidence ID based on case and timestamp
export const generateEvidenceId = (caseId: string): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `EV-${caseId}-${timestamp}-${randomPart}`;
};

// Shorten blockchain address for display
export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format blockchain timestamp (seconds) to locale string
export const formatBlockchainDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

import { EvidenceType } from "@/services/web3Service";

// Determine evidence type from file MIME type
export const getEvidenceTypeFromFile = (file: File): EvidenceType => {
  const mimeType = file.type.toLowerCase();

  if (mimeType.startsWith("image/")) {
    return EvidenceType.Image;
  } else if (mimeType.startsWith("video/")) {
    return EvidenceType.Video;
  } else if (
    mimeType === "application/pdf" ||
    mimeType === "text/plain" ||
    mimeType === "application/msword" ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet")
  ) {
    return EvidenceType.Document;
  }

  return EvidenceType.Other;
};

// Generate a unique evidence ID based on case and timestamp
export const generateEvidenceId = (caseId: string): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `EV-${caseId}-${timestamp}-${randomPart}`;
};

// Format date from blockchain timestamp
export const formatBlockchainDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Shorten blockchain address for display
export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

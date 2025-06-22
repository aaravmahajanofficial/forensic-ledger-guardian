/**
 * Utilities for file handling, evidence processing, and blockchain data formatting
 *
 * @module Utils/FileUtils
 */

import { EVIDENCE_TYPES } from "@/constants";
import { logError } from "./logger";

/**
 * Evidence type classification based on file types
 */
export type EvidenceType = (typeof EVIDENCE_TYPES)[keyof typeof EVIDENCE_TYPES];

/**
 * MIME type mapping for evidence classification
 */
const MIME_TYPE_MAPPINGS: Record<string, EvidenceType> = {
  // Image types
  "image/": EVIDENCE_TYPES.IMAGE,

  // Video types
  "video/": EVIDENCE_TYPES.VIDEO,

  // Document types
  "application/pdf": EVIDENCE_TYPES.DOCUMENT,
  "text/plain": EVIDENCE_TYPES.DOCUMENT,
  "application/msword": EVIDENCE_TYPES.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    EVIDENCE_TYPES.DOCUMENT,
  "application/vnd.ms-excel": EVIDENCE_TYPES.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    EVIDENCE_TYPES.DOCUMENT,
};

/**
 * Determines evidence type from a file's MIME type
 *
 * @param file - The file to analyze
 * @returns The classified evidence type
 */
export const getEvidenceTypeFromFile = (file: File): EvidenceType => {
  try {
    if (!file || !file.type) {
      return EVIDENCE_TYPES.OTHER;
    }

    const mimeType = file.type.toLowerCase();

    // Check for prefix matches (image/, video/)
    for (const [prefix, type] of Object.entries(MIME_TYPE_MAPPINGS)) {
      if (prefix.endsWith("/") && mimeType.startsWith(prefix)) {
        return type;
      }
    }

    // Check for exact matches
    if (MIME_TYPE_MAPPINGS[mimeType]) {
      return MIME_TYPE_MAPPINGS[mimeType];
    }

    // Check for partial matches
    if (mimeType.includes("document") || mimeType.includes("spreadsheet")) {
      return EVIDENCE_TYPES.DOCUMENT;
    }

    return EVIDENCE_TYPES.OTHER;
  } catch (error) {
    logError(
      "Failed to determine evidence type",
      { fileType: file.type },
      error instanceof Error ? error : new Error(String(error))
    );
    return EVIDENCE_TYPES.OTHER;
  }
};

/**
 * Generates a unique, tamper-evident evidence ID
 *
 * @param caseId - The case identifier
 * @returns A unique evidence identifier
 */
export const generateEvidenceId = (caseId: string): string => {
  if (!caseId) {
    throw new Error("Case ID is required to generate an evidence ID");
  }

  const timestamp = Date.now();
  // Use crypto API for better randomness when available
  let randomPart: string;

  try {
    const array = new Uint8Array(4);
    crypto.getRandomValues(array);
    randomPart = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  } catch {
    // Fallback to Math.random if crypto API is not available
    randomPart = Math.random().toString(36).substring(2, 8);
  }

  return `EV-${caseId}-${timestamp}-${randomPart}`;
};

/**
 * Formats a blockchain timestamp to a human-readable date string
 *
 * @param timestamp - The blockchain timestamp (in seconds)
 * @returns Formatted date string
 */
export const formatBlockchainDate = (timestamp: number): string => {
  if (!timestamp) {
    return "Unknown date";
  }

  try {
    // Convert from seconds to milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    logError(
      "Failed to format blockchain date",
      { timestamp },
      error instanceof Error ? error : new Error(String(error))
    );
    return "Invalid date";
  }
};

/**
 * Shortens a blockchain address for display purposes
 *
 * @param address - The full blockchain address
 * @returns Shortened address with format "0x1234...5678"
 */
export const shortenAddress = (address: string): string => {
  if (!address) return "";

  try {
    // Ensure the address is at least 11 characters long (0x + 4 + ... + 4)
    if (address.length < 11) {
      return address;
    }

    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  } catch (error) {
    logError(
      "Failed to shorten address",
      { address },
      error instanceof Error ? error : new Error(String(error))
    );
    return address || "";
  }
};

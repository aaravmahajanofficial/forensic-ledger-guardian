/**
 * Global TypeScript type definitions
 * Core types used throughout the application
 *
 * @module Types
 */

import {
  RoleType,
  CaseStatus,
  CasePriority,
  EvidenceType,
  EvidenceStatus,
  Permission,
} from "@/constants";
import { EthereumAddress } from "./blockchain";

// ======================================================
// Authentication & User Types
// ======================================================

/**
 * User model represents an authenticated user
 */
export interface User {
  roleTitle: string;
  /** Unique identifier for the user */
  id: string;

  /** User's full name */
  name: string;

  /** User's email address */
  email: string;

  /** User's assigned role */
  role: RoleType;

  /** User's status */
  status: "active" | "inactive";

  /** Date user was added */
  added: string;

  /** Number of cases assigned to user */
  caseCount: number;

  /** User's Ethereum wallet address (if connected) */
  address?: EthereumAddress;

  /** User permissions */
  permissions?: Permission[];

  /** Account creation date */
  createdAt?: Date;

  /** Last login timestamp */
  lastLoginAt?: Date;

  /** User profile image URL */
  avatarUrl?: string;
}

/**
 * User session information
 */
export interface UserSession {
  /** Session token */
  token: string;

  /** Refresh token for obtaining new access tokens */
  refreshToken?: string;

  /** Session expiration timestamp */
  expiresAt: number;

  /** User information */
  user: User;
}

/**
 * Authentication credentials
 */
export interface LoginCredentials {
  /** User email */
  email: string;

  /** User password */
  password: string;

  /** Whether to persist session */
  rememberMe?: boolean;
}

/**
 * Result of authentication attempt
 */
export interface AuthResult {
  /** Whether authentication was successful */
  success: boolean;

  /** User information if successful */
  user?: User;

  /** Error message if unsuccessful */
  error?: string;
  /** Session token if successful */
  token?: string;

  /** Refresh token if successful */
  refreshToken?: string;

  /** Token expiration timestamp */
  expiresAt?: number;
}

// ======================================================
// Case Management Types
// ======================================================

/**
 * Case model representing a legal case
 */
export interface Case {
  /** Unique identifier for the case */
  id: string;

  /** Case number for reference */
  caseNumber: string;

  /** Case title */
  title: string;

  /** Detailed case description */
  description: string;

  /** Current case status */
  status: CaseStatus;

  /** Case priority level */
  priority: CasePriority;

  /** Case creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Officer who created the case */
  createdBy: User;

  /** Case location information */
  location?: string;

  /** Associated evidence items */
  evidence?: Evidence[];

  /** Assigned investigators */
  assignees?: User[];

  /** Case metadata */
  metadata?: Record<string, unknown>;
}

// ======================================================
// Evidence Types
// ======================================================

/**
 * Evidence model representing a piece of forensic evidence
 */
export interface Evidence {
  /** Unique identifier for the evidence */
  id: string;

  /** Evidence title/name */
  title: string;

  /** Detailed description */
  description: string;

  /** Type of evidence */
  type: EvidenceType;

  /** Current status */
  status: EvidenceStatus;

  /** Associated case ID */
  caseId: string;

  /** IPFS Content Identifier (CID) */
  cid?: string;

  /** File hash for integrity verification */
  hash?: string;

  /** Hash algorithm used (e.g., SHA-256) */
  hashAlgorithm?: string;

  /** File size in bytes */
  size?: number;

  /** MIME type */
  mimeType?: string;

  /** Evidence collection timestamp */
  collectedAt: Date;

  /** User who collected the evidence */
  collectedBy: User;

  /** Evidence upload timestamp */
  uploadedAt: Date;

  /** User who uploaded the evidence */
  uploadedBy: User;

  /** Blockchain transaction hash */
  txHash?: string;

  /** Verification timestamp */
  verifiedAt?: Date;

  /** User who verified the evidence */
  verifiedBy?: User;

  /** Chain of custody events */
  chainOfCustody?: CustodyEvent[];

  /** Evidence metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Chain of custody event
 */
export interface CustodyEvent {
  /** Unique identifier for the event */
  id: string;

  /** Evidence ID */
  evidenceId: string;

  /** User who performed the action */
  actor: User;

  /** Action timestamp */
  timestamp: Date;

  /** Action type */
  action: string;

  /** Action description */
  description: string;

  /** Blockchain transaction hash */
  txHash?: string;

  /** Location where action occurred */
  location?: string;
}

/**
 * Evidence verification result
 */
export interface VerificationResult {
  /** Whether verification was successful */
  success: boolean;

  /** Verification timestamp */
  timestamp: Date;

  /** Messages from verification process */
  messages: string[];

  /** Details about the verification */
  details?: Record<string, unknown>;

  /** Blockchain confirmation info */
  blockchainConfirmation?: {
    txHash: string;
    blockNumber: number;
    timestamp: Date;
  };
}

// ======================================================
// API and Response Types
// ======================================================

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;

  /** Response data */
  data?: T;

  /** Error message if unsuccessful */
  error?: string;

  /** HTTP status code */
  statusCode?: number;

  /** Pagination metadata */
  meta?: {
    /** Current page number */
    page: number;

    /** Items per page */
    limit: number;

    /** Total number of items */
    total: number;

    /** Total number of pages */
    pages: number;
  };
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;

  /** Items per page */
  limit?: number;

  /** Sort field */
  sortBy?: string;

  /** Sort direction */
  sortDirection?: "asc" | "desc";
}

/**
 * Filter parameters for list requests
 */
export interface FilterParams {
  /** Search query */
  query?: string;

  /** Filter by status */
  status?: string | string[];

  /** Filter by date range */
  dateFrom?: Date | string;

  /** Filter by date range */
  dateTo?: Date | string;

  /** Custom filters */
  [key: string]: unknown;
}

// Export additional type modules
export * from "./blockchain";
export * from "./window";

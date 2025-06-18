/**
 * Application Constants
 * Centralized constants for the Forensic Ledger Guardian application
 *
 * @module Constants
 */

// ======================================================
// Role Management
// ======================================================

/**
 * User role identifiers
 * Numeric values represent role hierarchy and access levels
 */
export const ROLES = {
  NONE: 0,
  COURT: 1,
  OFFICER: 2,
  FORENSIC: 3,
  LAWYER: 4,
} as const;

/**
 * Human-readable role names
 */
export const ROLE_NAMES = {
  [ROLES.NONE]: "None",
  [ROLES.COURT]: "Court Administrator",
  [ROLES.OFFICER]: "Police Officer",
  [ROLES.FORENSIC]: "Forensic Expert",
  [ROLES.LAWYER]: "Legal Counsel",
} as const;

/**
 * Role descriptions for documentation and UI
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.NONE]: "No role assigned",
  [ROLES.COURT]: "Case oversight and judicial review",
  [ROLES.OFFICER]: "Evidence collection and case management",
  [ROLES.FORENSIC]: "Technical analysis and verification",
  [ROLES.LAWYER]: "Case preparation and documentation",
} as const;

// ======================================================
// Evidence Management
// ======================================================

/**
 * Types of evidence that can be managed
 */
export const EVIDENCE_TYPES = {
  IMAGE: 0,
  VIDEO: 1,
  DOCUMENT: 2,
  AUDIO: 3,
  OTHER: 4,
} as const;

/**
 * MIME type mappings for evidence types
 */
export const EVIDENCE_TYPE_MIME_PATTERNS = {
  [EVIDENCE_TYPES.IMAGE]: ["image/*"],
  [EVIDENCE_TYPES.VIDEO]: ["video/*"],
  [EVIDENCE_TYPES.DOCUMENT]: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.*",
    "text/plain",
  ],
  [EVIDENCE_TYPES.AUDIO]: ["audio/*"],
  [EVIDENCE_TYPES.OTHER]: ["*/*"],
} as const;

/**
 * Status values for evidence items
 */
export const EVIDENCE_STATUS = {
  PENDING: 0,
  VERIFIED: 1,
  REJECTED: 2,
  ARCHIVED: 3,
} as const;

/**
 * Human-readable evidence status labels
 */
export const EVIDENCE_STATUS_LABELS = {
  [EVIDENCE_STATUS.PENDING]: "Pending Verification",
  [EVIDENCE_STATUS.VERIFIED]: "Verified",
  [EVIDENCE_STATUS.REJECTED]: "Rejected",
  [EVIDENCE_STATUS.ARCHIVED]: "Archived",
} as const;

// ======================================================
// Case Management
// ======================================================

/**
 * Status values for cases
 */
export const CASE_STATUS = {
  DRAFT: 0,
  ACTIVE: 1,
  UNDER_INVESTIGATION: 2,
  CLOSED: 3,
  ARCHIVED: 4,
} as const;

/**
 * Human-readable case status labels
 */
export const CASE_STATUS_LABELS = {
  [CASE_STATUS.DRAFT]: "Draft",
  [CASE_STATUS.ACTIVE]: "Active",
  [CASE_STATUS.UNDER_INVESTIGATION]: "Under Investigation",
  [CASE_STATUS.CLOSED]: "Closed",
  [CASE_STATUS.ARCHIVED]: "Archived",
} as const;

/**
 * Priority levels for cases
 */
export const CASE_PRIORITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
} as const;

/**
 * Human-readable priority level labels
 */
export const CASE_PRIORITY_LABELS = {
  [CASE_PRIORITY.LOW]: "Low",
  [CASE_PRIORITY.MEDIUM]: "Medium",
  [CASE_PRIORITY.HIGH]: "High",
  [CASE_PRIORITY.CRITICAL]: "Critical",
} as const;

// ======================================================
// Security and Permissions
// ======================================================

/**
 * Available permissions in the system
 */
export const PERMISSIONS = {
  CREATE_CASE: "create_case",
  EDIT_CASE: "edit_case",
  DELETE_CASE: "delete_case",
  VIEW_CASE: "view_case",
  UPLOAD_EVIDENCE: "upload_evidence",
  VERIFY_EVIDENCE: "verify_evidence",
  DELETE_EVIDENCE: "delete_evidence",
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  SYSTEM_CONFIG: "system_config",
} as const;

/**
 * Default role-based permissions
 */
export const ROLE_PERMISSIONS = {
  [ROLES.COURT]: [
    PERMISSIONS.VIEW_CASE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_CONFIG,
  ],
  [ROLES.OFFICER]: [
    PERMISSIONS.CREATE_CASE,
    PERMISSIONS.EDIT_CASE,
    PERMISSIONS.VIEW_CASE,
    PERMISSIONS.UPLOAD_EVIDENCE,
  ],
  [ROLES.FORENSIC]: [
    PERMISSIONS.VIEW_CASE,
    PERMISSIONS.UPLOAD_EVIDENCE,
    PERMISSIONS.VERIFY_EVIDENCE,
  ],
  [ROLES.LAWYER]: [PERMISSIONS.VIEW_CASE],
  [ROLES.NONE]: [],
} as const;

// ======================================================
// Logging and Diagnostics
// ======================================================

/**
 * Log levels for the application logger
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

/**
 * Human-readable log level labels
 */
export const LOG_LEVEL_LABELS = {
  [LOG_LEVELS.DEBUG]: "DEBUG",
  [LOG_LEVELS.INFO]: "INFO",
  [LOG_LEVELS.WARN]: "WARN",
  [LOG_LEVELS.ERROR]: "ERROR",
} as const;

// ======================================================
// Storage and Persistence
// ======================================================

/**
 * Local storage keys used by the application
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "flg_auth_token",
  SESSION_TOKEN: "flg_session_token",
  REFRESH_TOKEN: "flg_refresh_token",
  USER_DATA: "flg_user_data",
  USER_PREFERENCES: "flg_user_preferences",
  THEME: "flg_theme",
  LANGUAGE: "flg_language",
  LAST_LOGIN: "flg_last_login",
} as const;

// ======================================================
// API Endpoints
// ======================================================

/**
 * API endpoint paths organized by domain
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  CASES: {
    LIST: "/cases",
    CREATE: "/cases",
    DETAIL: "/cases/:id",
    UPDATE: "/cases/:id",
    DELETE: "/cases/:id",
  },
  EVIDENCE: {
    LIST: "/evidence",
    UPLOAD: "/evidence/upload",
    VERIFY: "/evidence/:id/verify",
    DELETE: "/evidence/:id",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
  },
} as const;

// ======================================================
// TypeScript Type Exports
// ======================================================

/**
 * Type for role values
 */
export type RoleType = (typeof ROLES)[keyof typeof ROLES];

/**
 * Type for evidence type values
 */
export type EvidenceType = (typeof EVIDENCE_TYPES)[keyof typeof EVIDENCE_TYPES];

/**
 * Type for evidence status values
 */
export type EvidenceStatus =
  (typeof EVIDENCE_STATUS)[keyof typeof EVIDENCE_STATUS];

/**
 * Type for case status values
 */
export type CaseStatus = (typeof CASE_STATUS)[keyof typeof CASE_STATUS];

/**
 * Type for case priority values
 */
export type CasePriority = (typeof CASE_PRIORITY)[keyof typeof CASE_PRIORITY];

/**
 * Type for permission values
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Type for log level values
 */
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/**
 * Type for storage key values
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Type for API endpoint paths
 */
export type ApiEndpoint = {
  [K in keyof typeof API_ENDPOINTS]: {
    [P in keyof (typeof API_ENDPOINTS)[K]]: string;
  };
};

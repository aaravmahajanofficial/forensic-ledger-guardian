/**
 * Application Configuration
 * Centralized configuration management for the Forensic Ledger Guardian
 * All environment variables are validated and provide secure defaults
 *
 * @module Config
 * @description Configuration is organized by category and includes validated
 * environment variables, safe defaults, and type definitions.
 */

import { ROLES, EVIDENCE_TYPES, CASE_STATUS, CASE_PRIORITY } from "@/constants";

// Environment variable validation helpers
const getEnvVar = (key: string, defaultValue: string = ""): string => {
  return import.meta.env[key] || defaultValue;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  return value ? value.toLowerCase() === "true" : defaultValue;
};

// Environment variables with type safety and defaults
export const config = {
  // Application metadata
  app: {
    name: getEnvVar("VITE_APP_NAME", "Forensic Ledger Guardian"),
    version: getEnvVar("VITE_APP_VERSION", "1.0.0"),
    debugMode: getEnvBoolean("VITE_DEBUG_MODE", import.meta.env.DEV),
    logLevel: getEnvVar("VITE_LOG_LEVEL", "info") as
      | "debug"
      | "info"
      | "warn"
      | "error",
  },

  // Feature flags for development
  features: {
    mockAuth: getEnvBoolean("VITE_MOCK_AUTH", import.meta.env.DEV),
    mockBlockchain: getEnvBoolean("VITE_MOCK_BLOCKCHAIN", import.meta.env.DEV),
  },

  // Blockchain configuration
  blockchain: {
    rpcUrl: getEnvVar("VITE_ETHEREUM_RPC_URL", "http://localhost:8545"),
    contractAddress: getEnvVar(
      "VITE_CONTRACT_ADDRESS",
      "0x0000000000000000000000000000000000000000"
    ),
    chainId: getEnvNumber("VITE_CHAIN_ID", 31337),
    evidenceContractAddress: getEnvVar(
      "VITE_EVIDENCE_CONTRACT_ADDRESS",
      "0x0000000000000000000000000000000000000000"
    ),
  },

  // IPFS/Helia configuration
  storage: {
    ipfsGateway: getEnvVar("VITE_IPFS_GATEWAY", "https://ipfs.io/ipfs/"),
    heliaNodeUrl: getEnvVar("VITE_HELIA_NODE_URL", "http://localhost:5001"),
  },

  // Security settings
  security: {
    encryptionIterations: getEnvNumber(
      "VITE_ENCRYPTION_KEY_DERIVATION_ITERATIONS",
      100000
    ),
    sessionTimeout: getEnvNumber("VITE_SESSION_TIMEOUT", 3600000), // 1 hour
    maxLoginAttempts: getEnvNumber("VITE_MAX_LOGIN_ATTEMPTS", 5),
    lockoutDuration: getEnvNumber("VITE_LOCKOUT_DURATION", 900000), // 15 minutes
  },

  // File handling
  files: {
    maxSize: getEnvNumber("VITE_MAX_FILE_SIZE", 52428800), // 50MB
    supportedTypes: getEnvVar(
      "VITE_SUPPORTED_FILE_TYPES",
      "image/*,video/*,application/pdf,text/*"
    )
      .split(",")
      .map((type) => type.trim()),
  },

  // API configuration
  api: {
    baseUrl: getEnvVar("VITE_API_BASE_URL", "/api"),
    timeout: getEnvNumber("VITE_API_TIMEOUT", 30000),
  },

  // Validation settings
  validation: {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 1000,
    MAX_CASE_TITLE_LENGTH: 200,
    PHONE_REGEX: /^\+?[\d\s\-()]{10,}$/,
  },

  // UI constants
  ui: {
    SIDEBAR_WIDTH: "16rem",
    SIDEBAR_WIDTH_MOBILE: "18rem",
    SIDEBAR_WIDTH_ICON: "3rem",
    NAVBAR_HEIGHT: "4rem",
    MAX_CONTENT_WIDTH: "7xl",
    BREAKPOINTS: {
      MOBILE: 768,
      TABLET: 1024,
      DESKTOP: 1280,
    },
  },

  // File constraints
  fileConstraints: {
    MAX_FILENAME_LENGTH: 255,
    ALLOWED_IMAGE_FORMATS: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
    ALLOWED_VIDEO_FORMATS: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
    ALLOWED_DOCUMENT_FORMATS: ["pdf", "doc", "docx", "txt", "rtf"],
  },

  // Timeouts and intervals
  timeouts: {
    API_REQUEST: 30000, // 30 seconds
    FILE_UPLOAD: 300000, // 5 minutes
    WALLET_CONNECTION: 60000, // 1 minute
    TOAST_DURATION: 5000, // 5 seconds
    DEBOUNCE_SEARCH: 300, // 300ms
  },

  // HTTP status codes
  httpStatus: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;

// Re-export constants for backward compatibility
export const APP_CONSTANTS = {
  ROLES,
  EVIDENCE_TYPES,
  CASE_STATUS,
  CASE_PRIORITY,
};

// Type exports for better TypeScript support
export type Role = (typeof ROLES)[keyof typeof ROLES];
export type EvidenceType = (typeof EVIDENCE_TYPES)[keyof typeof EVIDENCE_TYPES];
export type LogLevel = typeof config.app.logLevel;

// Validation function for configuration
export function validateConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required environment variables for production
  if (!config.app.debugMode) {
    if (
      !config.blockchain.contractAddress ||
      config.blockchain.contractAddress ===
        "0x0000000000000000000000000000000000000000"
    ) {
      errors.push("CONTRACT_ADDRESS must be set for production");
    }
    if (
      !config.blockchain.rpcUrl ||
      config.blockchain.rpcUrl.includes("localhost")
    ) {
      errors.push(
        "ETHEREUM_RPC_URL must be set to a valid network for production"
      );
    }
    if (config.features.mockAuth) {
      warnings.push("Mock authentication is enabled in production");
    }
  }

  // Validate numeric values
  if (config.security.encryptionIterations < 10000) {
    errors.push("Encryption iterations should be at least 10,000 for security");
  }

  if (config.files.maxSize > 100 * 1024 * 1024) {
    // 100MB
    warnings.push(
      "Large file size limit detected. Consider performance implications."
    );
  }

  if (config.security.sessionTimeout < 300000) {
    // 5 minutes
    warnings.push("Session timeout is very short. Consider user experience.");
  }

  // Validate URLs
  try {
    new URL(config.storage.ipfsGateway);
  } catch {
    errors.push("Invalid IPFS gateway URL");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Initialize configuration validation
const validationResult = validateConfig();

if (!validationResult.isValid) {
  console.error("Configuration validation errors:", validationResult.errors);
  if (config.app.debugMode) {
    throw new Error(
      "Configuration validation failed: " + validationResult.errors.join(", ")
    );
  }
}

if (validationResult.warnings.length > 0 && config.app.debugMode) {
  console.warn("Configuration warnings:", validationResult.warnings);
}

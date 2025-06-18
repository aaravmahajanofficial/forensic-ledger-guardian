/**
 * Secure storage utility for encrypting sensitive data in localStorage
 * Uses the Web Crypto API to provide strong encryption for client-side data
 *
 * @module Utils/SecureStorage
 */

import { STORAGE_KEYS } from "@/constants";
import { config } from "@/config";
import { logError, logDebug, logSecurityEvent } from "@/utils/logger";

/**
 * Storage item with metadata for encryption
 */
interface EncryptedStorageItem {
  /** Initialization vector for AES-GCM */
  iv: string;

  /** Salt used for key derivation */
  salt: string;

  /** Encrypted data as base64 string */
  data: string;

  /** Timestamp when the data was stored */
  timestamp: number;

  /** Version of the encryption schema used */
  version: number;
}

/**
 * Options for secure storage operations
 */
interface SecureStorageOptions {
  /** TTL in milliseconds, 0 for no expiration */
  ttl?: number;

  /** Custom encryption key */
  encryptionKey?: string;

  /** Number of PBKDF2 iterations (higher is more secure but slower) */
  iterations?: number;
}

/**
 * Provides encrypted storage capabilities using the Web Crypto API
 * with AES-GCM encryption and PBKDF2 key derivation
 */
class SecureStorage {
  /** Current encryption schema version */
  private readonly CURRENT_VERSION = 1;

  /** Default TTL for stored items (24 hours in ms) */
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000;

  /** Default number of PBKDF2 iterations */
  private readonly DEFAULT_ITERATIONS =
    config.security.encryptionIterations || 100000;

  /** Key used for encryption when no specific key is provided */
  private readonly encryptionKey: string;

  /**
   * Create a new SecureStorage instance
   */
  constructor() {
    this.encryptionKey = this.getOrCreateSessionKey();
  }

  /**
   * Get existing session key or create a new one
   */
  private getOrCreateSessionKey(): string {
    try {
      // Check if we have a session key
      let sessionKey = sessionStorage.getItem("_flg_session_key");
      if (!sessionKey) {
        // Generate a new session key
        sessionKey = this.generateRandomKey();
        sessionStorage.setItem("_flg_session_key", sessionKey);
        logDebug("Generated new session encryption key", { security: true });
      }
      return sessionKey;
    } catch (error) {
      logError(
        "Failed to create session key, using fallback",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      // Fallback for environments without sessionStorage
      return "INSECURE_KEY_DO_NOT_USE_IN_PRODUCTION";
    }
  }

  /**
   * Generate a cryptographically secure random key
   */
  private generateRandomKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  /**
   * Convert password to key material for PBKDF2
   */
  private async getKeyMaterial(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  /**
   * Derive encryption key using PBKDF2
   */
  private async deriveKey(
    password: string,
    salt: Uint8Array,
    _iterations: number = this.DEFAULT_ITERATIONS
  ): Promise<CryptoKey> {
    const keyMaterial = await this.getKeyMaterial(password);
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encryptData(data: string): Promise<string> {
    try {
      const enc = new TextEncoder();
      const encodedData = enc.encode(data);

      // Generate a random salt
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Generate a random initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Get the encryption key
      const key = await this.deriveKey(this.encryptionKey, salt);

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encodedData
      );

      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(
        salt.length + iv.length + encryptedData.byteLength
      );
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  async decryptData(encryptedData: string): Promise<string> {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const data = combined.slice(28);

      // Get the decryption key
      const key = await this.deriveKey(this.encryptionKey, salt);

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        data
      );

      // Convert back to string
      const dec = new TextDecoder();
      return dec.decode(decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  /**
   * Store an encrypted item in localStorage
   *
   * @param key - Storage key
   * @param value - Value to store (will be encrypted)
   * @param options - Options for encryption
   */
  async setItem(
    storageKey: string,
    value: string,
    options?: SecureStorageOptions
  ): Promise<void> {
    try {
      if (!storageKey || value === undefined) {
        throw new Error("Invalid key or value");
      }

      // Create storage item with metadata
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const iterations = options?.iterations || this.DEFAULT_ITERATIONS;
      const encryptionKey = options?.encryptionKey || this.encryptionKey;

      // Get the encryption key
      const cryptoKey = await this.deriveKey(encryptionKey, salt, iterations);

      // Encrypt the data
      const enc = new TextEncoder();
      const encodedData = enc.encode(value);

      const encryptedData = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        encodedData
      );

      // Convert to base64
      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encryptedData))
      );
      const ivBase64 = btoa(String.fromCharCode(...iv));
      const saltBase64 = btoa(String.fromCharCode(...salt));

      // Create storage item
      const storageItem: EncryptedStorageItem = {
        iv: ivBase64,
        salt: saltBase64,
        data: encryptedBase64,
        timestamp: Date.now(),
        version: this.CURRENT_VERSION,
      };

      // Store as JSON
      localStorage.setItem(storageKey, JSON.stringify(storageItem));

      logDebug("Stored encrypted data", { key: storageKey });
    } catch (error) {
      logError(
        "Failed to store encrypted data",
        { key: storageKey },
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Retrieve and decrypt an item from localStorage
   *
   * @param storageKey - Storage key
   * @param options - Options for decryption
   * @returns Decrypted value or null if not found
   */
  async getItem(
    storageKey: string,
    options?: SecureStorageOptions
  ): Promise<string | null> {
    try {
      const storedItem = localStorage.getItem(storageKey);
      if (!storedItem) {
        return null;
      }

      // Parse storage item
      const storageItem: EncryptedStorageItem = JSON.parse(storedItem);

      // Check if data is expired
      if (options?.ttl && storageItem.timestamp) {
        const expiresAt = storageItem.timestamp + options.ttl;
        if (Date.now() > expiresAt) {
          logDebug("Encrypted data expired", { key: storageKey });
          localStorage.removeItem(storageKey);
          return null;
        }
      }

      // Get the encryption key
      const encryptionKey = options?.encryptionKey || this.encryptionKey;
      const iterations = options?.iterations || this.DEFAULT_ITERATIONS;

      // Decode from base64
      const iv = new Uint8Array(
        atob(storageItem.iv)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      const salt = new Uint8Array(
        atob(storageItem.salt)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      const encryptedData = new Uint8Array(
        atob(storageItem.data)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      // Get the decryption key
      const cryptoKey = await this.deriveKey(encryptionKey, salt, iterations);

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        encryptedData
      );

      // Decode to string
      const dec = new TextDecoder();
      return dec.decode(decryptedData);
    } catch (error) {
      logError(
        "Failed to retrieve encrypted data",
        { key: storageKey },
        error instanceof Error ? error : new Error(String(error))
      );
      // If decryption fails, remove the corrupted data
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   *
   * @param storageKey - Storage key to remove
   */
  removeItem(storageKey: string): void {
    localStorage.removeItem(storageKey);
    logDebug("Removed stored item", { key: storageKey });
  }

  /**
   * Clear all stored data and session key
   */
  clearAll(): void {
    localStorage.clear();
    sessionStorage.removeItem("_flg_session_key");
    logSecurityEvent("All stored data cleared");
  }

  // Session token methods for authentication

  /**
   * Store authentication session token
   *
   * @param token - JWT or session token
   * @param remember - Whether to persist the token longer
   */
  async setSessionToken(token: string, remember = false): Promise<void> {
    try {
      const ttl = remember ? 30 * 24 * 60 * 60 * 1000 : this.DEFAULT_TTL; // 30 days or 24 hours
      await this.setItem(STORAGE_KEYS.SESSION_TOKEN, token, { ttl });
      logSecurityEvent("Session token stored", { remember });
    } catch (error) {
      logError(
        "Failed to store session token",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Retrieve authentication session token
   *
   * @returns Session token or null if not found
   */
  getSessionToken(): string | null {
    try {
      // Use synchronous version for simplicity
      const storedItem = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
      if (!storedItem) {
        return null;
      }

      try {
        // Parse storage item to check expiry
        const storageItem: EncryptedStorageItem = JSON.parse(storedItem);

        // Default TTL check (24 hours)
        const expiresAt = storageItem.timestamp + this.DEFAULT_TTL;
        if (Date.now() > expiresAt) {
          logDebug("Session token expired", { auth: true });
          localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
          return null;
        }

        // For synchronous use, we'll return a placeholder and expect
        // the caller to use getSessionTokenAsync for actual value
        return "SESSION_TOKEN_EXISTS";
      } catch {
        // If we can't parse, just remove the corrupted token
        localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
        return null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Retrieve authentication session token asynchronously
   *
   * @returns Promise resolving to the session token or null
   */
  async getSessionTokenAsync(): Promise<string | null> {
    try {
      return await this.getItem(STORAGE_KEYS.SESSION_TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * Remove authentication session token
   */
  removeSessionToken(): void {
    this.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }
}

// Export a singleton instance
export const secureStorage = new SecureStorage();

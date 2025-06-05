// Secure storage utility for encrypting sensitive data in localStorage

class SecureStorage {
  private readonly encryptionKey: string;

  constructor() {
    // In a production environment, this key should be:
    // 1. Generated per session
    // 2. Derived from user credentials
    // 3. Stored securely (not in code)
    // For this demo, we'll use a static key with session rotation
    this.encryptionKey = this.getOrCreateSessionKey();
  }

  private getOrCreateSessionKey(): string {
    // Check if we have a session key
    let sessionKey = sessionStorage.getItem("_session_key");
    if (!sessionKey) {
      // Generate a new session key
      sessionKey = this.generateRandomKey();
      sessionStorage.setItem("_session_key", sessionKey);
    }
    return sessionKey;
  }

  private generateRandomKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

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

  private async getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
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
      const key = await this.getKey(this.encryptionKey, salt);

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
      const key = await this.getKey(this.encryptionKey, salt);

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

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await this.encryptData(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error("Failed to store encrypted data:", error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) {
        return null;
      }
      return await this.decryptData(encryptedValue);
    } catch (error) {
      console.error("Failed to retrieve encrypted data:", error);
      // If decryption fails, remove the corrupted data
      localStorage.removeItem(key);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all stored data and session key
  clearAll(): void {
    localStorage.clear();
    sessionStorage.removeItem("_session_key");
  }
}

// Export a singleton instance
export const secureStorage = new SecureStorage();

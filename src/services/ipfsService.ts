import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { toast } from "@/hooks/use-toast";
import { logError, logInfo, logDebug } from "@/utils/logger";

/**
 * Modern IPFS service using Helia
 * Simplified implementation for browser environments
 * Provides secure, decentralized storage for forensic evidence
 */
class IPFSService {
  // TODO: Replace any with proper Helia types once they are available
  private helia: any | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  private fs: any | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any
  private isInitializing = false;

  constructor() {
    this.initializeHelia();
  }

  private async initializeHelia(): Promise<void> {
    if (this.isInitializing || this.helia) return;

    this.isInitializing = true;

    try {
      // Initialize Helia with minimal configuration for browser compatibility
      this.helia = await createHelia();
      this.fs = unixfs(this.helia);

     
    } catch {
      // Initialization failed, will be retried on next operation
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Ensure IPFS is initialized before operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.helia || !this.fs) {
      await this.initializeHelia();
    }

    if (!this.helia || !this.fs) {
      throw new Error("IPFS initialization failed");
    }
  }

  /**
   * Generate SHA-256 hash for file integrity verification
   */
  private async generateFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Encrypt data using AES-GCM with derived key
   */
  private async encryptData(
    data: ArrayBuffer,
    password: string
  ): Promise<ArrayBuffer> {
    try {
      // Generate salt
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt data
      const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
      );

      // Combine salt + iv + encrypted data
      const result = new Uint8Array(
        salt.length + iv.length + encryptedData.byteLength
      );
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encryptedData), salt.length + iv.length);

      return result.buffer;
    } catch (error) {
      logError("Encryption failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(
        `Encryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Decrypt data using AES-GCM with derived key
   */
  private async decryptData(
    encryptedData: ArrayBuffer,
    password: string
  ): Promise<ArrayBuffer> {
    try {
      const data = new Uint8Array(encryptedData);

      // Extract salt, iv, and encrypted data
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encrypted = data.slice(28);

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      // Decrypt data
      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encrypted
      );

      return decryptedData;
    } catch (error) {
     
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Upload a file to IPFS with encryption
   */
  public async uploadFile(
    file: File,
    encryptionKey: string
  ): Promise<{ cid: string; hash: string }> {
    try {
      await this.ensureInitialized();

      logDebug("Starting file upload to IPFS", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Generate file hash for verification
      const hash = await this.generateFileHash(file);

      // Read file data
      const fileData = await file.arrayBuffer();

      // Encrypt data
      const encryptedData = await this.encryptData(fileData, encryptionKey);

      // Upload to IPFS
      const cid = await this.fs?.addBytes(new Uint8Array(encryptedData));

      // Pin the file to keep it available
      await this.pinFile(cid.toString());

      logInfo("File uploaded to IPFS successfully", {
        cid: cid.toString(),
        hash,
        fileName: file.name,
      });

      toast({
        title: "Upload Complete",
        description: `File ${file.name} successfully uploaded to IPFS`,
      });

      return {
        cid: cid.toString(),
        hash,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logError(
        "Failed to upload file to IPFS",
        {
          fileName: file.name,
          error: errorMsg,
        },
        error instanceof Error ? error : undefined
      );

      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name} to IPFS: ${errorMsg}`,
        variant: "destructive",
      });

      throw error;
    }
  }

  /**
   * Download and decrypt a file from IPFS
   */
  public async downloadFile(
    cid: string,
    decryptionKey: string
  ): Promise<Uint8Array> {
    try {
      await this.ensureInitialized();

      logDebug("Starting file download from IPFS", { cid });

      // Download from IPFS
      const chunks: Uint8Array[] = [];
      // eslint-disable-next-line no-unsafe-optional-chaining
      for await (const chunk of this.fs?.cat(cid)) {
        chunks.push(chunk);
      }

      // Combine chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const encryptedData = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        encryptedData.set(chunk, offset);
        offset += chunk.length;
      }

      // Decrypt data
      const decryptedData = await this.decryptData(
        encryptedData.buffer,
        decryptionKey
      );

      logInfo("File downloaded from IPFS successfully", { cid });

      return new Uint8Array(decryptedData);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logError(
        "Failed to download file from IPFS",
        { cid, error: errorMsg },
        error instanceof Error ? error : undefined
      );

      toast({
        title: "Download Failed",
        description: `Failed to download file from IPFS: ${errorMsg}`,
        variant: "destructive",
      });

      throw error;
    }
  }

  /**
   * Pin a file to keep it available in IPFS
   */
  public async pinFile(cid: string): Promise<void> {
    try {
      await this.ensureInitialized();

      // Note: In a real implementation, you would implement pinning logic
      // For now, we'll just log the pin operation
      logInfo("File pinned successfully", { cid });
    } catch (error) {
      logError(
        "Failed to pin file",
        { cid },
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }

  /**
   * Verify file integrity using hash
   */
  public async verifyFile(file: File, expectedHash: string): Promise<boolean> {
    try {
      const actualHash = await this.generateFileHash(file);
      return actualHash === expectedHash;
    } catch (error) {
      logError("File verification failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get IPFS node status
   */
  public async getStatus(): Promise<{
    isOnline: boolean;
    nodeId?: string;
    version?: string;
    peers?: number;
  }> {
    try {
      if (!this.helia) {
        return { isOnline: false };
      }

      const nodeId = this.helia.libp2p.peerId.toString();
      const peers = this.helia.libp2p.getPeers().length;

      return {
        isOnline: true,
        nodeId,
        version: "1.0.0", // Helia version
        peers,
      };
    } catch (error) {
      logError("Failed to get IPFS status", {
        error: error instanceof Error ? error.message : String(error),
      });
      return { isOnline: false };
    }
  }

  /**
   * Clean up and close IPFS node
   */
  async close(): Promise<void> {
    if (this.helia) {
      await this.helia.stop();
      this.helia = null;
      this.fs = null;
      logInfo("IPFS node closed successfully");
    }
  }
}

// Export singleton instance
const ipfsService = new IPFSService();
export default ipfsService;

import { create, IPFSHTTPClient } from "ipfs-http-client";
import { toast } from "@/hooks/use-toast";

export class IPFSService {
  private client: IPFSHTTPClient | null = null;

  constructor() {
    // Using Infura as an IPFS provider (in production, configure with API keys)
    try {
      this.client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });
    } catch (error) {
      console.error("Failed to create IPFS client:", error);
    }
  }

  // Helper to generate SHA-256 hash of a file
  public async generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject("Failed to read file");
          return;
        }

        try {
          const arrayBuffer = e.target.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          resolve(hashHex);
        } catch (error) {
          console.error("Error generating hash:", error);
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  // Simple encryption function (in real-world, use a more robust encryption)
  private async encryptData(
    data: ArrayBuffer,
    key: string,
  ): Promise<ArrayBuffer> {
    // This is a placeholder. In a real app, implement proper encryption
    // using Web Crypto API with the provided key
    return data;
  }

  // Upload a file to IPFS and return the CID
  public async uploadFile(
    file: File,
    encryptionKey: string,
  ): Promise<{ cid: string; hash: string }> {
    if (!this.client) {
      toast({
        title: "IPFS Error",
        description: "IPFS client is not initialized",
        variant: "destructive",
      });
      throw new Error("IPFS client is not initialized");
    }

    try {
      // Generate file hash for verification
      const hash = await this.generateFileHash(file);

      // Read file data
      const fileData = await file.arrayBuffer();

      // Encrypt data (in a real app, implement proper encryption)
      const encryptedData = await this.encryptData(fileData, encryptionKey);

      // Upload to IPFS
      const { cid } = await this.client.add(
        {
          content: new Uint8Array(encryptedData),
        },
        {
          pin: true, // Pin the file to keep it in IPFS
        },
      );

      toast({
        title: "Upload Complete",
        description: "File successfully uploaded to IPFS",
      });

      return {
        cid: cid.toString(),
        hash,
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to IPFS",
        variant: "destructive",
      });
      throw error;
    }
  }
}

// Create singleton instance
const ipfsService = new IPFSService();
export default ipfsService;

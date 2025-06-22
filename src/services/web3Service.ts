/**
 * Web3 Service for blockchain interactions and smart contract operations
 *
 * @module Services/Web3Service
 */

import { ethers } from "ethers";
import { config } from "@/config";
import {
  logInfo,
  logError,
  logDebug,
  logWarn,
  logSecurityEvent,
} from "@/utils/logger";
import { ROLES } from "@/constants";
import type {
  Evidence,
  Role,
  NetworkInfo,
  TransactionResult,
} from "@/types/blockchain";
import CONTRACT_ABI from "./contracts/ForensicEvidenceABI";
import ROLE_MANAGER_ABI from "./contracts/RoleManagerABI";

/**
 * Enhanced Web3 Service for Blockchain Integration
 * Handles all interactions with the Ethereum blockchain and smart contracts
 */
class Web3Service {
  /** Main ethers provider */
  private provider: ethers.Provider | null = null;

  /** Signer for authenticated transactions */
  private signer: ethers.Signer | null = null;

  /** The main forensic evidence contract instance */
  private evidenceContract: ethers.Contract | null = null;

  /** The role manager contract instance */
  private roleManagerContract: ethers.Contract | null = null;

  /** Whether contracts are initialized successfully */
  private isInitialized = false;

  /** Required network chain ID from configuration */
  private readonly requiredChainId: number;

  /**
   * Creates a new Web3Service instance
   */
  constructor() {
    this.requiredChainId = config.blockchain.chainId || 1; // Default to Ethereum mainnet if not specified
    this.initializeProvider();
  }

  /**
   * Initialize Web3 provider and contracts
   */
  private async initializeProvider(): Promise<void> {
    try {
      // Check if MetaMask is available
      if (typeof window !== "undefined" && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        logDebug("Creating browser provider for MetaMask", {
          blockchain: true,
        });

        // Initialize contract if we have all required info
        if (config.blockchain.evidenceContractAddress) {
          await this.initializeContracts();
        }

        logInfo("Web3 provider initialized successfully");
      } else {
        logWarn("MetaMask not detected. Using read-only provider.");

        // Fallback to RPC provider for read-only operations
        if (config.blockchain.rpcUrl) {
          this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
          logDebug("Created read-only JSON-RPC provider", {
            rpcUrl: config.blockchain.rpcUrl,
            blockchain: true,
          });

          // Try to initialize contracts in read-only mode
          if (config.blockchain.evidenceContractAddress) {
            await this.initializeContracts();
          }
        }
      }
    } catch (error) {
      logError(
        "Failed to initialize Web3 provider",
        { provider: this.provider ? "Available" : "Unavailable" },
        error instanceof Error ? error : new Error("Unknown provider error")
      );
    }
  }

  /**
   * Initialize smart contract instances
   */
  private async initializeContracts(): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error("Web3 provider not available");
      }

      if (!config.blockchain.evidenceContractAddress) {
        throw new Error("Evidence contract address not configured");
      }

      // Initialize evidence contract
      this.evidenceContract = new ethers.Contract(
        config.blockchain.evidenceContractAddress,
        CONTRACT_ABI,
        this.provider
      );

      logDebug("Evidence contract initialized", {
        address: config.blockchain.evidenceContractAddress,
      });

      // Initialize role manager contract if available
      if (config.blockchain.contractAddress) {
        this.roleManagerContract = new ethers.Contract(
          config.blockchain.contractAddress,
          ROLE_MANAGER_ABI,
          this.provider
        );

        logDebug("Role manager contract initialized", {
          address: config.blockchain.contractAddress,
        });
      } else {
        logWarn(
          "Role manager contract address not configured, using evidence contract for roles"
        );
        // Use evidence contract for role functions as fallback
        this.roleManagerContract = this.evidenceContract;
      }

      logInfo("Smart contracts initialized successfully");
      this.isInitialized = true;
    } catch (error) {
      logError(
        "Failed to initialize smart contracts",
        {
          evidenceAddress: config.blockchain.evidenceContractAddress,
          roleAddress: config.blockchain.contractAddress,
        },
        error instanceof Error
          ? error
          : new Error("Contract initialization error")
      );
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Connect to user's wallet
   */
  public async connectWallet(): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error("Web3 provider not available");
      }

      // Request account access
      await window.ethereum?.request({ method: "eth_requestAccounts" });

      this.signer = await (this.provider as ethers.BrowserProvider).getSigner();
      const address = await this.signer.getAddress();

      // Update contracts to use signer for transactions
      if (this.evidenceContract) {
        this.evidenceContract = this.evidenceContract.connect(
          this.signer
        ) as ethers.Contract;
      }

      if (this.roleManagerContract) {
        this.roleManagerContract = this.roleManagerContract.connect(
          this.signer
        ) as ethers.Contract;
      }

      // Check network to ensure we're on the right chain
      const chainId = await this.getChainId();
      if (chainId !== this.requiredChainId) {
        logWarn("Connected to wrong network", {
          currentChainId: chainId,
          requiredChainId: this.requiredChainId,
        });
      }

      logSecurityEvent("Wallet connected", { address, chainId });

      return address;
    } catch (error) {
      logError(
        "Failed to connect wallet",
        {},
        error instanceof Error ? error : new Error("Wallet connection error")
      );
      throw error;
    }
  }

  /**
   * Gets the current chain ID
   */
  public async getChainId(): Promise<number> {
    try {
      if (!this.provider) {
        throw new Error("Provider not available");
      }

      const network = await this.provider.getNetwork();
      return Number(network.chainId);
    } catch (error) {
      logError(
        "Failed to get chain ID",
        {},
        error instanceof Error ? error : new Error("Chain ID error")
      );
      return 0;
    }
  }

  /**
   * Gets the required chain ID for this application
   */
  public getRequiredChainId(): number {
    return this.requiredChainId;
  }

  /**
   * Attempts to switch to the required network
   */
  public async switchToRequiredNetwork(): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not available");
      }

      const hexChainId = "0x" + this.requiredChainId.toString(16);

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId }],
        });
      } catch (switchError: unknown) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (
          switchError &&
          typeof switchError === "object" &&
          "code" in switchError &&
          switchError.code === 4902
        ) {
          await this.addNetworkToMetaMask();
        } else {
          throw switchError;
        }
      }

      logInfo("Switched to required network", {
        chainId: this.requiredChainId,
      });
    } catch (error) {
      logError(
        "Failed to switch network",
        { requiredChainId: this.requiredChainId },
        error instanceof Error ? error : new Error("Network switch error")
      );
      throw error;
    }
  }

  /**
   * Adds the required network to MetaMask
   */
  private async addNetworkToMetaMask(): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not available");
      }

      const networkParams = {
        chainId: `0x${config.blockchain.chainId.toString(16)}`,
        chainName: `Local Network (${config.blockchain.chainId})`,
        rpcUrls: [config.blockchain.rpcUrl],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
      };

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });

      logInfo("Added network to MetaMask", {
        params: networkParams,
      });
    } catch (error) {
      logError(
        "Failed to add network to MetaMask",
        { chainId: config.blockchain.chainId },
        error instanceof Error ? error : new Error("Add network error")
      );
      throw error;
    }
  }

  /**
   * Get current account address
   */
  public async getCurrentAccount(): Promise<string | null> {
    try {
      // First try with signer if available
      if (this.signer) {
        return await this.signer.getAddress();
      }

      // If no signer but ethereum is available, try to get accounts
      if (window.ethereum) {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];
        if (accounts && accounts.length > 0) {
          return accounts[0];
        }
      }

      return null;
    } catch (error) {
      logError(
        "Failed to get current account",
        {},
        error instanceof Error ? error : new Error("Account retrieval error")
      );
      return null;
    }
  }

  /**
   * Gets the user's role from the blockchain
   */
  public async getUserRole(): Promise<Role> {
    try {
      if (!this.roleManagerContract) {
        logWarn("Role manager contract not initialized");
        return ROLES.NONE;
      }

      const address = await this.getCurrentAccount();
      if (!address) {
        return ROLES.NONE;
      }

      // Get the numeric role from the contract
      const roleId = await this.roleManagerContract.getUserRole(address);

      // Map numeric role to our role constants
      switch (Number(roleId)) {
        case 0:
          return ROLES.NONE;
        case 1:
          return ROLES.OFFICER;
        case 2:
          return ROLES.FORENSIC;
        case 3:
          return ROLES.LAWYER;
        case 4:
          return ROLES.COURT;
        case 5:
          return ROLES.COURT;
        default:
          return ROLES.NONE;
      }
    } catch (error) {
      logError(
        "Failed to get user role",
        {},
        error instanceof Error ? error : new Error("Role retrieval error")
      );
      return ROLES.NONE;
    }
  }

  /**
   * Upload evidence to blockchain
   *
   * @param cid - Content identifier (IPFS hash)
   * @param hash - File integrity hash
   * @param description - Evidence description
   * @param caseId - Case identifier
   * @returns Transaction result with hash and receipt
   */
  public async uploadEvidence(
    cid: string,
    hash: string,
    description: string,
    caseId: string
  ): Promise<TransactionResult> {
    try {
      if (!this.evidenceContract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      // Validate inputs
      if (!cid || !hash || !description || !caseId) {
        throw new Error("Missing required evidence information");
      }

      logSecurityEvent("Uploading evidence to blockchain", {
        cid,
        hash: `${hash.substring(0, 10)}...`, // Only log partial hash for security
        caseId,
        uploader: await this.signer.getAddress(),
      });

      // Send the transaction
      const tx = await this.evidenceContract.uploadEvidence(
        cid,
        hash,
        description,
        caseId,
        { gasLimit: 500000 } // Reasonable gas limit for evidence upload
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      // Find the EvidenceUploaded event in the receipt
      let evidenceId: string | undefined;
      for (const event of receipt.logs) {
        try {
          const parsedLog = this.evidenceContract.interface.parseLog({
            topics: event.topics,
            data: event.data,
          });

          if (parsedLog && parsedLog.name === "EvidenceUploaded") {
            evidenceId = parsedLog.args.evidenceId.toString();
            break;
          }
        } catch {
          // Skip logs that can't be parsed
          continue;
        }
      }

      logInfo("Evidence uploaded successfully", {
        transactionHash: receipt.hash,
        evidenceId: evidenceId || "unknown",
        cid,
      });

      return {
        success: true,
        hash: receipt.hash,
        receipt,
        extraData: { evidenceId },
      };
    } catch (error) {
      logError(
        "Failed to upload evidence",
        {},
        error instanceof Error ? error : new Error("Evidence upload error")
      );
      throw error;
    }
  }

  /**
   * Get evidence details by ID
   *
   * @param evidenceId - The evidence identifier
   * @returns Evidence details or null if not found
   */
  public async getEvidence(evidenceId: string): Promise<Evidence | null> {
    try {
      if (!this.evidenceContract) {
        throw new Error("Contract not initialized");
      }

      const evidence = await this.evidenceContract.getEvidence(evidenceId);

      return {
        id: evidenceId,
        cid: evidence.cid,
        hash: evidence.hash,
        description: evidence.description,
        caseId: evidence.caseId,
        uploader: evidence.uploader,
        timestamp: new Date(Number(evidence.timestamp) * 1000),
        verified: false, // Will be set by verification process
      };
    } catch (error) {
      logError(
        "Failed to get evidence",
        { evidenceId },
        error instanceof Error ? error : new Error("Evidence retrieval error")
      );
      return null;
    }
  }

  /**
   * File First Information Report (FIR) on blockchain
   *
   * @param firNumber - Official FIR identifier
   * @param description - Description of the incident
   * @param location - Location of the incident
   * @returns Transaction result with hash and receipt
   */
  public async fileFIR(
    firNumber: string,
    description: string,
    location: string
  ): Promise<TransactionResult> {
    try {
      if (!this.evidenceContract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      // Validate inputs
      if (!firNumber || !description || !location) {
        throw new Error("Missing required FIR information");
      }

      logSecurityEvent("Filing FIR on blockchain", {
        firNumber,
        location,
        filer: await this.signer.getAddress(),
      });

      // Send the transaction
      const tx = await this.evidenceContract.fileFIR(
        firNumber,
        description,
        location,
        { gasLimit: 300000 } // Reasonable gas limit for FIR filing
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      logInfo("FIR filed successfully", {
        transactionHash: receipt.hash,
        firNumber,
      });

      return {
        success: true,
        hash: receipt.hash,
        receipt,
      };
    } catch (error) {
      logError(
        "Failed to file FIR",
        {},
        error instanceof Error ? error : new Error("FIR filing error")
      );
      throw error;
    }
  }

  /**
   * Verify evidence integrity
   *
   * @param evidenceId - The evidence identifier
   * @param expectedHash - The expected file hash to verify against
   * @returns Whether the evidence hash matches the expected hash
   */
  public async verifyEvidence(
    evidenceId: string,
    expectedHash: string
  ): Promise<boolean> {
    try {
      if (!evidenceId || !expectedHash) {
        logWarn("Missing evidence ID or hash for verification");
        return false;
      }

      const evidence = await this.getEvidence(evidenceId);
      if (!evidence) {
        logWarn(`Evidence ${evidenceId} not found for verification`);
        return false;
      }

      const isValid = evidence.hash === expectedHash;

      logSecurityEvent("Evidence verification", {
        evidenceId,
        result: isValid ? "verified" : "failed",
        storedHash: `${evidence.hash.substring(0, 10)}...`, // Partial hash for logs
        expectedHashLength: expectedHash.length,
      });

      return isValid;
    } catch (error) {
      logError(
        "Failed to verify evidence",
        { evidenceId },
        error instanceof Error
          ? error
          : new Error("Evidence verification error")
      );
      return false;
    }
  }

  /**
   * Create a new case on the blockchain
   *
   * @param caseNumber - Official case number
   * @param description - Case description
   * @param investigatorAddress - Address of the assigned investigator (optional)
   * @returns Transaction result with hash and receipt
   */
  public async createCase(
    caseNumber: string,
    description: string,
    investigatorAddress?: string
  ): Promise<TransactionResult> {
    try {
      if (!this.evidenceContract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      // Use the current address as investigator if none provided
      const investigator =
        investigatorAddress || (await this.signer.getAddress());

      logSecurityEvent("Creating case on blockchain", {
        caseNumber,
        investigator,
        creator: await this.signer.getAddress(),
      });

      // Send the transaction
      const tx = await this.evidenceContract.createCase(
        caseNumber,
        description,
        investigator,
        { gasLimit: 300000 }
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      logInfo("Case created successfully", {
        transactionHash: receipt.hash,
        caseNumber,
      });

      return {
        success: true,
        hash: receipt.hash,
        receipt,
      };
    } catch (error) {
      logError(
        "Failed to create case",
        {},
        error instanceof Error ? error : new Error("Case creation error")
      );
      throw error;
    }
  }

  /**
   * Transfer custody of evidence
   *
   * @param evidenceId - Evidence identifier
   * @param recipientAddress - Address of the new custodian
   * @param notes - Notes about the transfer
   * @returns Transaction result with hash and receipt
   */
  public async transferCustody(
    evidenceId: string,
    recipientAddress: string,
    notes: string
  ): Promise<TransactionResult> {
    try {
      if (!this.evidenceContract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      const currentAddress = await this.signer.getAddress();

      logSecurityEvent("Transferring evidence custody", {
        evidenceId,
        from: currentAddress,
        to: recipientAddress,
      });

      // Send the transaction
      const tx = await this.evidenceContract.transferCustody(
        evidenceId,
        recipientAddress,
        notes,
        { gasLimit: 200000 }
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      logInfo("Custody transferred successfully", {
        transactionHash: receipt.hash,
        evidenceId,
        recipient: recipientAddress,
      });

      return {
        success: true,
        hash: receipt.hash,
        receipt,
      };
    } catch (error) {
      logError(
        "Failed to transfer custody",
        { evidenceId, recipient: recipientAddress },
        error instanceof Error ? error : new Error("Custody transfer error")
      );
      throw error;
    }
  }

  /**
   * Get blockchain network information
   *
   * @returns Network information including chain ID, name, and current block
   */
  public async getNetworkInfo(): Promise<NetworkInfo> {
    try {
      if (!this.provider) {
        throw new Error("Provider not available");
      }

      const [network, blockNumber] = await Promise.all([
        this.provider.getNetwork(),
        this.provider.getBlockNumber(),
      ]);

      const networkInfo: NetworkInfo = {
        chainId: Number(network.chainId),
        name:
          network.name ||
          this.getNetworkNameFromChainId(Number(network.chainId)),
        blockNumber,
      };

      logDebug("Retrieved network info", {
        chainId: networkInfo.chainId,
        name: networkInfo.name,
        blockNumber: networkInfo.blockNumber,
      });

      return networkInfo;
    } catch (error) {
      logError(
        "Failed to get network info",
        {},
        error instanceof Error ? error : new Error("Network info error")
      );
      throw error;
    }
  }

  /**
   * Get network name from chain ID
   *
   * @param chainId - The numeric chain ID
   * @returns Human-readable network name
   */
  private getNetworkNameFromChainId(chainId: number): string {
    const networkNames: Record<number, string> = {
      1: "Ethereum Mainnet",
      3: "Ropsten Testnet",
      4: "Rinkeby Testnet",
      5: "Goerli Testnet",
      42: "Kovan Testnet",
      56: "Binance Smart Chain",
      137: "Polygon Mainnet",
      80001: "Mumbai Testnet",
      31337: "Hardhat Local",
      1337: "Local Testnet",
    };

    return networkNames[chainId] || `Unknown Network (${chainId})`;
  }

  /**
   * Get transaction receipt
   *
   * @param txHash - Transaction hash
   * @returns Transaction receipt or null if not found
   */
  public async getTransactionReceipt(
    txHash: string
  ): Promise<ethers.TransactionReceipt | null> {
    try {
      if (!this.provider || !txHash) return null;
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      logError(
        "Failed to get transaction receipt",
        { txHash },
        error instanceof Error ? error : new Error("Receipt retrieval error")
      );
      return null;
    }
  }

  /**
   * Check if Web3 is available and connected
   *
   * @returns Whether the wallet is connected
   */
  public isConnected(): boolean {
    return !!(this.provider && this.signer);
  }

  /**
   * Check if contracts are available
   *
   * @returns Whether contracts are properly initialized
   */
  public isContractReady(): boolean {
    return !!(this.evidenceContract && this.isInitialized);
  }

  /**
   * Get a list of evidence for a specific case
   *
   * @param caseId - The case identifier
   * @param limit - Maximum number of items to return
   * @returns Array of evidence items or empty array if none found
   */
  public async getEvidenceByCase(
    caseId: string,
    limit = 50
  ): Promise<Evidence[]> {
    try {
      if (!this.evidenceContract || !caseId) {
        return [];
      }

      // This implementation depends on the actual contract structure
      // For now it's a placeholder with a mock approach

      // In a real implementation, you'd call a contract method like:
      // const evidenceIds = await this.evidenceContract.getEvidenceIdsByCase(caseId, limit);

      // For now, we'll use events to simulate this functionality
      const filter = this.evidenceContract.filters.EvidenceUploaded();
      const events = await this.evidenceContract.queryFilter(filter, -10000); // Last 10000 blocks

      const evidencePromises = events.slice(0, limit).map(async (event) => {
        if ("args" in event) {
          const evidenceId = event.args?.evidenceId.toString();
          return await this.getEvidence(evidenceId);
        }
        return null;
      });

      const evidenceList = await Promise.all(evidencePromises);

      // Filter out null values and evidence not related to this case
      return evidenceList.filter(
        (evidence): evidence is Evidence =>
          evidence !== null && evidence.caseId === caseId
      );
    } catch (error) {
      logError(
        "Failed to get evidence by case",
        { caseId },
        error instanceof Error ? error : new Error("Evidence retrieval error")
      );
      return [];
    }
  }

  /**
   * Grant case access to a user
   *
   * @param caseId - Case identifier
   * @param address - User address to grant access to
   * @returns Transaction result
   */
  public async grantCaseAccess(
    caseId: string,
    address: string
  ): Promise<TransactionResult> {
    try {
      if (!this.roleManagerContract || !this.signer) {
        throw new Error("Contract not initialized or wallet not connected");
      }

      const grantor = await this.signer.getAddress();

      logSecurityEvent("Granting case access", {
        caseId,
        to: address,
        by: grantor,
      });

      // Send the transaction
      const tx = await this.roleManagerContract.grantCaseAccess(
        caseId,
        address,
        { gasLimit: 100000 }
      );

      // Wait for confirmation
      const receipt = await tx.wait();

      logInfo("Case access granted successfully", {
        transactionHash: receipt.hash,
        caseId,
        grantee: address,
      });

      return {
        success: true,
        hash: receipt.hash,
        receipt,
      };
    } catch (error) {
      logError(
        "Failed to grant case access",
        { caseId, address },
        error instanceof Error ? error : new Error("Access grant error")
      );
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  public disconnect(): void {
    this.signer = null;

    // Reset contracts to use provider only (read-only mode)
    if (this.evidenceContract && this.provider) {
      this.evidenceContract = this.evidenceContract.connect(
        this.provider
      ) as ethers.Contract;
    }

    if (this.roleManagerContract && this.provider) {
      this.roleManagerContract = this.roleManagerContract.connect(
        this.provider
      ) as ethers.Contract;
    }

    logSecurityEvent("Wallet disconnected manually");
  }
}

// Export singleton instance
const web3Service = new Web3Service();
export default web3Service;

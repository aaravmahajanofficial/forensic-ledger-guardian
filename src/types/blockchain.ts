/**
 * Blockchain-specific type definitions
 *
 * @module Types/Blockchain
 */

// ======================================================
// Blockchain Address Types
// ======================================================

/**
 * Ethereum address type (0x-prefixed hex string)
 * Used for wallet addresses and contract addresses
 */
export type EthereumAddress = `0x${string}`;

/**
 * Transaction hash type (0x-prefixed hex string)
 */
export type TransactionHash = `0x${string}`;

/**
 * Block number type
 */
export type BlockNumber = number;

// ======================================================
// Web3 Connection Types
// ======================================================

/**
 * Web3 connection state
 */
export interface Web3ConnectionState {
  /** Whether wallet is connected */
  isConnected: boolean;

  /** Connected account address */
  account: EthereumAddress | null;

  /** Chain/network ID */
  chainId: number | null;

  /** Network name (e.g., "mainnet", "goerli") */
  networkName: string | null;

  /** Whether connection is in progress */
  connecting: boolean;

  /** Connection error if any */
  error: Error | null;
}

/**
 * Available wallet providers
 */
export enum WalletProvider {
  MetaMask = "metamask",
  WalletConnect = "walletconnect",
  CoinbaseWallet = "coinbase",
  Injected = "injected",
  None = "none",
}

// ======================================================
// Smart Contract Types
// ======================================================

/**
 * Evidence record as stored on blockchain
 */
export interface BlockchainEvidence {
  /** Unique evidence ID */
  id: string;

  /** IPFS Content ID */
  cid: string;

  /** Evidence file hash */
  hash: string;

  /** Evidence description */
  description: string;

  /** Associated case ID */
  caseId: string;

  /** Address of uploader */
  uploader: EthereumAddress;

  /** Upload timestamp */
  timestamp: number;
}

/**
 * Evidence upload event
 */
export interface EvidenceUploadedEvent {
  /** Evidence ID */
  evidenceId: string;

  /** Uploader address */
  uploader: EthereumAddress;

  /** Evidence CID */
  cid: string;

  /** Block number */
  blockNumber: number;

  /** Transaction hash */
  transactionHash: TransactionHash;
}

/**
 * Case record as stored on blockchain
 */
export interface BlockchainCase {
  /** Unique case ID */
  id: string;

  /** Case number */
  caseNumber: string;

  /** Case title */
  title: string;

  /** Creator address */
  creator: EthereumAddress;

  /** Creation timestamp */
  timestamp: number;

  /** Current status */
  status: number;
}

/**
 * Chain of custody event as stored on blockchain
 */
export interface BlockchainCustodyEvent {
  /** Event ID */
  id: string;

  /** Evidence ID */
  evidenceId: string;

  /** Actor address */
  actor: EthereumAddress;

  /** Event timestamp */
  timestamp: number;

  /** Action performed */
  action: string;
}

/**
 * Transaction receipt with additional metadata
 */
export interface EnhancedTransactionReceipt {
  /** Transaction hash */
  transactionHash: TransactionHash;

  /** Block number */
  blockNumber: BlockNumber;

  /** Block timestamp */
  timestamp?: number;

  /** Gas used */
  gasUsed: bigint;

  /** Transaction status (1 = success, 0 = failure) */
  status: number;

  /** Transaction events */
  events?: Record<string, unknown>;
}

/**
 * Blockchain transaction receipt
 */
export interface TransactionReceipt {
  /** Transaction hash */
  transactionHash: string;

  /** Block number where transaction was mined */
  blockNumber: number;

  /** Block hash */
  blockHash: string;

  /** Gas used */
  gasUsed: number;

  /** Cumulative gas used */
  cumulativeGasUsed: number;

  /** Contract address (if deploying a contract) */
  contractAddress?: string;

  /** Transaction status (1 for success, 0 for failure) */
  status: number;

  /** Event logs */
  logs: {
    address: string;
    topics: string[];
    data: string;
  }[];
}

/**
 * Result of a blockchain transaction
 */
export interface TransactionResult {
  /** Whether transaction was successful */
  success: boolean;

  /** Transaction hash */
  hash: string;

  /** Full transaction receipt */
  receipt: TransactionReceipt;

  /** Additional data returned from transaction */
  extraData?: Record<string, unknown>;
}

/**
 * Network information
 */
export interface NetworkInfo {
  /** Network chain ID */
  chainId: number;

  /** Network name */
  name: string;

  /** Current block number */
  blockNumber: number;
}

/**
 * Evidence record with verification status
 */
export interface Evidence {
  /** Evidence ID */
  id: string;

  /** IPFS Content ID */
  cid: string;

  /** Evidence file hash */
  hash: string;

  /** Evidence description */
  description: string;

  /** Associated case ID */
  caseId: string;

  /** Address of uploader */
  uploader: string;

  /** Upload timestamp */
  timestamp: Date;

  /** Whether evidence has been verified */
  verified?: boolean;
}

/**
 * User roles in the system
 * These correspond to numeric values in the smart contract
 */
export type Role = number;

/**
 * Case access permissions
 */
export interface CaseAccess {
  /** Case ID */
  caseId: string;

  /** User address */
  userAddress: EthereumAddress;

  /** Access level */
  accessLevel: number;

  /** Whether user has write access */
  canWrite: boolean;

  /** Whether user can grant access to others */
  canGrant: boolean;
}

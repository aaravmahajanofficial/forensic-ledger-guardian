/**
 * Window object extensions for Web3/Ethereum integration
 *
 * @module Types/Window
 */

import { EthereumAddress } from "./blockchain";
// TransactionHash type will be used in future implementations
// import { TransactionHash, EthereumAddress } from "./blockchain";

/**
 * Ethereum Provider API
 * Based on EIP-1193
 */
interface EthereumProvider {
  /** Whether provider is MetaMask */
  isMetaMask?: boolean;

  /** Whether provider is CoinbaseWallet */
  isCoinbaseWallet?: boolean;

  /** Whether provider is WalletConnect */
  isWalletConnect?: boolean;

  /** Make a request to the provider */
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;

  /** Register an event handler */
  on: (event: string, callback: (...args: unknown[]) => void) => void;

  /** Remove a specific event handler */
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;

  /** Remove all event handlers for an event */
  removeAllListeners: (event: string) => void;

  /** Selected Ethereum chain ID */
  chainId?: string;

  /** Selected Ethereum account */
  selectedAddress?: EthereumAddress;
}

/**
 * Web3/Ethereum window extension
 */
interface Window {
  /** Ethereum provider injected by browser extensions like MetaMask */
  ethereum?: EthereumProvider;

  /** Global channel for application logging */
  forensicLogger?: {
    debug: (message: string, data?: Record<string, unknown>) => void;
    info: (message: string, data?: Record<string, unknown>) => void;
    warn: (message: string, data?: Record<string, unknown>) => void;
    error: (message: string, data?: Record<string, unknown>, error?: Error) => void;
  };
}

/**
 * Web3 Context for blockchain wallet integration and role-based access control
 *
 * @module Contexts/Web3Context
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import web3Service from "@/services/web3Service";
import { ROLES } from "@/constants";
import { logError, logDebug, logSecurityEvent } from "@/utils/logger";
import { toast } from "@/hooks/use-toast";
import { shortenAddress } from "@/utils/fileUtils";
import type { Role } from "@/types/blockchain";

/**
 * Interface defining the Web3 context API
 */
export interface Web3ContextType {
  /** Whether a wallet is currently connected */
  isConnected: boolean;

  /** The connected wallet account address */
  account: string | null;

  /** The role assigned to the current wallet */
  userRole: Role;

  /** Whether a connection attempt is in progress */
  connecting: boolean;

  /** Chain ID of the connected network */
  chainId: number | null;

  /** Connects to user's Web3 wallet */
  connectWallet: () => Promise<void>;

  /** Disconnects the current wallet */
  disconnectWallet: () => void;

  /** Checks if user has sufficient role-based access */
  checkRoleAccess: (requiredRole: Role) => boolean;

  /** Checks if we're on the correct network */
  isCorrectNetwork: boolean;

  /** Attempts to switch to the required network */
  switchNetwork: () => Promise<void>;
}

// Create the context with a meaningful undefined check
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

/**
 * Provider component to wrap your app with Web3 functionality
 */
export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State for wallet status
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(ROLES.None);
  const [connecting, setConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Calculate if we're on the correct network
  const isCorrectNetwork = useMemo(() => {
    if (!chainId) return false;
    return chainId === web3Service.getRequiredChainId();
  }, [chainId]);

  /**
   * Initial setup and event listeners
   */
  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const currentAccount = await web3Service.getCurrentAccount();
        if (currentAccount) {
          setAccount(currentAccount);
          setIsConnected(true);

          // Get user role and chain ID
          const [role, networkChainId] = await Promise.all([
            web3Service.getUserRole(),
            web3Service.getChainId(),
          ]);

          setUserRole(role);
          setChainId(networkChainId);

          logDebug(
            "Wallet reconnected",
            {
              account: currentAccount,
              role,
              chainId: networkChainId,
            },
            "BLOCKCHAIN"
          );
        }
      } catch (error) {
        logError(
          "Failed to check wallet connection",
          {},
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    checkConnection();

    // Set up event listeners if ethereum is available
    const setupListeners = () => {
      if (!window.ethereum) return;

      // Handle account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setIsConnected(false);
          setUserRole(ROLES.None);
          logSecurityEvent("Wallet disconnected by user");
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);

          // Update role when account changes
          web3Service.getUserRole().then((role) => {
            setUserRole(role);
            logSecurityEvent("Wallet account changed", {
              newAccount: accounts[0],
              newRole: role,
            });
          });
        }
      });

      // Handle chain changes
      window.ethereum.on("chainChanged", (newChainId: string) => {
        const numericChainId = parseInt(newChainId, 16);
        setChainId(numericChainId);

        logDebug(
          "Network changed",
          {
            chainId: numericChainId,
            requiredChainId: web3Service.getRequiredChainId(),
          },
          "BLOCKCHAIN"
        );

        // Refresh page on chain change as recommended by MetaMask
        window.location.reload();
      });
    };

    setupListeners();

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  /**
   * Connects to the user's Web3 wallet
   */
  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      const walletAccount = await web3Service.connectWallet();
      if (walletAccount) {
        setAccount(walletAccount);
        setIsConnected(true);

        // Get user role and chain ID
        const [role, networkChainId] = await Promise.all([
          web3Service.getUserRole(),
          web3Service.getChainId(),
        ]);

        setUserRole(role);
        setChainId(networkChainId);

        logSecurityEvent("Wallet connected", {
          account: walletAccount,
          role,
          chainId: networkChainId,
        });

        toast({
          title: "Wallet Connected",
          description: `Connected to account ${shortenAddress(walletAccount)}`,
        });
      }
    } catch (error) {
      logError(
        "Failed to connect wallet",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      toast({
        title: "Connection Failed",
        description:
          "Could not connect to wallet. Please make sure MetaMask is installed and unlocked.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  }, []);

  /**
   * Disconnects the current wallet
   */
  const disconnectWallet = useCallback(() => {
    if (account) {
      logSecurityEvent("User disconnected wallet", { account });
    }

    setAccount(null);
    setIsConnected(false);
    setUserRole(ROLES.None);
    setChainId(null);

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [account]);

  /**
   * Checks if the user has sufficient role-based access
   */
  const checkRoleAccess = useCallback(
    (requiredRole: Role): boolean => {
      // Court role has highest privileges, can access anything
      if (userRole === ROLES.Court) return true;

      // Special handling for specific role requirements
      if (requiredRole === ROLES.Authenticated) {
        // Any authenticated user with valid role can access
        return userRole !== ROLES.None;
      }

      // Otherwise, check if user has at least the required role
      return userRole >= requiredRole;
    },
    [userRole]
  );

  /**
   * Attempts to switch to the required network
   */
  const switchNetwork = useCallback(async (): Promise<void> => {
    if (isCorrectNetwork) return;

    try {
      await web3Service.switchToRequiredNetwork();
      // chainId will be updated via the chainChanged event
      toast({
        title: "Network Changed",
        description: "Successfully switched to the correct network.",
      });
    } catch (error) {
      logError(
        "Failed to switch network",
        { requiredChainId: web3Service.getRequiredChainId() },
        error instanceof Error ? error : new Error(String(error))
      );
      toast({
        title: "Network Switch Failed",
        description:
          "Could not switch to the required network. Please change networks manually in your wallet.",
        variant: "destructive",
      });
    }
  }, [isCorrectNetwork]);

  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(
    () => ({
      isConnected,
      account,
      userRole,
      connecting,
      chainId,
      connectWallet,
      disconnectWallet,
      checkRoleAccess,
      isCorrectNetwork,
      switchNetwork,
    }),
    [
      isConnected,
      account,
      userRole,
      connecting,
      chainId,
      connectWallet,
      disconnectWallet,
      checkRoleAccess,
      isCorrectNetwork,
      switchNetwork,
    ]
  );

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};

/**
 * Hook to access the Web3 context
 *
 * @throws Error if used outside of a Web3Provider
 * @returns The Web3Context value
 */
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

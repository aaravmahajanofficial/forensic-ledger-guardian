import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import web3Service, { Role } from "@/services/web3Service";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";

interface NetworkInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  userRole: Role;
  connecting: boolean;
  balance: string;
  chainId: string | null;
  networkName: string;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshRole: () => Promise<void>;
  checkRoleAccess: (requiredRole: Role) => boolean;
  switchNetwork: (targetChainId: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  addNetwork: (network: NetworkInfo) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Network configurations
const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
  "0x1": {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  "0xaa36a7": {
    chainId: "0xaa36a7",
    chainName: "Sepolia Testnet",
    nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
  "0x7a69": {
    chainId: "0x7a69",
    chainName: "Anvil Local",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: [""],
  },
};

// Expected network for the contract deployment
const EXPECTED_CHAIN_ID = "0xaa36a7"; // Sepolia testnet

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(Role.None);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState("0.0");
  const [chainId, setChainId] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState("Unknown");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Get network info from chain ID
  const getNetworkInfo = useCallback((chainId: string): NetworkInfo | null => {
    return SUPPORTED_NETWORKS[chainId] || null;
  }, []);

  // Update network information
  const updateNetworkInfo = useCallback(
    (chainId: string) => {
      setChainId(chainId);
      const networkInfo = getNetworkInfo(chainId);
      setNetworkName(networkInfo?.chainName || "Unknown Network");
      setIsCorrectNetwork(chainId === EXPECTED_CHAIN_ID);
    },
    [getNetworkInfo]
  );

  // Fetch wallet balance
  const refreshBalance = useCallback(async () => {
    if (!account || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0.0");
    }
  }, [account]);

  // Refresh user role from blockchain (blockchain is source of truth)
  const refreshRole = useCallback(async () => {
    if (!account) {
      setUserRole(Role.None);
      return;
    }

    try {
      console.log("Web3Context: Refreshing role for account:", account);

      // Use blockchain role as the source of truth
      const blockchainRole = await web3Service.getUserRole();
      console.log(
        "Web3Context: Blockchain role:",
        web3Service.getRoleString(blockchainRole)
      );

      if (blockchainRole === Role.None) {
        // Check if user is contract owner
        const isOwner = await web3Service.isContractOwner();
        if (isOwner) {
          console.log(
            "Web3Context: Contract owner detected, initializing admin role..."
          );
          const initSuccess = await web3Service.initializeAdminRole();
          if (initSuccess) {
            const newRole = await web3Service.getUserRole();
            setUserRole(newRole);
            console.log(
              "Web3Context: Admin role initialized, role:",
              web3Service.getRoleString(newRole)
            );
          } else {
            setUserRole(Role.None);
          }
        } else {
          // Check database for role and try to sync
          try {
            const { roleManagementService } = await import(
              "@/services/roleManagementService"
            );
            const dbRole = await roleManagementService.getRoleForWallet(
              account
            );

            if (dbRole !== Role.None) {
              console.log(
                "Web3Context: Found database role:",
                web3Service.getRoleString(dbRole),
                "but blockchain role is None. Attempting to sync..."
              );

              // Try to sync role (this will only work if current user has permission)
              const syncSuccess = await web3Service.syncUserRole(
                account,
                dbRole
              );
              if (syncSuccess) {
                const updatedRole = await web3Service.getUserRole();
                setUserRole(updatedRole);
                console.log(
                  "Web3Context: Role synced successfully:",
                  web3Service.getRoleString(updatedRole)
                );
              } else {
                console.log("Web3Context: Role sync failed, using None");
                setUserRole(Role.None);
              }
            } else {
              setUserRole(Role.None);
            }
          } catch (error) {
            console.error("Web3Context: Error checking database role:", error);
            setUserRole(Role.None);
          }
        }
      } else {
        // Use blockchain role
        setUserRole(blockchainRole);

        // Optionally update database to match blockchain (for consistency)
        try {
          const { roleManagementService } = await import(
            "@/services/roleManagementService"
          );
          const dbRole = await roleManagementService.getRoleForWallet(account);

          if (dbRole !== blockchainRole && dbRole !== Role.None) {
            console.log(
              `Web3Context: Database role (${web3Service.getRoleString(
                dbRole
              )}) differs from blockchain role (${web3Service.getRoleString(
                blockchainRole
              )}). Database will be treated as secondary.`
            );
          }
        } catch (error) {
          console.error(
            "Web3Context: Error checking database role for sync:",
            error
          );
        }
      }
    } catch (error) {
      console.error("Web3Context: Error refreshing user role:", error);
      setUserRole(Role.None);
    }
  }, [account]);

  // Fetch and update role for a given account
  const fetchAndSetRole = useCallback(async (targetAccount: string) => {
    try {
      console.log("Web3Context: Fetching fresh role data for:", targetAccount);

      // Use blockchain role as the source of truth
      const blockchainRole = await web3Service.getUserRole();
      console.log(
        "Web3Context: Blockchain role:",
        web3Service.getRoleString(blockchainRole)
      );

      if (blockchainRole === Role.None) {
        // Check if user is contract owner
        const isOwner = await web3Service.isContractOwner();
        if (isOwner) {
          console.log(
            "Web3Context: Contract owner detected, initializing admin role..."
          );
          const initSuccess = await web3Service.initializeAdminRole();
          if (initSuccess) {
            const newRole = await web3Service.getUserRole();
            setUserRole(newRole);
            console.log(
              "Web3Context: Admin role initialized, role:",
              web3Service.getRoleString(newRole)
            );
            return;
          }
        }

        // Check database for role and try to sync
        try {
          const { roleManagementService } = await import(
            "@/services/roleManagementService"
          );
          const dbRole = await roleManagementService.getRoleForWallet(
            targetAccount
          );

          if (dbRole !== Role.None) {
            console.log(
              "Web3Context: Found database role:",
              web3Service.getRoleString(dbRole),
              "but blockchain role is None. Attempting to sync..."
            );

            // Try to sync role (this will only work if current user has permission)
            const syncSuccess = await web3Service.syncUserRole(
              targetAccount,
              dbRole
            );
            if (syncSuccess) {
              const updatedRole = await web3Service.getUserRole();
              setUserRole(updatedRole);
              console.log(
                "Web3Context: Role synced successfully:",
                web3Service.getRoleString(updatedRole)
              );
              return;
            }
          }
        } catch (error) {
          console.error("Web3Context: Error checking database role:", error);
        }

        setUserRole(Role.None);
      } else {
        // Use blockchain role
        setUserRole(blockchainRole);
      }
    } catch (error) {
      console.error("Web3Context: Error fetching user role:", error);
      setUserRole(Role.None);
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
        setUserRole(Role.None);
        setBalance("0.0");
        console.log("Web3Context: Account disconnected");
      } else {
        const newAccount = accounts[0];
        console.log("Web3Context: Account changed to:", newAccount);
        setAccount(newAccount);
        setIsConnected(true);

        // Reset role to None initially, then fetch the actual role
        setUserRole(Role.None);

        // Fetch role asynchronously without setTimeout
        fetchAndSetRole(newAccount);
      }
    },
    [fetchAndSetRole]
  );

  // Handle network changes
  const handleChainChanged = useCallback(
    (chainId: string) => {
      console.log("Web3Context: Network changed to:", chainId);
      updateNetworkInfo(chainId);

      if (chainId !== EXPECTED_CHAIN_ID) {
        toast({
          title: "Network Warning",
          description: `You're connected to an unsupported network. Please switch to Sepolia testnet.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Network Connected",
          description: "Connected to supported network.",
        });
      }
    },
    [updateNetworkInfo]
  );

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      console.log("Web3Context: Checking existing connection...");

      if (!window.ethereum) {
        console.log("Web3Context: No MetaMask detected");
        return;
      }

      try {
        // Get current chain ID
        const currentChainId = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;
        updateNetworkInfo(currentChainId);

        // First test if contract connection works
        const contractConnected = await web3Service.testContractConnection();
        if (contractConnected) {
          const currentAccount = await web3Service.getCurrentAccount();
          if (currentAccount) {
            console.log(
              "Web3Context: Found existing connection:",
              currentAccount
            );
            setAccount(currentAccount);
            setIsConnected(true);

            // Get user role with proper error handling
            await refreshRole();

            // Fetch balance
            refreshBalance();
          }
        } else {
          console.log("Web3Context: No existing connection found");
        }
      } catch (error) {
        console.error("Web3Context: Error checking connection:", error);
      }
    };

    checkConnection();

    // Listen for account and network changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    // Listen for force refresh events
    const handleForceRefresh = () => {
      console.log("Web3Context: Force refresh triggered");
      if (account) {
        refreshRole();
      }
    };

    window.addEventListener("forceRoleRefresh", handleForceRefresh);

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
      window.removeEventListener("forceRoleRefresh", handleForceRefresh);
    };
  }, [
    handleAccountsChanged,
    handleChainChanged,
    updateNetworkInfo,
    refreshBalance,
    account,
    refreshRole,
  ]);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      console.log("Web3Context: Connecting wallet...");

      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }

      if (!window.ethereum.isMetaMask) {
        throw new Error("Please use MetaMask to connect your wallet.");
      }

      // Check current network first
      const currentChainId = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      updateNetworkInfo(currentChainId);

      // Connect to wallet
      const account = await web3Service.connectWallet();
      if (account) {
        console.log("Web3Context: Wallet connected successfully:", account);
        setAccount(account);
        setIsConnected(true);

        // Get user role with proper error handling
        try {
          const role = await web3Service.getUserRole();
          console.log(
            "Web3Context: User role after connection:",
            web3Service.getRoleString(role)
          );

          // If user has no role but is the contract owner, offer to initialize
          if (role === Role.None) {
            const isOwner = await web3Service.isContractOwner();
            if (isOwner) {
              console.log(
                "Web3Context: Contract owner detected, initializing admin role..."
              );
              const initSuccess = await web3Service.initializeAdminRole();
              if (initSuccess) {
                const newRole = await web3Service.getUserRole();
                setUserRole(newRole);
                toast({
                  title: "Admin Role Initialized",
                  description: `Welcome, contract owner! You now have ${web3Service.getRoleString(
                    newRole
                  )} privileges.`,
                });
              } else {
                setUserRole(Role.None);
                toast({
                  title: "Initialization Failed",
                  description:
                    "Failed to initialize admin role. Please try again.",
                  variant: "destructive",
                });
              }
            } else {
              setUserRole(Role.None);
              toast({
                title: "No Role Assigned",
                description:
                  "Your wallet is connected but you don't have a role assigned. Please contact an administrator for access.",
                variant: "default",
              });
            }
          } else {
            setUserRole(role);
            toast({
              title: "Role Confirmed",
              description: `Welcome! You are logged in as ${web3Service.getRoleString(
                role
              )}.`,
            });
          }
        } catch (roleError) {
          console.error("Web3Context: Error fetching user role:", roleError);
          setUserRole(Role.None);
          toast({
            title: "Role Check Failed",
            description:
              "Could not determine your role. Please try reconnecting or contact support.",
            variant: "destructive",
          });
        }

        // Fetch balance
        await refreshBalance();

        toast({
          title: "Wallet Connected",
          description: `Connected to account ${account.substring(
            0,
            6
          )}...${account.substring(account.length - 4)}`,
        });

        // Warn if on wrong network
        if (currentChainId !== EXPECTED_CHAIN_ID) {
          toast({
            title: "Network Warning",
            description:
              "You're on an unsupported network. Please switch to Sepolia testnet.",
            variant: "destructive",
          });
        }
      } else {
        console.error("Web3Context: Failed to get account after connection");
        throw new Error("Failed to get account");
      }
    } catch (error) {
      console.error("Web3Context: Failed to connect wallet:", error);
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setUserRole(Role.None);
    setBalance("0.0");
    setChainId(null);
    setNetworkName("Unknown");
    setIsCorrectNetwork(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Switch to specific network
  const switchNetwork = async (targetChainId: string) => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError: unknown) {
      // This error code indicates that the chain has not been added to MetaMask
      if (
        switchError &&
        typeof switchError === "object" &&
        "code" in switchError &&
        switchError.code === 4902
      ) {
        const networkInfo = getNetworkInfo(targetChainId);
        if (networkInfo) {
          await addNetwork(networkInfo);
        } else {
          throw new Error("Unsupported network");
        }
      } else {
        throw switchError;
      }
    }
  };

  // Add network to MetaMask
  const addNetwork = async (network: NetworkInfo) => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [network],
      });
    } catch (addError) {
      console.error("Failed to add network:", addError);
      throw new Error("Failed to add network to MetaMask");
    }
  };

  const checkRoleAccess = (requiredRole: Role): boolean => {
    // Court role has highest privileges, can access anything
    if (userRole === Role.Court) return true;

    // Otherwise, check if user has at least the required role
    return userRole >= requiredRole;
  };

  // React 19: Render context directly without Provider
  return (
    <Web3Context
      value={{
        isConnected,
        account,
        userRole,
        connecting,
        balance,
        chainId,
        networkName,
        isCorrectNetwork,
        connectWallet,
        disconnectWallet,
        refreshRole,
        checkRoleAccess,
        switchNetwork,
        refreshBalance,
        addNetwork,
      }}
    >
      {children}
    </Web3Context>
  );
};

export { Web3Context };

// Custom hook to use the Web3 context
// eslint-disable-next-line react-refresh/only-export-components
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

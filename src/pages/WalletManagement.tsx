import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Network,
  Shield,
  History,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetaMaskStatusComponent from "@/components/blockchain/MetaMaskStatus";
import web3Service from "@/services/web3Service";

interface Transaction {
  hash: string;
  type: string;
  status: string;
  timestamp: string;
  value: string;
}

const WalletManagement: React.FC = () => {
  const {
    isConnected,
    account,
    balance,
    chainId,
    networkName,
    isCorrectNetwork,
    userRole,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    addNetwork,
  } = useWeb3();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);

  useEffect(() => {
    const loadRecentTransactions = async () => {
      setIsLoadingTx(true);
      try {
        const txs = await getRecentTransactions(account || "");
        setTransactions(txs);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setIsLoadingTx(false);
      }
    };
    if (isConnected && account) {
      setTimeout(() => loadRecentTransactions(), 0);
    }
  }, [isConnected, account]);

  const loadRecentTransactions_old = async () => {
    setIsLoadingTx(true);
    try {
      // This would typically fetch from a blockchain explorer API
      // For now, we'll show a placeholder
      setTransactions([
        {
          hash: "0x1234...abcd",
          type: "Evidence Upload",
          status: "Success",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          value: "0.001",
        },
        {
          hash: "0x5678...efgh",
          type: "Case Creation",
          status: "Success",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          value: "0.002",
        },
      ]);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoadingTx(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const openInExplorer = (hash: string) => {
    const explorerUrl = isCorrectNetwork
      ? `https://sepolia.etherscan.io/tx/${hash}`
      : `https://etherscan.io/tx/${hash}`;
    window.open(explorerUrl, "_blank");
  };

  const handleAddSepoliaNetwork = async () => {
    try {
      await addNetwork({
        chainId: "0xaa36a7",
        chainName: "Sepolia Testnet",
        nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        blockExplorerUrls: ["https://sepolia.etherscan.io/"],
      });
      toast({
        title: "Network Added",
        description: "Sepolia testnet has been added to MetaMask.",
      });
    } catch (error) {
      toast({
        title: "Failed to Add Network",
        description: "Could not add Sepolia testnet to MetaMask.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet Management</h1>
          <p className="text-muted-foreground">
            Manage your MetaMask wallet and blockchain interactions
          </p>
        </div>
        {isConnected && (
          <Button onClick={refreshBalance} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* MetaMask Status Card */}
      <MetaMaskStatusComponent />

      {isConnected ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account">Wallet Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="account"
                        value={account || ""}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(account || "")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Balance</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={`${parseFloat(balance).toFixed(6)} ETH`}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={refreshBalance}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isCorrectNetwork ? "default" : "destructive"}
                      >
                        {isCorrectNetwork ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {networkName}
                      </Badge>
                      {!isCorrectNetwork && (
                        <Button
                          size="sm"
                          onClick={() => switchNetwork("0xaa36a7")}
                        >
                          Switch to Sepolia
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-forensic-accent" />
                      <Badge>{web3Service.getRoleString(userRole)}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            {/* Network Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Management
                </CardTitle>
                <CardDescription>
                  Manage your blockchain network connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Current Network</h3>
                        <p className="text-sm text-muted-foreground">
                          {networkName}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          Chain ID: {chainId}
                        </p>
                      </div>
                      <Badge
                        variant={isCorrectNetwork ? "default" : "destructive"}
                      >
                        {isCorrectNetwork ? "Supported" : "Unsupported"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sepolia Testnet</h3>
                        <p className="text-sm text-muted-foreground">
                          Recommended for testing
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                          Chain ID: 0xaa36a7
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddSepoliaNetwork}
                        >
                          Add Network
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => switchNetwork("0xaa36a7")}
                          disabled={chainId === "0xaa36a7"}
                        >
                          Switch
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Your recent blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTx ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((tx, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {tx.hash}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tx.status === "Success"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {tx.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInExplorer(tx.hash)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Wallet Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Wallet Settings
                </CardTitle>
                <CardDescription>
                  Manage your wallet connection and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Wallet Connection</h3>
                      <p className="text-sm text-muted-foreground">
                        Disconnect your wallet from this application
                      </p>
                    </div>
                    <Button variant="destructive" onClick={disconnectWallet}>
                      Disconnect Wallet
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Auto-refresh Balance</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh wallet balance every 30 seconds
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center p-8">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Wallet Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your MetaMask wallet to access the full functionality
            </p>
            <Button onClick={connectWallet}>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletManagement;

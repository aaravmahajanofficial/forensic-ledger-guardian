import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "@/hooks/use-toast";

interface MetaMaskStatusComponentProps {
  showDetails?: boolean;
}

const MetaMaskStatusComponent: React.FC<MetaMaskStatusComponentProps> = ({
  showDetails = true,
}) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(
    () => typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
  const [isMetaMaskUnlocked, setIsMetaMaskUnlocked] = useState(false);
  const { isConnected, chainId, networkName, isCorrectNetwork, switchNetwork } =
    useWeb3();

  const checkMetaMaskStatus = useCallback(async () => {
    const installed =
      typeof window !== "undefined" && typeof window.ethereum !== "undefined";
    let unlocked = false;

    if (installed) {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];
        unlocked = accounts.length > 0;
      } catch (error) {
        unlocked = false;
      }
    } else {
      await Promise.resolve();
    }

    setIsMetaMaskInstalled(installed);
    setIsMetaMaskUnlocked(unlocked);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      if (isMounted) {
        await checkMetaMaskStatus();
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [checkMetaMaskStatus]);

  const installMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  const handleSwitchToSepolia = async () => {
    try {
      await switchNetwork("0xaa36a7");
      toast({
        title: "Network Switched",
        description: "Successfully switched to Sepolia testnet.",
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast({
        title: "Network Switch Failed",
        description: "Could not switch to Sepolia testnet.",
        variant: "destructive",
      });
    }
  };

  if (!showDetails) {
    // Compact status indicator
    return (
      <div className="flex items-center gap-2">
        {isMetaMaskInstalled ? (
          <Badge
            variant={isConnected && isCorrectNetwork ? "default" : "secondary"}
          >
            <Wallet className="h-3 w-3 mr-1" />
            {isConnected
              ? isCorrectNetwork
                ? "Connected"
                : "Wrong Network"
              : "Not Connected"}
          </Badge>
        ) : (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            No MetaMask
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          MetaMask Status
        </CardTitle>
        <CardDescription>
          Check your wallet connection and network status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MetaMask Installation Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            {isMetaMaskInstalled ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">MetaMask Installation</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isMetaMaskInstalled ? "default" : "destructive"}>
              {isMetaMaskInstalled ? "Installed" : "Not Installed"}
            </Badge>
            {!isMetaMaskInstalled && (
              <Button size="sm" onClick={installMetaMask}>
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
            )}
          </div>
        </div>

        {/* Wallet Lock Status */}
        {isMetaMaskInstalled && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {isMetaMaskUnlocked ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-medium">Wallet Status</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMetaMaskUnlocked ? "default" : "secondary"}>
                {isMetaMaskUnlocked ? "Unlocked" : "Locked"}
              </Badge>
              <Button size="sm" variant="outline" onClick={checkMetaMaskStatus}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {isMetaMaskInstalled && isMetaMaskUnlocked && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-medium">Connection</span>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
        )}

        {/* Network Status */}
        {isConnected && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {isCorrectNetwork ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <span className="font-medium">Network</span>
                <p className="text-sm text-muted-foreground">{networkName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
                {isCorrectNetwork ? "Correct" : "Wrong Network"}
              </Badge>
              {!isCorrectNetwork && (
                <Button size="sm" onClick={handleSwitchToSepolia}>
                  Switch
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!isMetaMaskInstalled && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              MetaMask is required to use this application. Please install the
              browser extension to continue.
            </p>
          </div>
        )}

        {isMetaMaskInstalled && !isMetaMaskUnlocked && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please unlock your MetaMask wallet to continue.
            </p>
          </div>
        )}

        {isConnected && !isCorrectNetwork && (
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              You're connected to the wrong network. Please switch to Sepolia
              testnet for the best experience.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaMaskStatusComponent;

import React from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Wallet, LogOut, Loader2, Shield } from "lucide-react";
import { ROLE_NAMES } from "@/constants";

// Role mapping helper
const getRoleString = (role: number): string => {
  return ROLE_NAMES[role as keyof typeof ROLE_NAMES] || "Unknown";
};

const WalletConnect: React.FC = () => {
  const {
    isConnected,
    account,
    userRole,
    connecting,
    connectWallet,
    disconnectWallet,
  } = useWeb3();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <div className="hidden md:flex items-center gap-2 bg-forensic-50 px-3 py-1 rounded-lg text-sm font-medium text-forensic-800">
            <Shield className="h-3.5 w-3.5 text-forensic-accent" />
            <span>Role: {getRoleString(userRole)}</span>
          </div>

          <div className="hidden sm:block text-sm font-mono bg-forensic-50 px-3 py-1 rounded-lg text-forensic-800">
            {account?.substring(0, 6)}...
            {account?.substring(account.length - 4)}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="border-forensic-300"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden md:inline">Disconnect</span>
          </Button>
        </>
      ) : (
        <Button
          onClick={connectWallet}
          size="sm"
          disabled={connecting}
          className="bg-forensic-accent hover:bg-forensic-accent/90"
        >
          {connecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-1" />
              <span>Connect Wallet</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;

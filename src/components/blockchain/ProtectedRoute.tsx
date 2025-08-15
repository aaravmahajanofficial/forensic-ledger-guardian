import type { FC, ReactNode } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Role } from "@/services/web3Service";
import { Navigate } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: Role;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isConnected, checkRoleAccess } = useWeb3();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <div className="bg-forensic-50 p-8 rounded-lg shadow-md text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-forensic-400" />
          <h2 className="text-xl font-bold text-forensic-800 mb-2">
            Wallet Connection Required
          </h2>
          <p className="text-forensic-600 mb-6">
            Connect your Ethereum wallet to access this secure area of the
            forensic platform.
          </p>
          <p className="text-sm text-forensic-500 mt-4">
            This section requires blockchain authentication to maintain a secure
            chain of custody.
          </p>
        </div>
      </div>
    );
  }

  if (!checkRoleAccess(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <div className="bg-red-50 p-8 rounded-lg shadow-md text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-6">
            You don't have the required role to access this section.
          </p>
          <p className="text-sm text-red-500 mt-4">
            This section requires higher permission levels on the blockchain.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

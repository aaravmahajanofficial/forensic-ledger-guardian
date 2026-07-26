import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { roleManagementService } from "@/services/roleManagementService";
import web3Service, { Role } from "@/services/web3Service";
import {
  Shield,
  Database,
  Link,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import AuthResetButton from "@/components/auth/AuthResetButton";

const RoleDebugger = () => {
  const [dbRole, setDbRole] = useState<Role>(Role.None);
  const [blockchainRole, setBlockchainRole] = useState<Role>(Role.None);
  const [isAssigned, setIsAssigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [contractOwner, setContractOwner] = useState<string>("");
  const [targetAddress, setTargetAddress] = useState("");
  const [targetRole, setTargetRole] = useState<Role>(Role.None);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const { account, userRole } = useWeb3();
  const { user } = useAuth();
  const { toast } = useToast();

  const checkRoles = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      // Check database role
      const dbUserRole = await roleManagementService.getRoleForWallet(account);
      setDbRole(dbUserRole);

      // Check if wallet is assigned
      const assigned = await roleManagementService.isWalletAssigned(account);
      setIsAssigned(assigned);

      // Check blockchain role
      const blockchainUserRole = await web3Service.getUserRole();
      setBlockchainRole(blockchainUserRole);

      // Check ownership status
      const owner = await web3Service.getContractOwner();
      const isOwnerCheck = await web3Service.isContractOwner();
      setContractOwner(owner || "");
      setIsOwner(isOwnerCheck);
    } catch (error) {
      console.error("Error checking roles:", error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      setTimeout(() => checkRoles(), 0);
    }
  }, [account, checkRoles]);

  const getRoleName = (role: Role): string => {
    switch (role) {
      case Role.Court:
        return "Court Official";
      case Role.Officer:
        return "Police Officer";
      case Role.Forensic:
        return "Forensic Expert";
      case Role.Lawyer:
        return "Legal Counsel";
      default:
        return "None";
    }
  };

  const getRoleColor = (role: Role): string => {
    switch (role) {
      case Role.Court:
        return "bg-purple-100 text-purple-800";
      case Role.Officer:
        return "bg-blue-100 text-blue-800";
      case Role.Forensic:
        return "bg-green-100 text-green-800";
      case Role.Lawyer:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isRoleMismatch =
    dbRole !== blockchainRole &&
    dbRole !== Role.None &&
    blockchainRole !== Role.None;

  const handleResetRole = async () => {
    if (!targetAddress) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await web3Service.resetUserRole(targetAddress);
      if (success) {
        toast({
          title: "Success",
          description: `Role reset for ${targetAddress}`,
        });
        await checkRoles(); // Refresh the data
      } else {
        toast({
          title: "Failed",
          description: "Failed to reset role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error resetting role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async () => {
    if (!targetAddress) {
      toast({
        title: "Error",
        description: "Please enter an address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await web3Service.setGlobalRole(
        targetAddress,
        targetRole,
      );
      if (success) {
        toast({
          title: "Success",
          description: `Role set to ${web3Service.getRoleString(
            targetRole,
          )} for ${targetAddress}`,
        });
        await checkRoles(); // Refresh the data
      } else {
        toast({
          title: "Failed",
          description: "Failed to set role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error setting role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Assignment Debugger
        </CardTitle>
        <CardDescription>
          Debug and verify role assignments for the current wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current User Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-700">Current User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Connected Wallet</p>
              <p className="font-mono text-sm">
                {account
                  ? `${account.substring(0, 6)}...${account.substring(
                      account.length - 4,
                    )}`
                  : "Not connected"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Auth User</p>
              <p className="text-sm">{user ? user.name : "Not logged in"}</p>
            </div>
          </div>
        </div>

        {account && (
          <>
            {/* Role Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-700">
                  Role Status
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={checkRoles}
                    disabled={loading}
                  >
                    {loading ? "Checking..." : "Refresh"}
                  </Button>
                  <AuthResetButton variant="outline" size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Database Role */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <Badge className={getRoleColor(dbRole)}>
                    {getRoleName(dbRole)}
                  </Badge>
                </div>

                {/* Blockchain Role */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Blockchain</span>
                  </div>
                  <Badge className={getRoleColor(blockchainRole)}>
                    {getRoleName(blockchainRole)}
                  </Badge>
                </div>

                {/* Active Role */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <Badge className={getRoleColor(userRole)}>
                    {getRoleName(userRole)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700">
                Status Checks
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isAssigned ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    Wallet {isAssigned ? "is" : "is not"} assigned in database
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {blockchainRole !== Role.None ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    Wallet{" "}
                    {blockchainRole !== Role.None ? "has" : "does not have"}{" "}
                    blockchain role
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isRoleMismatch ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    Roles are {isRoleMismatch ? "mismatched" : "synchronized"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {(dbRole === Role.None || isRoleMismatch) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-sm text-yellow-800 mb-2">
                  Recommendations
                </h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  {dbRole === Role.None && (
                    <p>
                      • Contact administrator to assign a role to this wallet
                      address
                    </p>
                  )}
                  {isRoleMismatch && (
                    <p>
                      • Administrator should update blockchain role to match
                      database role
                    </p>
                  )}
                  {blockchainRole === Role.None && dbRole !== Role.None && (
                    <p>
                      • Blockchain role needs to be assigned to enable full
                      functionality
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Contract Ownership</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Contract Owner:</span>
                  <p className="font-mono text-xs mt-1">
                    {contractOwner || "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">You are Owner:</span>
                  <div className="mt-1">
                    <Badge variant={isOwner ? "default" : "outline"}>
                      {isOwner ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Tools (Only for Owner) */}
            {isOwner && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Admin Tools
                  </h4>
                  <Button
                    onClick={() => setShowAdminTools(!showAdminTools)}
                    variant="outline"
                    size="sm"
                  >
                    {showAdminTools ? "Hide" : "Show"}
                  </Button>
                </div>

                {showAdminTools && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="targetAddress">Target Address</Label>
                      <Input
                        id="targetAddress"
                        placeholder="0x..."
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetRole">Role to Set</Label>
                      <select
                        id="targetRole"
                        className="w-full p-2 border rounded-md"
                        value={targetRole}
                        onChange={(e) =>
                          setTargetRole(Number(e.target.value) as Role)
                        }
                      >
                        <option value={Role.None}>None</option>
                        <option value={Role.Court}>Court</option>
                        <option value={Role.Officer}>Officer</option>
                        <option value={Role.Forensic}>Forensic</option>
                        <option value={Role.Lawyer}>Lawyer</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSetRole}
                        disabled={loading}
                        size="sm"
                        className="flex-1"
                      >
                        Set Role
                      </Button>
                      <Button
                        onClick={handleResetRole}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Reset to None
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setTargetAddress(account || "")}
                        variant="outline"
                        size="sm"
                      >
                        Use My Address
                      </Button>
                      <Button onClick={checkRoles} variant="outline" size="sm">
                        Refresh All
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Good */}
            {dbRole !== Role.None &&
              !isRoleMismatch &&
              blockchainRole !== Role.None && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-sm text-green-800">
                      All Systems Operational
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Role assignments are properly configured and synchronized.
                  </p>
                </div>
              )}
          </>
        )}

        {!account && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Connect your wallet to check role assignments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleDebugger;

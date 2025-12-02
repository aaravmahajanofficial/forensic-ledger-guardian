import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { useAuth } from "@/contexts/AuthContext";
import web3Service, { Role } from "@/services/web3Service";
import {
  roleManagementService,
  RoleAssignment,
} from "@/services/roleManagementService";
import { Shield, Crown, UserPlus, CheckCircle, Trash2 } from "lucide-react";
import RoleDebugger from "@/components/admin/debug/RoleDebugger";

const OwnerBootstrap = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isCourtAdmin, setIsCourtAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(Role.Officer);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { account, userRole } = useWeb3();
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRoleAssignments = useCallback(async () => {
    setRefreshing(true);
    try {
      const assignments = await roleManagementService.getAllRoleAssignments();
      setRoleAssignments(assignments);
    } catch (error) {
      console.error("Error loading role assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load role assignments",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // Check if current user is contract owner or court admin
  useEffect(() => {
    const checkPermissions = async () => {
      setIsLoading(true);

      try {
        console.log("Checking permissions for user:", user);

        // Check if user is court admin (can access via email/password login)
        if (user && user.id && !user.id.startsWith("wallet-")) {
          console.log("Checking court admin status for user:", user);

          // Check if user has court-related role title (more flexible check)
          const hasCourtRole =
            user.roleTitle.toLowerCase().includes("court") ||
            user.roleTitle.toLowerCase().includes("judge") ||
            user.roleTitle.toLowerCase().includes("admin");

          if (hasCourtRole) {
            console.log("User has court-related role, granting access");
            setIsCourtAdmin(true);
            await loadRoleAssignments();
            setIsLoading(false);
            return;
          }

          // Then check database
          try {
            const isAdmin = await roleManagementService.isCourtAdmin(user.id);
            console.log("Database court admin check result:", isAdmin);
            setIsCourtAdmin(isAdmin);

            if (isAdmin) {
              await loadRoleAssignments();
              setIsLoading(false);
              return;
            }
          } catch (dbError) {
            console.error("Database check failed:", dbError);

            // If database check fails but user has court-related title, allow access
            if (hasCourtRole) {
              console.log("Falling back to role title check");
              setIsCourtAdmin(true);
              await loadRoleAssignments();
              setIsLoading(false);
              return;
            }
          }
        }

        // Check if user is contract owner (for wallet-based access)
        if (account && web3Service.isContractConnected()) {
          console.log("Checking contract owner status for account:", account);
          const contractOwner = await web3Service.getContractOwner();
          if (contractOwner) {
            const isCurrentUserOwner =
              account.toLowerCase() === contractOwner.toLowerCase();
            console.log("Contract owner check result:", isCurrentUserOwner);
            setIsOwner(isCurrentUserOwner);

            if (isCurrentUserOwner) {
              setWalletAddress(account);
              await loadRoleAssignments();
            }
          }
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [account, user, loadRoleAssignments]);
  const handleAssignRole = async () => {
    if (!walletAddress || (!web3Service && !user)) {
      toast({
        title: "Error",
        description: "Please enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }

    setAssigning(true);
    try {
      // Check if wallet is already assigned
      const isAssigned = await roleManagementService.isWalletAssigned(
        walletAddress
      );
      if (isAssigned) {
        toast({
          title: "Already Assigned",
          description: "This wallet address is already assigned to a role",
          variant: "destructive",
        });
        setAssigning(false);
        return;
      }

      // Assign role in database first
      const assignedBy = user?.email || account || "system";
      const dbSuccess = await roleManagementService.assignWalletToRole(
        walletAddress,
        selectedRole,
        assignedBy
      );

      if (!dbSuccess) {
        throw new Error("Failed to assign role in database");
      }

      // If blockchain is connected, also assign role on blockchain
      let blockchainSuccess = true;
      if (web3Service.isContractConnected() && account) {
        blockchainSuccess = await web3Service.setGlobalRole(
          walletAddress,
          selectedRole
        );

        if (!blockchainSuccess) {
          toast({
            title: "Partial Success",
            description:
              "Role assigned in database, but blockchain assignment failed. The user can still login.",
            variant: "default",
          });
        }
      }

      toast({
        title: "Role Assigned Successfully",
        description: `${getRoleTitle(
          selectedRole
        )} role assigned to ${walletAddress}`,
      });

      // Refresh the assignments list
      await loadRoleAssignments();

      // Clear the form
      setWalletAddress("");
      setSelectedRole(Role.Officer);
    } catch (error) {
      console.error("Role assignment error:", error);
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not assign role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleRevokeRole = async (walletAddress: string) => {
    try {
      const success = await roleManagementService.revokeWalletAssignment(
        walletAddress
      );

      if (success) {
        toast({
          title: "Role Revoked",
          description: `Role revoked for ${walletAddress}`,
        });
        await loadRoleAssignments();
      } else {
        throw new Error("Failed to revoke role");
      }
    } catch (error) {
      console.error("Role revocation error:", error);
      toast({
        title: "Revocation Failed",
        description: "Could not revoke role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBootstrapSelf = async () => {
    if (!account) return;

    setWalletAddress(account);
    setSelectedRole(Role.Court);

    // Small delay to ensure state updates
    setTimeout(() => {
      handleAssignRole();
    }, 100);
  };

  const getRoleTitle = (role: Role): string => {
    switch (role) {
      case Role.Court:
        return "Court Official (Administrator)";
      case Role.Officer:
        return "Police Officer";
      case Role.Forensic:
        return "Forensic Expert";
      case Role.Lawyer:
        return "Legal Counsel";
      default:
        return "Unknown Role";
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug information card
  const debugInfo = (
    <Card className="max-w-4xl mx-auto mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>
          <strong>User ID:</strong> {user?.id || "Not available"}
        </p>
        <p>
          <strong>User Email:</strong> {user?.email || "Not available"}
        </p>
        <p>
          <strong>User Name:</strong> {user?.name || "Not available"}
        </p>
        <p>
          <strong>User Role:</strong> {user?.role} (
          {user?.roleTitle || "Not available"})
        </p>
        <p>
          <strong>Connected Wallet:</strong> {account || "Not connected"}
        </p>
        <p>
          <strong>Is Court Admin:</strong> {isCourtAdmin ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Contract Owner:</strong> {isOwner ? "Yes" : "No"}
        </p>
        <p>
          <strong>User ID starts with wallet:</strong>{" "}
          {user?.id?.startsWith("wallet-") ? "Yes" : "No"}
        </p>
      </CardContent>
    </Card>
  );

  if (!isOwner && !isCourtAdmin) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {debugInfo}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You are not authorized to access this page. Only the contract
              owner or court administrator can manage role assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Your wallet:</strong> {account || "Not connected"}
              </p>
              <p>
                <strong>Current role:</strong>{" "}
                {userRole !== undefined
                  ? getRoleTitle(userRole)
                  : user?.roleTitle || "None"}
              </p>
              <p className="text-red-600">
                Contact the system administrator to get access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {debugInfo}

      {/* Admin Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Crown className="h-5 w-5" />
            {isCourtAdmin ? "Court Administrator" : "Contract Owner"} Access
          </CardTitle>
          <CardDescription>
            You have administrative privileges to manage role assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            {isCourtAdmin && (
              <>
                <p>
                  <strong>Admin Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Admin Name:</strong> {user?.name}
                </p>
              </>
            )}
            {isOwner && (
              <p>
                <strong>Owner wallet:</strong> {account}
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-medium">Authorized</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup for Contract Owner */}
      {isOwner && userRole === Role.None && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <UserPlus className="h-5 w-5" />
              Quick Setup
            </CardTitle>
            <CardDescription className="text-green-600">
              Assign yourself admin role to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBootstrapSelf}
              disabled={assigning}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {assigning ? "Assigning..." : "Give Me Admin Access"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Role Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Role to Wallet Address
          </CardTitle>
          <CardDescription>
            Assign roles to specific wallet addresses. Each address can only
            have one role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wallet-address">Wallet Address</Label>
            <Input
              id="wallet-address"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="role-select">Role</Label>
            <Select
              value={selectedRole.toString()}
              onValueChange={(value) => setSelectedRole(Number(value) as Role)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.Court.toString()}>
                  Court Official (Administrator)
                </SelectItem>
                <SelectItem value={Role.Officer.toString()}>
                  Police Officer
                </SelectItem>
                <SelectItem value={Role.Forensic.toString()}>
                  Forensic Expert
                </SelectItem>
                <SelectItem value={Role.Lawyer.toString()}>Lawyer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAssignRole}
            disabled={assigning || !walletAddress}
            className="w-full"
          >
            {assigning ? "Assigning..." : "Assign Role"}
          </Button>
        </CardContent>
      </Card>

      {/* Current Role Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Role Assignments</CardTitle>
          <CardDescription>
            Active wallet address assignments in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {refreshing ? (
            <div className="text-center py-4">Loading assignments...</div>
          ) : roleAssignments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No role assignments found. Assign roles to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-mono text-sm">
                      {assignment.address.substring(0, 6)}...
                      {assignment.address.substring(
                        assignment.address.length - 4
                      )}
                    </TableCell>
                    <TableCell>{assignment.role_name}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {assignment.assigned_by}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeRole(assignment.address)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={loadRoleAssignments}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Debugger */}
      <RoleDebugger />

      {/* Status Card */}
      {(userRole !== Role.None || user?.role !== Role.None) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              System Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 text-sm">
              You have administrator access and can manage the forensic evidence
              system. Role assignments are active and users can login with their
              assigned wallet addresses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OwnerBootstrap;

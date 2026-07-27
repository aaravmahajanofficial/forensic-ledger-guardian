import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Users,
  Settings,
  BarChart3,
  Activity,
  ArrowUpRight,
  Lock,
  KeySquare,
  FileUp,
  LayoutGrid,
  FileLock2,
  Unlock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";
import { useWeb3 } from "@/hooks/useWeb3";
import web3Service, { Case as BlockchainCase } from "@/services/web3Service";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

// Type for case management
type ManagedCase = {
  id: string;
  title: string;
  status: "active" | "sealed" | "closed";
  description: string;
};

const CourtDashboard = () => {
  const { account } = useWeb3();

  // Real-time stats state
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingApproval: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [systemLocked, setSystemLocked] = useState(false);
  const [casesForManagement, setCasesForManagement] = useState<ManagedCase[]>(
    []
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Execute independent queries concurrently
      const [
        { count: casesCount, error: casesError },
        { count: pendingCount, error: pendingError },
        { count: usersCount, error: usersError },
        { count: activeUsersCount, error: activeError },
        isLocked
      ] = await Promise.all([
        supabase
          .from("cases")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("fir")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("role_assignments")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("role_assignments")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        web3Service.getSystemLockStatus()
      ]);

      setSystemLocked(isLocked);

      setStats({
        totalCases: casesCount || 0,
        pendingApproval: pendingCount || 0,
        totalUsers: usersCount || 0,
        activeUsers: activeUsersCount || 0,
      });

      // Fetch cases for management with blockchain status
      const { data: casesData, error: casesDataError } = await supabase
        .from("cases")
        .select("case_id, title, description, type")
        .order("filed_date", { ascending: false })
        .limit(20);

      if (casesData && !casesDataError) {
        // Get blockchain status for each case
        const casesWithStatus: ManagedCase[] = await Promise.all(
          casesData.map(async (c) => {
            let status: "active" | "sealed" | "closed" = "active";
            try {
              const blockchainCase = await web3Service.getCase(c.case_id);
              if (blockchainCase) {
                if (blockchainCase.seal) {
                  status = "sealed";
                } else if (!blockchainCase.open) {
                  status = "closed";
                }
              }
            } catch {
              // Default to active if blockchain fetch fails
            }
            return {
              id: c.case_id,
              title: c.title || "Untitled Case",
              status,
              description: c.description || "",
            };
          })
        );
        setCasesForManagement(casesWithStatus);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    setTimeout(() => fetchDashboardData(), 0);
  }, [fetchDashboardData]);

  // Handler for toggling system lock
  const handleToggleSystem = async () => {
    try {
      const success = await web3Service.toggleSystemLock();
      if (success) {
        setSystemLocked((prev) => !prev);
        toast({
          title: systemLocked ? "System Unlocked" : "System Locked",
          description: systemLocked
            ? "The system has been unlocked successfully."
            : "The system has been locked for security.",
        });
      }
    } catch (error) {
      console.error("Failed to toggle system lock:", error);
      toast({
        title: "Operation Failed",
        description: "Could not toggle system lock state.",
        variant: "destructive",
      });
    }
  };

  // Handler for sealing a case
  const handleSealCase = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      const success = await web3Service.sealCase(caseId);
      if (success) {
        toast({
          title: "Case Sealed",
          description: `Case ${caseId} has been sealed successfully.`,
        });
        // Update local state
        setCasesForManagement((prev) =>
          prev.map((c) =>
            c.id === caseId ? { ...c, status: "sealed" as const } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to seal case:", error);
      toast({
        title: "Operation Failed",
        description: "Could not seal the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handler for closing a case
  const handleCloseCase = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      const success = await web3Service.closeCase(caseId);
      if (success) {
        toast({
          title: "Case Closed",
          description: `Case ${caseId} has been closed successfully.`,
        });
        // Update local state
        setCasesForManagement((prev) =>
          prev.map((c) =>
            c.id === caseId ? { ...c, status: "closed" as const } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to close case:", error);
      toast({
        title: "Operation Failed",
        description: "Could not close the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handler for reopening a case
  const handleReopenCase = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      const success = await web3Service.reopenCase(caseId);
      if (success) {
        toast({
          title: "Case Reopened",
          description: `Case ${caseId} has been reopened successfully.`,
        });
        // Update local state
        setCasesForManagement((prev) =>
          prev.map((c) =>
            c.id === caseId ? { ...c, status: "active" as const } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to reopen case:", error);
      toast({
        title: "Operation Failed",
        description: "Could not reopen the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter cases by status
  const activeCases = casesForManagement.filter((c) => c.status === "active");
  const sealedCases = casesForManagement.filter((c) => c.status === "sealed");
  const closedCases = casesForManagement.filter((c) => c.status === "closed");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-forensic-800">
          Court Dashboard
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cases"
          value={loading ? "..." : stats.totalCases}
          icon={<FolderKanban className="h-5 w-5 text-forensic-evidence" />}
          linkTo="/cases"
        />
        <StatCard
          title="Pending FIRs"
          value={loading ? "..." : stats.pendingApproval}
          icon={<FolderKanban className="h-5 w-5 text-forensic-accent" />}
          linkTo="/fir"
          highlight={stats.pendingApproval > 0}
        />
        <StatCard
          title="Total Users"
          value={loading ? "..." : stats.totalUsers}
          icon={<Users className="h-5 w-5 text-forensic-court" />}
          linkTo="/users/manage"
        />
        <StatCard
          title="System Status"
          icon={
            systemLocked ? (
              <Lock className="h-5 w-5 text-forensic-warning" />
            ) : (
              <Unlock className="h-5 w-5 text-forensic-success" />
            )
          }
          value={loading ? "..." : systemLocked ? "Locked" : "Unlocked"}
          className={
            systemLocked ? "bg-forensic-50 border-forensic-warning/50" : ""
          }
          valueClassName={
            systemLocked ? "text-forensic-warning" : "text-forensic-success"
          }
        />
      </div>

      {/* Case Status Management Panel */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <FileLock2 className="h-5 w-5 mr-2 text-forensic-court" />
            Case Status Management
          </CardTitle>
          <CardDescription>Seal, reopen, or close cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-forensic-accent" />
              <span className="ml-2 text-forensic-500">Loading cases...</span>
            </div>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">
                  Active Cases ({activeCases.length})
                </TabsTrigger>
                <TabsTrigger value="sealed">
                  Sealed Cases ({sealedCases.length})
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Closed Cases ({closedCases.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeCases.length === 0 ? (
                  <p className="text-center text-forensic-500 py-4">
                    No active cases found
                  </p>
                ) : (
                  activeCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-forensic-100"
                    >
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-forensic-500">
                          #{caseItem.id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-forensic-warning border-forensic-warning/30 hover:bg-forensic-warning/10"
                          onClick={() => handleSealCase(caseItem.id)}
                          disabled={actionLoading === caseItem.id}
                        >
                          {actionLoading === caseItem.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Seal Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-forensic-court border-forensic-court/30 hover:bg-forensic-court/10"
                          onClick={() => handleCloseCase(caseItem.id)}
                          disabled={actionLoading === caseItem.id}
                        >
                          {actionLoading === caseItem.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Close Case
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="sealed" className="space-y-4">
                {sealedCases.length === 0 ? (
                  <p className="text-center text-forensic-500 py-4">
                    No sealed cases found
                  </p>
                ) : (
                  sealedCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-forensic-100"
                    >
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-forensic-500">
                          #{caseItem.id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-forensic-accent border-forensic-accent/30 hover:bg-forensic-accent/10"
                          onClick={() => handleReopenCase(caseItem.id)}
                          disabled={actionLoading === caseItem.id}
                        >
                          {actionLoading === caseItem.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Unseal Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-forensic-court border-forensic-court/30 hover:bg-forensic-court/10"
                          onClick={() => handleCloseCase(caseItem.id)}
                          disabled={actionLoading === caseItem.id}
                        >
                          {actionLoading === caseItem.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : null}
                          Close Case
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="closed" className="space-y-4">
                {closedCases.length === 0 ? (
                  <p className="text-center text-forensic-500 py-4">
                    No closed cases found
                  </p>
                ) : (
                  closedCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-forensic-100"
                    >
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-forensic-500">
                          #{caseItem.id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="bg-forensic-50 text-forensic-500"
                        >
                          Permanently Closed
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/cases">View All Cases</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions - Court-specific actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-forensic-evidence" />
              Role Management
            </CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Assign and modify roles for system users
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90 shadow-sm transition-all duration-300"
            >
              <Link
                to="/bootstarp"
                className="flex items-center justify-center"
              >
                <span>Manage Roles</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card> */}

        {/* <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <KeySquare className="h-5 w-5 mr-2 text-forensic-accent" />
              Encryption Keys
            </CardTitle>
            <CardDescription>Manage encryption keys</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Update and rotate encryption keys for evidence security
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-accent hover:bg-forensic-accent/90 shadow-sm transition-all duration-300"
            >
              <Link
                to="/settings/security"
                className="flex items-center justify-center"
              >
                <span>Manage Keys</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card> */}
      {/* </div> */}

      {/* System Security Toggle */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            {systemLocked ? (
              <Lock className="h-5 w-5 mr-2 text-forensic-warning" />
            ) : (
              <Unlock className="h-5 w-5 mr-2 text-forensic-success" />
            )}
            System Security
          </CardTitle>
          <CardDescription>Control overall system access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-forensic-50 rounded-lg">
            <div>
              <p className="font-medium">System Lock Status</p>
              <p className="text-sm text-forensic-600">
                {systemLocked
                  ? "System is currently locked. Only Court role can access sensitive functions."
                  : "System is currently unlocked. All roles have normal access."}
              </p>
            </div>
            <Switch
              checked={systemLocked}
              onCheckedChange={handleToggleSystem}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-forensic-600" />
              System Activity
            </CardTitle>
            <CardDescription>Recent system events</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              asChild
              className="w-full hover:bg-forensic-50 transition-colors"
            >
              <Link to="/activity">View All Activity</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <LayoutGrid className="h-5 w-5 mr-2 text-forensic-600" />
              Help & Resources
            </CardTitle>
            <CardDescription>Court role documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Case Management Guide</h4>
              <p className="text-xs text-forensic-500">
                Learn how to effectively manage case states
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/court/case-management">View Guide</Link>
              </Button>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Security Controls</h4>
              <p className="text-xs text-forensic-500">
                Best practices for system security
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/court/security">View Guide</Link>
              </Button>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Role Permissions</h4>
              <p className="text-xs text-forensic-500">
                Understanding the permission hierarchy
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/court/permissions">View Guide</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="outline"
              className="w-full hover:bg-forensic-50 transition-colors"
            >
              <Link to="/help">
                <span>View All Guides</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourtDashboard;

import React, { useState } from "react";
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
  Activity,
  ArrowUpRight,
  Lock,
  KeySquare,
  FileUp,
  LayoutGrid,
  FileLock2,
  Unlock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";
import { toast } from "@/hooks/use-toast";

const CourtDashboard = () => {
  // Mock data - would come from API/blockchain in real implementation
  const stats = {
    totalCases: 32,
    pendingApproval: 7,
    totalUsers: 42,
    activeUsers: 28,
  };

  const [systemLocked, setSystemLocked] = useState(false);

  // Handler for toggling system lock
  const handleToggleSystem = async () => {
    try {
      // In a real implementation, this would call the web3Service
      // const success = await web3Service.toggleSystemLock();

      // Mock implementation with delay to simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = true;

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

  // Cases that need case status management
  const casesForManagement = [
    { id: "CC-2023-056", status: "active", title: "State v. Johnson" },
    {
      id: "CC-2023-078",
      status: "sealed",
      title: "Evidence tampering investigation",
    },
    { id: "CC-2023-112", status: "closed", title: "Corporate data breach" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<FolderKanban className="h-5 w-5 text-forensic-evidence" />}
          linkTo="/cases"
        />
        <StatCard
          title="Pending Approval"
          value={stats.pendingApproval}
          icon={<FolderKanban className="h-5 w-5 text-forensic-accent" />}
          linkTo="/cases/approval"
          highlight={stats.pendingApproval > 0}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
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
          value={systemLocked ? "Locked" : "Unlocked"}
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
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Cases</TabsTrigger>
              <TabsTrigger value="sealed">Sealed Cases</TabsTrigger>
              <TabsTrigger value="closed">Closed Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {casesForManagement
                .filter((c) => c.status === "active")
                .map((caseItem) => (
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
                      >
                        Seal Case
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-forensic-court border-forensic-court/30 hover:bg-forensic-court/10"
                      >
                        Close Case
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="sealed" className="space-y-4">
              {casesForManagement
                .filter((c) => c.status === "sealed")
                .map((caseItem) => (
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
                      >
                        Reopen Case
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              {casesForManagement
                .filter((c) => c.status === "closed")
                .map((caseItem) => (
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
                    <Badge variant="outline" className="bg-forensic-50">
                      Closed
                    </Badge>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/cases">View All Cases</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions - Court-specific actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                to="/users/roles"
                className="flex items-center justify-center"
              >
                <span>Manage Roles</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
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
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <FileUp className="h-5 w-5 mr-2 text-forensic-court" />
              Promote FIR to Case
            </CardTitle>
            <CardDescription>Create new cases from FIRs</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Convert First Information Reports to formal cases
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-court hover:bg-forensic-court/90 shadow-sm transition-all duration-300"
            >
              <Link
                to="/cases/create"
                className="flex items-center justify-center"
              >
                <span>Create Case</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

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

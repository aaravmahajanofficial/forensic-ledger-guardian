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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<FolderKanban className="h-6 w-6" />}
          linkTo="/cases"
          index={0}
        />
        <StatCard
          title="Pending Approval"
          value={stats.pendingApproval}
          icon={<FileUp className="h-6 w-6" />}
          linkTo="/cases/approval"
          valueClassName={stats.pendingApproval > 0 ? "text-warning" : ""}
          index={1}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          linkTo="/users/manage"
          index={2}
        />
        <StatCard
          title="System Status"
          icon={
            systemLocked ? (
              <Lock className="h-6 w-6" />
            ) : (
              <Unlock className="h-6 w-6" />
            )
          }
          value={systemLocked ? "Locked" : "Unlocked"}
          valueClassName={systemLocked ? "text-destructive" : "text-accent"}
          index={3}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Management & Security */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileLock2 className="h-5 w-5 mr-3 text-primary" />
                Case Status Management
              </CardTitle>
              <CardDescription>
                Seal, reopen, or close cases to maintain system integrity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="sealed">Sealed</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4 space-y-3">
                  {casesForManagement
                    .filter((c) => c.status === "active")
                    .map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{caseItem.title}</p>
                          <p className="text-xs text-muted-foreground">
                            #{caseItem.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Seal Case
                          </Button>
                          <Button size="sm" variant="destructive">
                            Close Case
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="sealed" className="mt-4 space-y-3">
                  {casesForManagement
                    .filter((c) => c.status === "sealed")
                    .map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{caseItem.title}</p>
                          <p className="text-xs text-muted-foreground">
                            #{caseItem.id}
                          </p>
                        </div>
                        <Button size="sm" variant="secondary">
                          Reopen Case
                        </Button>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="closed" className="mt-4 space-y-3">
                  {casesForManagement
                    .filter((c) => c.status === "closed")
                    .map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{caseItem.title}</p>
                          <p className="text-xs text-muted-foreground">
                            #{caseItem.id}
                          </p>
                        </div>
                        <Badge variant="outline">Closed</Badge>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {systemLocked ? (
                  <Lock className="h-5 w-5 mr-3 text-warning" />
                ) : (
                  <Unlock className="h-5 w-5 mr-3 text-accent" />
                )}
                System Security Control
              </CardTitle>
              <CardDescription>
                Temporarily lock the system to prevent modifications during critical periods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">System Lock Status</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {systemLocked
                      ? "System is locked. Only Court members can perform sensitive actions."
                      : "System is unlocked. All roles have normal access."
                    }
                  </p>
                </div>
                <Switch
                  checked={systemLocked}
                  onCheckedChange={handleToggleSystem}
                  aria-label="Toggle system lock"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Actions & Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutGrid className="h-5 w-5 mr-3 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Core court functions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="secondary">
                <Link to="/users/roles">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Roles
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="secondary">
                <Link to="/settings/security">
                  <KeySquare className="h-4 w-4 mr-3" />
                  Manage Encryption Keys
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="secondary">
                <Link to="/cases/create">
                  <FileUp className="h-4 w-4 mr-3" />
                  Promote FIR to Case
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-3 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system-wide events.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList />
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/activity">View All Activity</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourtDashboard;

import React from "react";
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
  FileDigit,
  FolderKanban,
  Upload,
  CheckCircle,
  ArrowUpRight,
  AlignLeft,
  Clock,
  FileCheck,
  Filter,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";

const OfficerDashboard = () => {
  // Mock data - would come from API/blockchain in real implementation
  const stats = {
    totalCases: 17,
    activeCases: 12,
    totalEvidence: 98,
    pendingConfirmation: 7,
    awaitingSubmission: 3,
  };

  // Pending evidence confirmation data
  const pendingConfirmations = [
    {
      id: "EV-2023-087",
      caseId: "CC-2023-056",
      title: "Server Access Logs",
      submittedBy: "Sarah Lee",
      date: "Apr 09, 2025",
      isOwnSubmission: false,
    },
    {
      id: "EV-2023-086",
      caseId: "CC-2023-056",
      title: "Network Traffic Capture",
      submittedBy: "Sarah Lee",
      date: "Apr 09, 2025",
      isOwnSubmission: false,
    },
    {
      id: "EV-2023-085",
      caseId: "CC-2023-078",
      title: "Transaction Records",
      submittedBy: "Michael Chen",
      date: "Apr 08, 2025",
      isOwnSubmission: true,
    },
  ];

  // Filter for eligible confirmations (not self-submitted)
  const eligibleConfirmations = pendingConfirmations.filter(
    (item) => !item.isOwnSubmission
  );

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
          title="Active Cases"
          value={stats.activeCases}
          icon={<FolderKanban className="h-5 w-5 text-forensic-accent" />}
          linkTo="/cases?status=active"
        />
        <StatCard
          title="Total Evidence"
          value={stats.totalEvidence}
          icon={<FileDigit className="h-5 w-5 text-forensic-court" />}
          linkTo="/evidence"
        />
        <StatCard
          title="Pending Confirmation"
          value={eligibleConfirmations.length}
          icon={<CheckCircle className="h-5 w-5 text-forensic-warning" />}
          linkTo="/evidence/confirm?filter=eligible"
          highlight={eligibleConfirmations.length > 0}
        />
      </div>

      {/* Evidence Confirmation Panel */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-forensic-accent" />
            Evidence Confirmation
          </CardTitle>
          <CardDescription>
            Review and confirm submitted evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="eligible">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="eligible">
                  Eligible ({eligibleConfirmations.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Pending ({pendingConfirmations.length})
                </TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="sm"
                className="text-forensic-500 flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>

            <TabsContent value="eligible" className="space-y-2">
              {eligibleConfirmations.length > 0 ? (
                eligibleConfirmations.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-forensic-100"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-forensic-800">
                          {item.title}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-forensic-50 text-xs"
                        >
                          {item.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-forensic-600">
                        Case #{item.caseId} • Submitted by {item.submittedBy}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-forensic-accent hover:bg-forensic-accent/90"
                    >
                      Confirm
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-forensic-500">
                  No evidence eligible for your confirmation
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-2">
              {pendingConfirmations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-forensic-100"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-forensic-800">
                        {item.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-forensic-50 text-xs"
                      >
                        {item.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-forensic-600">
                      Case #{item.caseId} • Submitted by {item.submittedBy}
                      {item.isOwnSubmission && (
                        <Badge className="ml-2 bg-forensic-warning/20 text-forensic-warning text-xs">
                          Your submission
                        </Badge>
                      )}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={item.isOwnSubmission ? "outline" : "default"}
                    className={
                      item.isOwnSubmission
                        ? "text-forensic-500"
                        : "bg-forensic-accent hover:bg-forensic-accent/90"
                    }
                    disabled={item.isOwnSubmission}
                  >
                    {item.isOwnSubmission ? "Cannot confirm own" : "Confirm"}
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/evidence/confirm">View All Pending Confirmation</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <AlignLeft className="h-5 w-5 mr-2 text-forensic-evidence" />
              FIR Management
            </CardTitle>
            <CardDescription>Manage First Information Reports</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Create and update First Information Reports (FIR)
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90 shadow-sm transition-all duration-300"
            >
              <Link to="/fir" className="flex items-center justify-center">
                <span>Manage FIRs</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Upload className="h-5 w-5 mr-2 text-forensic-accent" />
              Upload Evidence
            </CardTitle>
            <CardDescription>Add new digital evidence</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">FIR Evidence:</span>
                <Badge variant="outline" className="bg-forensic-50">
                  {stats.awaitingSubmission} awaiting
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Case Evidence:</span>
                <Badge variant="outline" className="bg-forensic-50">
                  {stats.pendingConfirmation} pending
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              asChild
              className="w-full bg-forensic-accent hover:bg-forensic-accent/90 shadow-sm"
            >
              <Link to="/upload?type=fir">
                <span>Upload FIR Evidence</span>
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-forensic-accent/80 hover:bg-forensic-accent/90 shadow-sm"
            >
              <Link to="/upload?type=case">
                <span>Upload Case Evidence</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-forensic-court" />
              Evidence Status
            </CardTitle>
            <CardDescription>Track evidence submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span>Submitted</span>
                  <span className="font-medium">{stats.totalEvidence}</span>
                </div>
                <Progress value={100} className="h-2 bg-forensic-100" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span>Awaiting Confirmation</span>
                  <span className="font-medium">
                    {stats.pendingConfirmation}
                  </span>
                </div>
                <Progress
                  value={
                    (stats.pendingConfirmation / stats.totalEvidence) * 100
                  }
                  className="h-2 bg-forensic-100"
                  indicatorClassName="bg-forensic-warning"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span>Confirmed</span>
                  <span className="font-medium">
                    {stats.totalEvidence - stats.pendingConfirmation}
                  </span>
                </div>
                <Progress
                  value={
                    ((stats.totalEvidence - stats.pendingConfirmation) /
                      stats.totalEvidence) *
                    100
                  }
                  className="h-2 bg-forensic-100"
                  indicatorClassName="bg-forensic-success"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/evidence">
                <span>View Evidence Dashboard</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-forensic-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest evidence chain of custody events
            </CardDescription>
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

        <div className="space-y-6 lg:col-span-1">
          {/* Optional: You can add placeholder content or leave empty */}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;

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
  FileDigit,
  FolderKanban,
  Upload,
  ArrowUpRight,
  FileSearch,
  Clock,
  Shield,
  Users,
  Microscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";
import ChainOfCustody from "../../chainOfCustody/ChainOfCustody";

const ForensicDashboard = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  // Mock data - would come from API/blockchain in real implementation
  const stats = {
    totalCases: 24,
    activeCases: 18,
    totalEvidence: 143,
    pendingAnalysis: 12,
    pendingConfirmation: 5,
  };

  // Evidence pending analysis
  const pendingAnalysisItems = [
    {
      id: "EV-2023-090",
      caseId: "CC-2023-056",
      title: "Database Backup Files",
      submittedBy: "John Smith",
      date: "Apr 10, 2025",
      confirmed: true,
    },
    {
      id: "EV-2023-089",
      caseId: "CC-2023-078",
      title: "Server Configuration Files",
      submittedBy: "Sarah Lee",
      date: "Apr 09, 2025",
      confirmed: true,
    },
    {
      id: "EV-2023-088",
      caseId: "CC-2023-112",
      title: "Log Files",
      submittedBy: "Michael Chen",
      date: "Apr 08, 2025",
      confirmed: false,
    },
  ];

  // Evidence pending confirmation by forensic expert
  const pendingConfirmationItems = pendingAnalysisItems
    .filter((item) => !item.confirmed)
    .slice(0, 3);

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
          title="Pending Analysis"
          value={stats.pendingAnalysis}
          icon={<Microscope className="h-5 w-5 text-forensic-warning" />}
          linkTo="/evidence/analysis?status=pending"
          highlight={stats.pendingAnalysis > 0}
        />
      </div>

      {/* Evidence Analysis & Confirmation Panel */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-forensic-evidence" />
            Evidence Analysis
          </CardTitle>
          <CardDescription>
            Analyze and confirm forensic evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis">
                Pending Analysis ({pendingAnalysisItems.length})
              </TabsTrigger>
              <TabsTrigger value="confirmation">
                Pending Confirmation ({pendingConfirmationItems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-3">
              {pendingAnalysisItems.map((item) => (
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
                      {item.confirmed ? (
                        <Badge className="ml-2 bg-forensic-success/20 text-forensic-success text-xs">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge className="ml-2 bg-forensic-warning/20 text-forensic-warning text-xs">
                          Awaiting Confirmation
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-forensic-evidence hover:bg-forensic-evidence/90"
                    >
                      Analyze
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="confirmation" className="space-y-3">
              {pendingConfirmationItems.length > 0 ? (
                pendingConfirmationItems.map((item) => (
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
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEvidence(item.id)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-forensic-accent hover:bg-forensic-accent/90"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-forensic-500">
                  No items awaiting confirmation
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/evidence/analysis">View Complete Analysis Queue</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Upload className="h-5 w-5 mr-2 text-forensic-evidence" />
              Upload Evidence
            </CardTitle>
            <CardDescription>
              Add new digital evidence to a case
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Securely upload and hash evidence files to maintain integrity
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90 shadow-sm transition-all duration-300"
            >
              <Link to="/upload" className="flex items-center justify-center">
                <span>Upload Files</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <FolderKanban className="h-5 w-5 mr-2 text-forensic-court" />
              Manage Cases
            </CardTitle>
            <CardDescription>View and update case details</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Review case status and manage evidence submissions
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-court hover:bg-forensic-court/90 shadow-sm transition-all duration-300"
            >
              <Link to="/cases" className="flex items-center justify-center">
                <span>View Cases</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Chain of Custody Visualization */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-forensic-accent" />
            Chain of Custody Visualization
          </CardTitle>
          <CardDescription>
            Evidence access and modification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedEvidence ? (
            <ChainOfCustody
              evidenceId={selectedEvidence}
              caseId="FF-2023-104"
            />
          ) : (
            <div className="text-center py-10 text-forensic-500">
              <Shield className="h-16 w-16 mx-auto opacity-20 mb-3" />
              <p>Select an evidence item to view its chain of custody</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSelectedEvidence("EV-2023-088")}
              >
                View Sample Evidence
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
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

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-forensic-600" />
              Help & Resources
            </CardTitle>
            <CardDescription>Forensic role documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Forensic Analysis</h4>
              <p className="text-xs text-forensic-500">
                Digital forensics best practices
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/forensic/analysis">View Guide</Link>
              </Button>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Blockchain Verification</h4>
              <p className="text-xs text-forensic-500">
                Using blockchain for evidence integrity
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/forensic/blockchain">View Guide</Link>
              </Button>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium">Chain of Custody</h4>
              <p className="text-xs text-forensic-500">
                Maintaining proper custody records
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="p-0 h-auto mt-1"
              >
                <Link to="/help/custody">View Guide</Link>
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

export default ForensicDashboard;

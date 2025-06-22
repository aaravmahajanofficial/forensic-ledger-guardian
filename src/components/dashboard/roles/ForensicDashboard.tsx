import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FlaskConical,
  ShieldCheck,
  ArrowUpRight,
  FileSearch,
  Clock,
  CheckSquare,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";
import ChainOfCustody from "../../chainOfCustody/ChainOfCustody";

const ForensicDashboard = () => {
  const stats = {
    totalCases: 24,
    activeCases: 18,
    pendingAnalysis: 12,
    completedAnalyses: 131,
  };

  const pendingAnalysisItems = [
    {
      id: "EV-2023-090",
      caseId: "CC-2023-056",
      title: "Database Backup Files",
      date: "Apr 10, 2025",
    },
    {
      id: "EV-2023-089",
      caseId: "CC-2023-078",
      title: "Server Configuration Files",
      date: "Apr 09, 2025",
    },
    {
      id: "EV-2023-088",
      caseId: "CC-2023-112",
      title: "Encrypted Hard Drive Image",
      date: "Apr 08, 2025",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {/* Left Column: Quick Actions & Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg border-border/80">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Forensic Toolkit
            </CardTitle>
            <CardDescription>
              Essential forensic tasks at your fingertips.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/evidence/analysis/new">
                <FlaskConical className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Start New Analysis</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/upload/report">
                <FileText className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Upload Analysis Report</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/evidence/confirm">
                <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Confirm Evidence</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border/80">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Main Content */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 bg-muted/80">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Pending Analysis</TabsTrigger>
            <TabsTrigger value="custody">Chain of Custody</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Active Cases"
                value={stats.activeCases}
                icon={<Users className="h-6 w-6 text-primary" />}
                footerText="View Active Cases"
                linkTo="/cases?status=active"
              />
              <StatCard
                title="Completed Analyses"
                value={stats.completedAnalyses}
                icon={<CheckSquare className="h-6 w-6 text-primary" />}
                footerText="View Reports"
                linkTo="/reports"
              />
              <StatCard
                title="Total Assigned Cases"
                value={stats.totalCases}
                icon={<FileSearch className="h-6 w-6 text-primary" />}
                footerText="Browse All Cases"
                linkTo="/cases"
              />
              <StatCard
                title="Pending Analysis"
                value={stats.pendingAnalysis}
                icon={<Clock className="h-6 w-6 text-destructive" />}
                footerText="Start Analysis"
                linkTo="/evidence/analysis?status=pending"
                highlight
              />
            </div>
          </TabsContent>

          {/* Pending Analysis Tab */}
          <TabsContent value="analysis" className="mt-6">
            <Card className="shadow-lg border-border/80">
              <CardHeader>
                <CardTitle>Evidence Awaiting Analysis</CardTitle>
                <CardDescription>
                  Select an item to begin your forensic analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {pendingAnalysisItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/60"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Case: {item.caseId} | Received: {item.date}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/evidence/analysis/${item.id}`}>
                          Analyze
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chain of Custody Tab */}
          <TabsContent value="custody" className="mt-6">
            <Card className="shadow-lg border-border/80">
              <CardHeader>
                <CardTitle>Live Chain of Custody</CardTitle>
                <CardDescription>
                  Track the lifecycle of a selected evidence item.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChainOfCustody evidenceId="EV-2023-090" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ForensicDashboard;

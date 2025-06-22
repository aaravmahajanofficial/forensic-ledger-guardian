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
  FilePlus2,
  Upload,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Users,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";

const OfficerDashboard = () => {
  const stats = {
    totalCases: 17,
    activeCases: 12,
    evidenceSubmitted: 98,
    pendingConfirmation: 7,
  };

  const pendingConfirmations = [
    {
      id: "EV-2023-087",
      caseId: "CC-2023-056",
      title: "Server Access Logs",
    },
    {
      id: "EV-2023-086",
      caseId: "CC-2023-056",
      title: "Network Traffic Capture",
    },
    {
      id: "EV-2023-085",
      caseId: "CC-2023-078",
      title: "Transaction Records",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {/* Left Column: Quick Actions & Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg border-border/80">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Your essential tasks, one click away.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/upload">
                <Upload className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Upload New Evidence</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/cases/new">
                <FilePlus2 className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Register New Case</span>
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

      {/* Right Column: Case Overview & Confirmations */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 bg-muted/80">
            <TabsTrigger value="overview">Case Overview</TabsTrigger>
            <TabsTrigger value="confirmations">
              Pending Confirmations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Total Assigned Cases"
                value={stats.totalCases}
                icon={<FileText className="h-6 w-6 text-primary" />}
                footerText="View All Cases"
                linkTo="/cases"
              />
              <StatCard
                title="Active Cases"
                value={stats.activeCases}
                icon={<Users className="h-6 w-6 text-primary" />}
                footerText="Manage Active Cases"
                linkTo="/cases?status=active"
              />
              <StatCard
                title="Total Evidence Submitted"
                value={stats.evidenceSubmitted}
                icon={<Upload className="h-6 w-6 text-primary" />}
                footerText="Review Evidence"
                linkTo="/evidence"
              />
              <StatCard
                title="Pending Confirmations"
                value={stats.pendingConfirmation}
                icon={<Clock className="h-6 w-6 text-destructive" />}
                footerText="Confirm Evidence"
                linkTo="/evidence/confirm"
                highlight
              />
            </div>
          </TabsContent>
          <TabsContent value="confirmations" className="mt-6">
            <Card className="shadow-lg border-border/80">
              <CardHeader>
                <CardTitle>Confirm Evidence Integrity</CardTitle>
                <CardDescription>
                  Review and confirm the following evidence submissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {pendingConfirmations.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/60"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Case ID: {item.caseId}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/evidence/confirm/${item.id}`}>
                          Confirm
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OfficerDashboard;

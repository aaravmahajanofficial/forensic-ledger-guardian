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
  FileSearch,
  Gavel,
  Scale,
  ArrowUpRight,
  Users,
  CheckSquare,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";

const LawyerDashboard = () => {
  const stats = {
    totalCases: 14,
    activeCases: 8,
    evidenceReviewed: 65,
    upcomingDeadlines: 3,
  };

  const evidenceTimeline = [
    {
      id: "EV-2023-087",
      title: "Network Access Logs",
      status: "Confirmed",
      date: "Apr 10, 2025",
    },
    {
      id: "EV-2023-086",
      title: "CCTV Footage",
      status: "Confirmed",
      date: "Apr 09, 2025",
    },
    {
      id: "EV-2023-085",
      title: "Email Records",
      status: "Pending",
      date: "Apr 08, 2025",
    },
  ];

  const accessLog = [
    {
      id: "EV-2023-087",
      user: "Michael Chen (Officer)",
      timestamp: "Apr 10, 14:32",
    },
    {
      id: "EV-2023-086",
      user: "Emily Wilson (Court)",
      timestamp: "Apr 10, 11:15",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-6">
      {/* Left Column: Quick Actions & Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg border-border/80">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Legal Toolkit
            </CardTitle>
            <CardDescription>
              Your essential legal actions and resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/cases/new">
                <Gavel className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Initiate New Case</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/evidence/request">
                <FileSearch className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Request Evidence Access</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              asChild
            >
              <Link to="/court/prepare">
                <Scale className="mr-3 h-5 w-5 text-primary" />
                <span className="font-semibold">Prepare for Court</span>
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
            <TabsTrigger value="timeline">Evidence Timeline</TabsTrigger>
            <TabsTrigger value="access">Access Log</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Active Cases"
                value={stats.activeCases}
                icon={<Users className="h-6 w-6 text-primary" />}
                footerText="Manage Cases"
                linkTo="/cases?status=active"
              />
              <StatCard
                title="Evidence Reviewed"
                value={stats.evidenceReviewed}
                icon={<CheckSquare className="h-6 w-6 text-primary" />}
                footerText="View All Evidence"
                linkTo="/evidence"
              />
              <StatCard
                title="Total Assigned Cases"
                value={stats.totalCases}
                icon={<FileSearch className="h-6 w-6 text-primary" />}
                footerText="Browse Case Files"
                linkTo="/cases"
              />
              <StatCard
                title="Upcoming Deadlines"
                value={stats.upcomingDeadlines}
                icon={<CalendarClock className="h-6 w-6 text-destructive" />}
                footerText="View Calendar"
                linkTo="/calendar"
                highlight
              />
            </div>
          </TabsContent>

          {/* Evidence Timeline Tab */}
          <TabsContent value="timeline" className="mt-6">
            <Card className="shadow-lg border-border/80">
              <CardHeader>
                <CardTitle>Evidence Submission Timeline</CardTitle>
                <CardDescription>
                  Track the status of all evidence submissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {evidenceTimeline.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/60"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {item.date}
                        </p>
                      </div>
                      <Badge
                        variant={item.status === "Confirmed" ? "default" : "secondary"}
                        className={item.status === "Confirmed" ? "bg-green-500/10 text-green-700" : ""}
                      >
                        {item.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Log Tab */}
          <TabsContent value="access" className="mt-6">
            <Card className="shadow-lg border-border/80">
              <CardHeader>
                <CardTitle>Evidence Access Log</CardTitle>
                <CardDescription>
                  Monitor who has accessed evidence and when.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {accessLog.map((log) => (
                    <li
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/60"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {log.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Accessed: {log.timestamp}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/evidence/access/${log.id}`}>
                          Verify
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

export default LawyerDashboard;

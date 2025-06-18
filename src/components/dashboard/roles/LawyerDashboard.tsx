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
  ArrowUpRight,
  Shield,
  Calendar,
  Clock,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityList from "../RecentActivityList";
import StatCard from "../StatCard";
import ChainOfCustody from "../../chainOfCustody/ChainOfCustody";

const LawyerDashboard = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  // Mock data - would come from API/blockchain in real implementation
  const stats = {
    totalCases: 14,
    activeCases: 8,
    totalEvidence: 73,
    recentAccesses: 12,
  };

  // Updated assigned cases data to show actual numbers
  const assignedCases = [
    { id: "FF-2023-089", progress: 75 },
    { id: "FF-2023-092", progress: 30 },
  ];

  // Recent evidence for timeline view
  const recentEvidence = [
    {
      id: "EV-2023-087",
      caseId: "FF-2023-089",
      title: "Network Access Logs",
      type: "Document",
      timestamp: "2025-04-10T14:23:12Z",
      status: "confirmed",
      handler: "Sarah Lee (Officer)",
    },
    {
      id: "EV-2023-086",
      caseId: "FF-2023-089",
      title: "CCTV Footage",
      type: "Video",
      timestamp: "2025-04-09T11:45:33Z",
      status: "confirmed",
      handler: "John Smith (Forensic)",
    },
    {
      id: "EV-2023-085",
      caseId: "FF-2023-092",
      title: "Email Records",
      type: "Document",
      timestamp: "2025-04-08T16:12:05Z",
      status: "pending",
      handler: "Michael Chen (Officer)",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={<FolderKanban className="h-5 w-5 text-forensic-evidence" />}
          linkTo="/cases"
          className="transition-transform hover:scale-102 hover:shadow-md"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={<FolderKanban className="h-5 w-5 text-forensic-accent" />}
          linkTo="/cases?status=active"
          className="transition-transform hover:scale-102 hover:shadow-md"
        />
        <StatCard
          title="Total Evidence"
          value={stats.totalEvidence}
          icon={<FileDigit className="h-5 w-5 text-forensic-court" />}
          linkTo="/evidence"
          className="transition-transform hover:scale-102 hover:shadow-md"
        />
      </div>

      {/* Case Timeline View */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-forensic-accent" />
            Case Timeline
          </CardTitle>
          <CardDescription>
            Evidence submission and confirmation events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="confirmed">
            <TabsList className="mb-4">
              <TabsTrigger value="confirmed">Confirmed Evidence</TabsTrigger>
              <TabsTrigger value="pending">Pending Evidence</TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed">
              <div className="relative border-l-2 border-forensic-200 pl-6 py-2 space-y-6">
                {recentEvidence
                  .filter((ev) => ev.status === "confirmed")
                  .map((evidence, _index) => (
                    <div key={evidence.id} className="relative">
                      <div className="absolute -left-[11px] h-5 w-5 rounded-full bg-forensic-accent"></div>
                      <div className="bg-white rounded-lg shadow-sm border border-forensic-200 p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <div className="text-forensic-800 font-medium">
                              {evidence.title}
                            </div>
                            <div className="text-sm text-forensic-500">
                              Case #{evidence.caseId} • {evidence.type}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 text-sm text-forensic-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(evidence.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-forensic-600">
                            Confirmed by {evidence.handler}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-forensic-accent"
                            onClick={() => setSelectedEvidence(evidence.id)}
                          >
                            View Chain of Custody
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="relative border-l-2 border-forensic-200 pl-6 py-2 space-y-6">
                {recentEvidence
                  .filter((ev) => ev.status === "pending")
                  .map((evidence, _index) => (
                    <div key={evidence.id} className="relative">
                      <div className="absolute -left-[11px] h-5 w-5 rounded-full bg-forensic-warning"></div>
                      <div className="bg-white rounded-lg shadow-sm border border-forensic-200 p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <div className="text-forensic-800 font-medium">
                              {evidence.title}
                              <Badge className="ml-2 bg-forensic-warning/20 text-forensic-warning">
                                Awaiting Confirmation
                              </Badge>
                            </div>
                            <div className="text-sm text-forensic-500">
                              Case #{evidence.caseId} • {evidence.type}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 text-sm text-forensic-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(evidence.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-forensic-600">
                            Submitted by {evidence.handler}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-forensic-accent"
                            onClick={() => setSelectedEvidence(evidence.id)}
                          >
                            View Chain of Custody
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link to="/activity">View Complete Timeline</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Evidence Access Logging */}
      <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
        <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
          <CardTitle className="text-lg flex items-center">
            <Eye className="h-5 w-5 mr-2 text-forensic-evidence" />
            Evidence Access Log
          </CardTitle>
          <CardDescription>Recent evidence access records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium">
                    Evidence ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Case</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Accessed By
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "EV-2023-087",
                    case: "FF-2023-089",
                    accessor: "Michael Chen (Officer)",
                    time: "Apr 10, 14:32",
                    txHash: "0x4a8c...",
                  },
                  {
                    id: "EV-2023-086",
                    case: "FF-2023-089",
                    accessor: "Emily Wilson (Court)",
                    time: "Apr 10, 11:15",
                    txHash: "0x7b3d...",
                  },
                  {
                    id: "EV-2023-085",
                    case: "FF-2023-092",
                    accessor: "You",
                    time: "Apr 09, 16:05",
                    txHash: "0x2e9f...",
                  },
                ].map((log, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-3">{log.id}</td>
                    <td className="px-4 py-3">{log.case}</td>
                    <td className="px-4 py-3">{log.accessor}</td>
                    <td className="px-4 py-3">{log.time}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-forensic-500 mt-2 text-center">
            All evidence access events are permanently recorded on the
            blockchain
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <FolderKanban className="h-5 w-5 mr-2 text-forensic-evidence" />
              Manage Cases
            </CardTitle>
            <CardDescription>View and access case details</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Access case files, evidence, and manage client information
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90 shadow-sm transition-all duration-300"
            >
              <Link to="/cases" className="flex items-center justify-center">
                <span>View Cases</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="pb-2 bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <FileDigit className="h-5 w-5 mr-2 text-forensic-accent" />
              View Evidence
            </CardTitle>
            <CardDescription>Access case evidence</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-forensic-600">
              Review digital evidence and verify authenticity
            </p>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-forensic-accent hover:bg-forensic-accent/90 shadow-sm transition-all duration-300"
            >
              <Link to="/evidence" className="flex items-center justify-center">
                <span>Access Evidence</span>
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Chain of Custody */}
      {selectedEvidence && (
        <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-forensic-court" />
                Chain of Custody
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => setSelectedEvidence(null)}
              >
                Close
              </Button>
            </div>
            <CardDescription>
              Complete custody record for evidence #{selectedEvidence}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChainOfCustody
              evidenceId={selectedEvidence}
              caseId="FF-2023-089"
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-forensic-200 hover:border-forensic-300 transition-colors">
          <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
            <CardTitle className="text-lg flex items-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-forensic-600"
              >
                <path
                  d="M7.5 0.875C4.4375 0.875 1.9375 3.375 1.9375 6.5C1.9375 9.5625 4.4375 12.0625 7.5 12.0625C10.625 12.0625 13.125 9.5625 13.125 6.5C13.125 3.375 10.625 0.875 7.5 0.875ZM7.5 1.5C10.3125 1.5 12.5 3.6875 12.5 6.5C12.5 9.25 10.3125 11.4375 7.5 11.4375C4.75 11.4375 2.5625 9.25 2.5625 6.5C2.5625 3.6875 4.75 1.5 7.5 1.5ZM7.1875 3.375V6.8125H10.625V6.1875H7.8125V3.375H7.1875Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
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
            <CardTitle>Assigned Cases</CardTitle>
            <CardDescription>Cases where you have active roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedCases.map((caseItem) => (
              <div key={caseItem.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-forensic-600 font-medium">
                    Case #{caseItem.id}
                  </span>
                  <span className="font-medium text-forensic-800 bg-forensic-100 px-2 py-0.5 rounded-full text-xs">
                    {assignedCases.length} Assigned
                  </span>
                </div>
                <Progress
                  value={caseItem.progress}
                  className="h-2 bg-forensic-100"
                  indicatorClassName="bg-forensic-evidence"
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              asChild
              className="w-full hover:bg-forensic-50 transition-colors"
            >
              <Link to="/cases/assigned">View Assigned Cases</Link>
            </Button>
            <Link
              to="/help/lawyer"
              className="text-xs text-center text-forensic-500 hover:text-forensic-700 transition-colors"
            >
              View Lawyer Role Documentation
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LawyerDashboard;

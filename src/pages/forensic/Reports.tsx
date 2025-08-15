import { useState } from "react";
import {
  BarChart2,
  FileText,
  Download,
  Filter,
  Calendar,
  PieChart,
  ArrowRight,
  Share2,
  Printer,
  Clock,
  Search,
  FileCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock reports data
const reportsList = [
  {
    id: "RPT-2025-001",
    title: "Tech Corp Data Breach - Forensic Analysis",
    caseId: "FF-2023-089",
    date: "2025-04-09T10:30:00Z",
    author: "Dr. Emily Chen",
    status: "published",
    type: "technical",
  },
  {
    id: "RPT-2025-002",
    title: "Financial Fraud Investigation - Database Examination",
    caseId: "FF-2023-092",
    date: "2025-04-08T14:15:00Z",
    author: "Dr. Emily Chen",
    status: "draft",
    type: "analysis",
  },
  {
    id: "RPT-2025-003",
    title: "Mobile Device Extraction - Digital Evidence Summary",
    caseId: "FF-2023-118",
    date: "2025-04-07T16:45:00Z",
    author: "Thomas Brown",
    status: "published",
    type: "summary",
  },
  {
    id: "RPT-2025-004",
    title: "Intellectual Property Theft - Network Traffic Analysis",
    caseId: "FF-2023-104",
    date: "2025-04-05T09:20:00Z",
    author: "Dr. Emily Chen",
    status: "review",
    type: "technical",
  },
  {
    id: "RPT-2025-005",
    title: "Server Room Security Breach - Evidence Chain Validation",
    caseId: "FF-2023-118",
    date: "2025-04-03T11:10:00Z",
    author: "Lisa Anderson",
    status: "published",
    type: "verification",
  },
];

// Mock chart data as a placeholder
const analyticsData = {
  casesPerType: [
    { name: "Technical", value: 12 },
    { name: "Analysis", value: 8 },
    { name: "Summary", value: 5 },
    { name: "Verification", value: 3 },
  ],
  evidenceProcessed: [
    { name: "Jan", count: 4 },
    { name: "Feb", count: 7 },
    { name: "Mar", count: 5 },
    { name: "Apr", count: 10 },
  ],
};

const ForensicReports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<
    (typeof reportsList)[0] | null
  >(null);

  const handleReportAction = (
    action: string,
    report: (typeof reportsList)[0]
  ) => {
    setSelectedReport(report);

    switch (action) {
      case "view":
        toast({
          title: "Opening Report",
          description: `Opening ${report.title} for viewing`,
        });
        break;
      case "download":
        toast({
          title: "Report Downloaded",
          description: `${report.title} has been downloaded`,
        });
        break;
      case "share":
        toast({
          title: "Share Report",
          description: `Sharing options for ${report.title}`,
        });
        break;
      case "print":
        toast({
          title: "Printing Report",
          description: `Preparing ${report.title} for printing`,
        });
        break;
      default:
        break;
    }
  };

  const handleCreateReport = () => {
    toast({
      title: "Create New Report",
      description: "Opening the report creation form",
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveTab(filter);
    toast({
      title: "Filter Applied",
      description: `Showing ${filter} reports`,
    });
  };

  const filteredReports =
    activeTab === "all"
      ? reportsList
      : reportsList.filter(
          (report) => report.status === activeTab || report.type === activeTab
        );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-forensic-success text-white">Published</Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="text-forensic-500">
            Draft
          </Badge>
        );
      case "review":
        return <Badge className="bg-forensic-warning">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "technical":
        return (
          <Badge className="bg-forensic-accent/20 text-forensic-accent">
            Technical
          </Badge>
        );
      case "analysis":
        return (
          <Badge className="bg-forensic-evidence/20 text-forensic-evidence">
            Analysis
          </Badge>
        );
      case "summary":
        return (
          <Badge className="bg-forensic-court/20 text-forensic-court">
            Summary
          </Badge>
        );
      case "verification":
        return (
          <Badge className="bg-forensic-warning/20 text-forensic-warning">
            Verification
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800">Forensic Reports</h1>

      <div className="flex items-center justify-between">
        <Tabs defaultValue={activeTab} onValueChange={handleFilterChange}>
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          className="bg-forensic-accent hover:bg-forensic-accent/90"
          onClick={handleCreateReport}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Forensic Reports</CardTitle>
                  <CardDescription>
                    Technical reports and analytics for evidence processing
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search reports..."
                  className="max-w-md"
                  onChange={() =>
                    toast({
                      title: "Search Active",
                      description: "Searching through reports...",
                    })
                  }
                />
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.id}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.title}
                        </TableCell>
                        <TableCell>{report.caseId}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell>
                          {new Date(report.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{getTypeBadge(report.type)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleReportAction("view", report)}
                            >
                              <FileText className="h-3.5 w-3.5 text-forensic-accent" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() =>
                                handleReportAction("download", report)
                              }
                            >
                              <Download className="h-3.5 w-3.5 text-forensic-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() =>
                                handleReportAction("share", report)
                              }
                            >
                              <Share2 className="h-3.5 w-3.5 text-forensic-500" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() =>
                                handleReportAction("print", report)
                              }
                            >
                              <Printer className="h-3.5 w-3.5 text-forensic-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          {selectedReport && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-forensic-accent" />
                  Report Preview: {selectedReport.title}
                </CardTitle>
                <CardDescription>
                  Report ID: {selectedReport.id} | Case: {selectedReport.caseId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-forensic-50 p-4 rounded-md border border-forensic-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-forensic-500">Author</p>
                      <p>{selectedReport.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Status</p>
                      <p>{getStatusBadge(selectedReport.status)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Created On</p>
                      <p>
                        {new Date(selectedReport.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Report Type</p>
                      <p>{getTypeBadge(selectedReport.type)}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-forensic-200 rounded-md p-6 text-center">
                  <FileText className="h-12 w-12 text-forensic-300 mx-auto mb-2" />
                  <p className="text-forensic-600">
                    Report content would be displayed here in the actual
                    application
                  </p>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleReportAction("download", selectedReport)
                      }
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleReportAction("print", selectedReport)
                      }
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      size="sm"
                      className="bg-forensic-accent hover:bg-forensic-accent/90"
                      onClick={() => handleReportAction("view", selectedReport)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Full View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart2 className="h-5 w-5 mr-2 text-forensic-accent" />
                Reports Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Reports by Status</h4>
                </div>
                <div className="h-32 bg-slate-50 rounded-md border flex flex-col justify-between p-4">
                  {/* Placeholder for chart */}
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-forensic-success mr-1"></div>
                        <span className="text-xs">Published</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-forensic-warning mr-1"></div>
                        <span className="text-xs">Review</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-gray-400 mr-1"></div>
                        <span className="text-xs">Draft</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {reportsList.length}
                    </div>
                  </div>
                  <div className="flex w-full h-4 mt-2">
                    <div className="bg-forensic-success h-full rounded-l-sm w-[60%]"></div>
                    <div className="bg-forensic-warning h-full w-[20%]"></div>
                    <div className="bg-gray-400 h-full rounded-r-sm w-[20%]"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Reports by Type</h4>
                </div>
                <div className="bg-slate-50 rounded-md border p-4">
                  {analyticsData.casesPerType.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-1 ${
                            item.name === "Technical"
                              ? "bg-forensic-accent"
                              : item.name === "Analysis"
                              ? "bg-forensic-evidence"
                              : item.name === "Summary"
                              ? "bg-forensic-court"
                              : "bg-forensic-warning"
                          }`}
                        ></div>
                        <span className="text-xs">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "Advanced Analytics",
                      description:
                        "Opening advanced reports analytics dashboard",
                    })
                  }
                >
                  View Full Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-accent"></div>
                  <div>
                    <p className="text-sm font-medium">Report generated</p>
                    <p className="text-xs text-forensic-500">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-accent"></div>
                  <div>
                    <p className="text-sm font-medium">
                      Report shared with team
                    </p>
                    <p className="text-xs text-forensic-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-accent"></div>
                  <div>
                    <p className="text-sm font-medium">
                      Report updated by Dr. Chen
                    </p>
                    <p className="text-xs text-forensic-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForensicReports;

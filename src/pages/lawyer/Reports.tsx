import React, { useState } from "react";
import {
  BarChart2,
  FileText,
  Download,
  Calendar,
  PieChart,
  ArrowRight,
  Share2,
  Printer,
  Filter,
  Search,
  FileCheck,
  Briefcase,
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
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock reports data
const reportsList = [
  {
    id: "LR-2025-001",
    title: "Case Summary - Tech Corp Data Breach",
    caseId: "FF-2023-089",
    date: "2025-04-08T10:30:00Z",
    author: "James Wilson",
    status: "published",
    type: "summary",
  },
  {
    id: "LR-2025-002",
    title: "Court Preparation Brief - Financial Fraud",
    caseId: "FF-2023-092",
    date: "2025-04-06T14:15:00Z",
    author: "Sarah Johnson",
    status: "draft",
    type: "court",
  },
  {
    id: "LR-2025-003",
    title: "Evidence Analysis - Mobile Device Extraction",
    caseId: "FF-2023-118",
    date: "2025-04-05T16:45:00Z",
    author: "James Wilson",
    status: "published",
    type: "evidence",
  },
  {
    id: "LR-2025-004",
    title: "Legal Strategy Document - IP Theft Case",
    caseId: "FF-2023-104",
    date: "2025-04-03T09:20:00Z",
    author: "Sarah Johnson",
    status: "review",
    type: "strategy",
  },
  {
    id: "LR-2025-005",
    title: "Witness Statement Analysis - Server Room Breach",
    caseId: "FF-2023-118",
    date: "2025-04-01T11:10:00Z",
    author: "James Wilson",
    status: "published",
    type: "witness",
  },
];

// Mock chart data as a placeholder
const analyticsData = {
  casesPerType: [
    { name: "Summary", value: 8 },
    { name: "Court", value: 5 },
    { name: "Evidence", value: 7 },
    { name: "Strategy", value: 4 },
    { name: "Witness", value: 3 },
  ],
  caseOutcomes: [
    { name: "Won", count: 14 },
    { name: "Lost", count: 6 },
    { name: "Settled", count: 8 },
    { name: "Pending", count: 12 },
  ],
};

const LegalReports: React.FC = () => {
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
      description: "Opening the legal report creation form",
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
      case "summary":
        return (
          <Badge className="bg-forensic-court/20 text-forensic-court">
            Case Summary
          </Badge>
        );
      case "court":
        return (
          <Badge className="bg-forensic-800/20 text-forensic-800">
            Court Brief
          </Badge>
        );
      case "evidence":
        return (
          <Badge className="bg-forensic-evidence/20 text-forensic-evidence">
            Evidence Analysis
          </Badge>
        );
      case "strategy":
        return (
          <Badge className="bg-forensic-accent/20 text-forensic-accent">
            Legal Strategy
          </Badge>
        );
      case "witness":
        return (
          <Badge className="bg-forensic-warning/20 text-forensic-warning">
            Witness Analysis
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800">Legal Reports</h1>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={handleFilterChange}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="court">Court Briefs</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          className="bg-forensic-court hover:bg-forensic-court/90 ml-auto"
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
                  <CardTitle>Legal Reports</CardTitle>
                  <CardDescription>
                    Case summaries, court briefs, and legal analyses
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
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Input
                  placeholder="Search reports by title or case ID..."
                  className="w-full md:max-w-md"
                  onChange={() =>
                    toast({
                      title: "Search Active",
                      description: "Searching through reports...",
                    })
                  }
                />
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Case ID</TableHead>
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
                              <FileText className="h-3.5 w-3.5 text-forensic-court" />
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
                  <FileText className="h-5 w-5 mr-2 text-forensic-court" />
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

                <div className="border border-forensic-200 rounded-md p-6">
                  <h3 className="text-lg font-medium mb-3">
                    {selectedReport.title}
                  </h3>
                  <p className="text-forensic-600 mb-4">
                    This is a preview of the {selectedReport.type} report for
                    case {selectedReport.caseId}. The full report contains
                    detailed legal analysis, evidence references, and actionable
                    recommendations.
                  </p>

                  <div className="bg-forensic-50 p-3 rounded-md border border-forensic-100 mb-4">
                    <h4 className="text-sm font-medium">Key Points</h4>
                    <ul className="list-disc list-inside text-sm mt-2">
                      <li>Primary evidence chain validation complete</li>
                      <li>Witness statements corroborate timeline</li>
                      <li>Technical evidence supports legal position</li>
                      <li>Recommended court strategy outlined</li>
                    </ul>
                  </div>

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
                      className="bg-forensic-court hover:bg-forensic-court/90"
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
                <BarChart2 className="h-5 w-5 mr-2 text-forensic-court" />
                Legal Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                            item.name === "Summary"
                              ? "bg-forensic-court"
                              : item.name === "Court"
                              ? "bg-forensic-800"
                              : item.name === "Evidence"
                              ? "bg-forensic-evidence"
                              : item.name === "Strategy"
                              ? "bg-forensic-accent"
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Case Outcomes</h4>
                </div>
                <div className="h-32 bg-slate-50 rounded-md border flex flex-col justify-between p-4">
                  {/* Placeholder for chart */}
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-forensic-success mr-1"></div>
                        <span className="text-xs">
                          Won ({analyticsData.caseOutcomes[0].count})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-forensic-warning mr-1"></div>
                        <span className="text-xs">
                          Lost ({analyticsData.caseOutcomes[1].count})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-400 mr-1"></div>
                        <span className="text-xs">
                          Settled ({analyticsData.caseOutcomes[2].count})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-gray-400 mr-1"></div>
                        <span className="text-xs">
                          Pending ({analyticsData.caseOutcomes[3].count})
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {analyticsData.caseOutcomes.reduce(
                        (sum, item) => sum + item.count,
                        0
                      )}
                    </div>
                  </div>
                  <div className="flex w-full h-4 mt-2 rounded-sm overflow-hidden">
                    <div
                      className="bg-forensic-success h-full"
                      style={{ width: "35%" }}
                    ></div>
                    <div
                      className="bg-forensic-warning h-full"
                      style={{ width: "15%" }}
                    ></div>
                    <div
                      className="bg-blue-400 h-full"
                      style={{ width: "20%" }}
                    ></div>
                    <div
                      className="bg-gray-400 h-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "Advanced Analytics",
                      description: "Opening advanced legal analytics dashboard",
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
              <CardTitle className="text-sm flex items-center">
                <Briefcase className="h-4 w-4 mr-1 text-forensic-court" />
                Upcoming Court Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 hover:bg-forensic-50 rounded-md transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      Tech Corp Data Breach
                    </span>
                    <Badge variant="outline" className="text-xs font-normal">
                      April 15
                    </Badge>
                  </div>
                  <p className="text-xs text-forensic-500 mt-1">
                    Case #FF-2023-089 - Initial Hearing
                  </p>
                </div>
                <div className="p-2 hover:bg-forensic-50 rounded-md transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      Financial Fraud Investigation
                    </span>
                    <Badge variant="outline" className="text-xs font-normal">
                      April 22
                    </Badge>
                  </div>
                  <p className="text-xs text-forensic-500 mt-1">
                    Case #FF-2023-092 - Evidence Submission
                  </p>
                </div>
                <div className="p-2 hover:bg-forensic-50 rounded-md transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      Mobile Device Extraction
                    </span>
                    <Badge variant="outline" className="text-xs font-normal">
                      April 29
                    </Badge>
                  </div>
                  <p className="text-xs text-forensic-500 mt-1">
                    Case #FF-2023-118 - Expert Testimony
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full text-sm h-8 mt-2"
                onClick={() =>
                  toast({
                    title: "Court Calendar",
                    description: "Opening full court schedule calendar",
                  })
                }
              >
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalReports;

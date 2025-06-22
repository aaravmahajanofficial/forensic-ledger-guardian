import React, { useState, useMemo } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Share2,
  Printer,
  Briefcase,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type ReportStatus = "Published" | "Draft" | "Review" | "Archived";
type ReportType = "Case Summary" | "Court Brief" | "Evidence Analysis" | "Legal Strategy" | "Witness Analysis";

type Report = {
  id: string;
  title: string;
  caseId: string;
  date: string;
  author: string;
  status: ReportStatus;
  type: ReportType;
  version: number;
};

const initialReports: Report[] = [
    { id: "LR-2025-001", title: "Case Summary - Tech Corp Data Breach", caseId: "FF-2023-089", date: "2025-04-08T10:30:00Z", author: "James Wilson", status: "Published", type: "Case Summary", version: 3 },
    { id: "LR-2025-002", title: "Court Preparation Brief - Financial Fraud", caseId: "FF-2023-092", date: "2025-04-06T14:15:00Z", author: "Sarah Johnson", status: "Draft", type: "Court Brief", version: 1 },
    { id: "LR-2025-003", title: "Evidence Analysis - Mobile Device Extraction", caseId: "FF-2023-118", date: "2025-04-05T16:45:00Z", author: "James Wilson", status: "Published", type: "Evidence Analysis", version: 2 },
    { id: "LR-2025-004", title: "Legal Strategy Document - IP Theft Case", caseId: "FF-2023-104", date: "2025-04-03T09:20:00Z", author: "Sarah Johnson", status: "Review", type: "Legal Strategy", version: 4 },
    { id: "LR-2025-005", title: "Witness Statement Analysis - Server Room Breach", caseId: "FF-2023-118", date: "2025-04-01T11:10:00Z", author: "James Wilson", status: "Archived", type: "Witness Analysis", version: 1 },
];

const statusBadgeMap: Record<ReportStatus, { variant: BadgeProps["variant"]; }> = {
  Published: { variant: "success" },
  Draft: { variant: "secondary" },
  Review: { variant: "warning" },
  Archived: { variant: "outline" },
};

const typeBadgeMap: Record<ReportType, { variant: BadgeProps["variant"]; }> = {
  "Case Summary": { variant: "default" },
  "Court Brief": { variant: "info" },
  "Evidence Analysis": { variant: "destructive" },
  "Legal Strategy": { variant: "outline" },
  "Witness Analysis": { variant: "secondary" },
};


const ReportsPage = () => {
  const { toast } = useToast();
  const [reports] = useState<Report[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredReports = useMemo(() => {
    return reports
      .filter(report => statusFilter === "all" || report.status === statusFilter)
      .filter(report => typeFilter === "all" || report.type === typeFilter)
      .filter(report =>
        searchTerm === "" ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [reports, searchTerm, statusFilter, typeFilter]);

  const handleAction = (action: string, reportId: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Performing ${action} on report ${reportId}`,
      variant: "default",
    });
  };
  
  const getStatusBadge = (status: ReportStatus) => {
    const { variant } = statusBadgeMap[status] || { variant: "default" };
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getTypeBadge = (type: ReportType) => {
    const { variant } = typeBadgeMap[type] || { variant: "default" };
    return <Badge variant={variant}>{type}</Badge>;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, analyze, and manage all legal reports and case analytics.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Report Repository
              </CardTitle>
              <CardDescription>
                Browse, manage, and export all generated legal reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, case ID, or report ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.keys(statusBadgeMap).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.keys(typeBadgeMap).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Title</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead className="hidden md:table-cell">Last Modified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-semibold">{report.title}</span>
                            <span className="text-xs text-muted-foreground">ID: {report.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>{report.caseId}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(report.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{getTypeBadge(report.type)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction("view", report.id)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("edit", report.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("download", report.id)}>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("share", report.id)}>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("print", report.id)}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleAction("delete", report.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <p className="text-center text-muted-foreground">[Advanced Chart Placeholder]</p>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <div className="font-medium">FF-2023-089 Brief</div>
                  <Badge variant="warning">April 15, 2025</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <div className="font-medium">FF-2023-092 Evidence Summary</div>
                  <Badge variant="warning">April 22, 2025</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <div className="font-medium">FF-2023-118 Witness Report</div>
                  <Badge variant="destructive">May 1, 2025</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Share2,
  Printer,
  Search,
  Calendar,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock reports data
const reportsList = [
  {
    id: "RPT-2025-001",
    title: "Tech Corp Data Breach - Forensic Analysis",
    caseId: "FF-2023-089",
    date: "2025-04-09T10:30:00Z",
    author: "Dr. Evelyn Reed",
    status: "Published",
  },
  {
    id: "RPT-2025-002",
    title: "Financial Fraud Investigation - Database Examination",
    caseId: "FF-2023-092",
    date: "2025-04-08T14:15:00Z",
    author: "Dr. Evelyn Reed",
    status: "Draft",
  },
  {
    id: "RPT-2025-003",
    title: "Mobile Device Extraction - Digital Evidence Summary",
    caseId: "FF-2023-118",
    date: "2025-04-07T16:45:00Z",
    author: "Dr. Kenji Tanaka",
    status: "Published",
  },
  {
    id: "RPT-2025-004",
    title: "Intellectual Property Theft - Network Traffic Analysis",
    caseId: "FF-2023-104",
    date: "2025-04-05T09:20:00Z",
    author: "Dr. Evelyn Reed",
    status: "In Review",
  },
  {
    id: "RPT-2025-005",
    title: "Server Room Security Breach - Evidence Chain Validation",
    caseId: "FF-2023-118",
    date: "2025-04-03T11:10:00Z",
    author: "Dr. Kenji Tanaka",
    status: "Published",
  },
];


const getStatusVariant = (status: string): BadgeProps["variant"] => {
  switch (status) {
    case "Published":
      return "success";
    case "In Review":
      return "secondary";
    case "Draft":
      return "warning";
    default:
      return "default";
  }
};

const ForensicReports: React.FC = () => {
  const { toast } = useToast();

  const handleAction = (action: string, reportId: string) => {
    toast({
      title: `Report ${action}`,
      description: `Report ${reportId} has been scheduled for ${action.toLowerCase()}`,
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border p-4 sm:p-6">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Forensic Reports
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage, generate, and review forensic analysis reports.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search reports..." className="pl-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Range
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsList.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{report.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{report.caseId}</TableCell>
                      <TableCell>{report.author}</TableCell>
                      <TableCell>
                        {new Date(report.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction("Downloaded", report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction("Shared", report.id)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction("Printed", report.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {reportsList.length} of {reportsList.length} reports
              </p>
              <div className="flex gap-2">
                <Button variant="outline">Previous</Button>
                <Button variant="outline">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ForensicReports;

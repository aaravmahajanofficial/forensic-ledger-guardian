import React, { useMemo, useState } from "react";
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
  Activity,
  Search,
  Download,
  AlertCircle,
  User,
  FileText,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  category: "Authentication" | "Evidence" | "Case" | "System" | "Security";
  severity: "Low" | "Medium" | "High" | "Critical";
  ipAddress: string;
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: new Date("2025-04-10T14:30:00Z"),
    user: "court.admin@gov.in",
    action: "User Role Change",
    resource: "/users/456",
    category: "System",
    severity: "High",
    ipAddress: "10.0.0.50",
    details: "Changed user 'john.doe' role from 'Lawyer' to 'Judge'.",
  },
  {
    id: "LOG-002",
    timestamp: new Date("2025-04-10T12:15:00Z"),
    user: "forensic.examiner@gov.in",
    action: "Evidence Verified",
    resource: "/evidence/EV-2023-420",
    category: "Evidence",
    severity: "Medium",
    ipAddress: "192.168.1.101",
    details: "Successfully verified hash for 'Server Access Logs'.",
  },
  {
    id: "LOG-003",
    timestamp: new Date("2025-04-10T11:05:00Z"),
    user: "lawyer.jane@example.com",
    action: "Failed Login",
    resource: "/auth/login",
    category: "Authentication",
    severity: "Medium",
    ipAddress: "203.0.113.45",
    details: "Failed login attempt for user 'lawyer.jane@example.com'.",
  },
  {
    id: "LOG-004",
    timestamp: new Date("2025-04-09T18:00:00Z"),
    user: "system.process",
    action: "System Backup",
    resource: "/system/backup",
    category: "System",
    severity: "Low",
    ipAddress: "127.0.0.1",
    details: "Completed daily system-wide data backup.",
  },
  {
    id: "LOG-005",
    timestamp: new Date("2025-04-09T15:45:00Z"),
    user: "officer.smith@police.gov.in",
    action: "Case Created",
    resource: "/cases/CS-2024-015",
    category: "Case",
    severity: "Medium",
    ipAddress: "172.16.0.10",
    details: "New case 'CS-2024-015' created and assigned.",
  },
  {
    id: "LOG-006",
    timestamp: new Date("2025-04-08T09:20:00Z"),
    user: "court.admin@gov.in",
    action: "Security Policy Update",
    resource: "/admin/security",
    category: "Security",
    severity: "Critical",
    ipAddress: "10.0.0.50",
    details: "Password complexity requirements updated.",
  },
];

const getSeverityVariant = (severity: AuditLog["severity"]): BadgeProps["variant"] => {
  switch (severity) {
    case "Critical":
      return "destructive";
    case "High":
      return "warning";
    case "Medium":
      return "secondary";
    case "Low":
      return "outline";
    default:
      return "default";
  }
};

const getCategoryIcon = (category: AuditLog["category"]) => {
  switch (category) {
    case "Authentication":
      return <Shield className="h-4 w-4 text-muted-foreground" />;
    case "Evidence":
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    case "Case":
      return <Activity className="h-4 w-4 text-muted-foreground" />;
    case "System":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case "Security":
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const AuditLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return mockAuditLogs
      .filter((log) =>
        categoryFilter === "all" ? true : log.category === categoryFilter
      )
      .filter((log) =>
        severityFilter === "all" ? true : log.severity === severityFilter
      )
      .filter((log) =>
        Object.values(log)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, categoryFilter, severityFilter]);

  const handleExport = () => {
    toast({
      title: "Exporting Logs",
      description: "Your audit log export has started and will be downloaded shortly.",
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border p-4 sm:p-6">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              System Audit Logs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track all system activities and access for security and compliance.
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
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
                  <Input
                    placeholder="Search logs by user, action, or details..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Authentication">Authentication</SelectItem>
                      <SelectItem value="Evidence">Evidence</SelectItem>
                      <SelectItem value="Case">Case</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedRow(expandedRow === log.id ? null : log.id)
                        }
                      >
                        <TableCell className="w-10">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedRow === log.id ? "rotate-180" : ""
                            }`}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityVariant(log.severity)}>
                            {log.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedRow === log.id && (
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell colSpan={5} className="p-0">
                            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
                              <div className="flex items-start gap-3 rounded-lg bg-background p-3">
                                {getCategoryIcon(log.category)}
                                <div>
                                  <p className="text-sm font-semibold">
                                    Category
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {log.category}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 rounded-lg bg-background p-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-semibold">
                                    IP Address
                                  </p>
                                  <p className="font-mono text-sm text-muted-foreground">
                                    {log.ipAddress}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 rounded-lg bg-background p-3 md:col-span-3">
                                <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-semibold">
                                    Details
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {log.details}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {filteredLogs.length} of {filteredLogs.length} logs
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

export default AuditLogs;

import {
  Activity,
  Search,
  Download,
  AlertCircle,
  User,
  FileText,
  Shield,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  category: "authentication" | "evidence" | "case" | "system" | "security";
  severity: "low" | "medium" | "high" | "critical";
  ipAddress: string;
  userAgent: string;
  details: string;
}

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  // Mock audit logs data
  const auditLogs: AuditLog[] = useMemo(() => [
    {
      id: "1",
      timestamp: new Date("2024-01-15T10:30:00"),
      user: "detective@police.gov",
      action: "Evidence Upload",
      resource: "/evidence/upload",
      category: "evidence",
      severity: "medium",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      details: "Uploaded evidence file: IMG_0123.jpg (2.4MB)",
    },
    {
      id: "2",
      timestamp: new Date("2024-01-15T09:15:00"),
      user: "admin@court.gov",
      action: "User Role Change",
      resource: "/admin/users/456",
      category: "system",
      severity: "high",
      ipAddress: "10.0.0.50",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      details: "Changed user role from Officer to Detective",
    },
    {
      id: "3",
      timestamp: new Date("2024-01-15T08:45:00"),
      user: "lawyer@firm.com",
      action: "Failed Login Attempt",
      resource: "/auth/login",
      category: "authentication",
      severity: "medium",
      ipAddress: "203.0.113.45",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
      details: "Multiple failed login attempts detected",
    },
    {
      id: "4",
      timestamp: new Date("2024-01-14T16:20:00"),
      user: "forensic@lab.gov",
      action: "Evidence Access",
      resource: "/evidence/view/789",
      category: "evidence",
      severity: "low",
      ipAddress: "172.16.0.25",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
      details: "Viewed evidence item: Digital fingerprint analysis",
    },
    {
      id: "5",
      timestamp: new Date("2024-01-14T14:10:00"),
      user: "system",
      action: "Backup Completed",
      resource: "/system/backup",
      category: "system",
      severity: "low",
      ipAddress: "localhost",
      userAgent: "System/1.0",
      details: "Daily backup completed successfully (250GB)",
    },
  ], []);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || log.category === categoryFilter;
      const matchesSeverity =
        severityFilter === "all" || log.severity === severityFilter;

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [auditLogs, searchTerm, categoryFilter, severityFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <User className="h-4 w-4" />;
      case "evidence":
        return <FileText className="h-4 w-4" />;
      case "case":
        return <Activity className="h-4 w-4" />;
      case "system":
        return <Shield className="h-4 w-4" />;
      case "security":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportLogs = () => {
    const csvContent = [
      [
        "Timestamp",
        "User",
        "Action",
        "Resource",
        "Category",
        "Severity",
        "IP Address",
        "Details",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp.toISOString(),
          log.user,
          log.action,
          log.resource,
          log.category,
          log.severity,
          log.ipAddress,
          `"${log.details}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-forensic-800 flex items-center gap-2">
            <Activity className="h-8 w-8 text-forensic-court" />
            Audit Logs
          </h1>
          <p className="text-forensic-600 mt-1">
            Monitor system activity and user actions for security and compliance
          </p>
        </div>
        <Button onClick={exportLogs} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users, actions, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="evidence">Evidence</SelectItem>
                <SelectItem value="case">Case Management</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audit Log Entries</span>
            <Badge variant="outline" className="text-sm">
              {filteredLogs.length} entries
            </Badge>
          </CardTitle>
          <CardDescription>
            Detailed log of all system activities and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Timestamp
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="max-w-md">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {log.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize border ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;

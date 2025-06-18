import React, { useState } from "react";
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
  Search,
  Filter,
  Download,
  Clock,
  Calendar,
  User,
  FileCheck,
  Lock,
  AlertCircle,
  Flag,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

// Mock activity data
const activityData = [
  {
    id: "A-001",
    action: "Evidence Upload",
    description: "Uploaded disk_image_laptop.dd to case FF-2023-104",
    user: "John Smith",
    role: "Officer",
    timestamp: "2025-04-08T10:23:45Z",
    category: "evidence",
    severity: "normal",
  },
  {
    id: "A-002",
    action: "Evidence Verification",
    description: "Verified system_logs.zip for case FF-2023-104",
    user: "Emily Chen",
    role: "Forensic",
    timestamp: "2025-04-08T14:35:12Z",
    category: "evidence",
    severity: "normal",
  },
  {
    id: "A-003",
    action: "Case Created",
    description: "Created case FF-2023-104 from FIR-2023-104",
    user: "Michael Wong",
    role: "Court",
    timestamp: "2025-04-08T08:15:30Z",
    category: "case",
    severity: "normal",
  },
  {
    id: "A-004",
    action: "User Login",
    description: "User logged in from 192.168.1.45",
    user: "Sarah Lee",
    role: "Lawyer",
    timestamp: "2025-04-08T09:05:22Z",
    category: "auth",
    severity: "low",
  },
  {
    id: "A-005",
    action: "Permission Change",
    description: "Changed permissions for case FF-2023-092",
    user: "Michael Wong",
    role: "Court",
    timestamp: "2025-04-07T16:42:11Z",
    category: "admin",
    severity: "high",
  },
  {
    id: "A-006",
    action: "Evidence Download",
    description: "Downloaded smartphone_extraction.tar from case FF-2023-092",
    user: "Emily Chen",
    role: "Forensic",
    timestamp: "2025-04-07T11:18:35Z",
    category: "evidence",
    severity: "normal",
  },
  {
    id: "A-007",
    action: "Failed Login Attempt",
    description:
      "Failed login attempt for account emily.chen@forensics.gov from 203.45.67.89",
    user: "Unknown",
    role: "N/A",
    timestamp: "2025-04-07T08:23:19Z",
    category: "auth",
    severity: "high",
  },
  {
    id: "A-008",
    action: "System Configuration Change",
    description: "Updated evidence retention policy from 5 years to 7 years",
    user: "Michael Wong",
    role: "Court",
    timestamp: "2025-04-06T14:55:02Z",
    category: "admin",
    severity: "critical",
  },
  {
    id: "A-009",
    action: "User Added",
    description: "Added new user Jennifer Miller with Lawyer role",
    user: "Michael Wong",
    role: "Court",
    timestamp: "2025-04-06T10:22:48Z",
    category: "admin",
    severity: "normal",
  },
  {
    id: "A-010",
    action: "Case Status Change",
    description: "Changed status of case FF-2023-089 from active to closed",
    user: "Michael Wong",
    role: "Court",
    timestamp: "2025-04-05T16:37:29Z",
    category: "case",
    severity: "normal",
  },
];

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();

  // Filter logs based on search and filters
  const filteredActivities = activityData
    .filter((activity) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          activity.action.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.user.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((activity) => {
      // Category filter
      if (categoryFilter === "all") return true;
      return activity.category === categoryFilter;
    })
    .filter((activity) => {
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= dateRange.from && activityDate <= dateRange.to;
      }
      return true;
    })
    .filter((activity) => {
      // Time filter (last X days)
      if (timeFilter === "all") return true;

      const now = new Date();
      const activityTime = new Date(activity.timestamp);
      const diffTime = Math.abs(now.getTime() - activityTime.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (timeFilter) {
        case "today":
          return diffDays <= 1;
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        default:
          return true;
      }
    });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "evidence":
        return (
          <Badge className="bg-forensic-evidence text-white">Evidence</Badge>
        );
      case "case":
        return <Badge className="bg-forensic-court text-white">Case</Badge>;
      case "auth":
        return (
          <Badge className="bg-forensic-accent text-white">
            Authentication
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-forensic-warning text-forensic-900">
            Administrative
          </Badge>
        );
      default:
        return <Badge className="bg-forensic-400 text-white">Other</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge
            variant="outline"
            className="border-red-600 text-red-600 bg-red-50"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-forensic-warning text-forensic-warning bg-forensic-warning/10"
          >
            <Flag className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "normal":
        return (
          <Badge
            variant="outline"
            className="border-forensic-600 text-forensic-600"
          >
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="border-forensic-success text-forensic-success"
          >
            <Lock className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleExportLogs = (format: string) => {
    toast({
      title: "Logs Exported",
      description: `Activity logs exported in ${format.toUpperCase()} format.`,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTimeFilter("all");
    setDateRange({ from: undefined, to: undefined });

    toast({
      title: "Filters Reset",
      description: "All activity log filters have been cleared.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">Activity Logs</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-forensic-court hover:bg-forensic-court/90">
              <Download className="h-4 w-4 mr-2" />
              <span>Export Logs</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleExportLogs("csv")}>
                <FileCheck className="h-4 w-4 mr-2" />
                <span>CSV File</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportLogs("pdf")}>
                <FileCheck className="h-4 w-4 mr-2" />
                <span>PDF Report</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportLogs("json")}>
                <FileCheck className="h-4 w-4 mr-2" />
                <span>JSON Data</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
          <Input
            placeholder="Search logs..."
            className="pl-8 border-forensic-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-forensic-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="evidence">Evidence</SelectItem>
              <SelectItem value="case">Case</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="admin">Administrative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-forensic-500" />
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="border-forensic-200">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-forensic-200 w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                <span className="text-forensic-500">Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange(range as any)}
              initialFocus
            />
            <div className="p-3 border-t border-forensic-100 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                Clear
              </Button>
              <Button size="sm">Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* Activity Log List */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
          <CardDescription>
            {filteredActivities.length} event
            {filteredActivities.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border border-forensic-100 rounded-md hover:bg-forensic-50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-forensic-800">
                          {activity.action}
                        </h3>
                        {getCategoryBadge(activity.category)}
                        {getSeverityBadge(activity.severity)}
                      </div>
                      <p className="text-sm text-forensic-700">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="flex items-center text-forensic-500 text-sm">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {activity.user} ({activity.role})
                        </span>
                      </div>
                      <div className="flex items-center text-forensic-500 text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-forensic-500">
                  No logs found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;

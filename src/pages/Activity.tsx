import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Search,
  Download,
  Calendar as CalendarIcon,
  User,
  ShieldCheck,
  FileUp,
  LogIn,
  UserCog,
  Activity as ActivityIcon,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

// Mock activity data
const activityData = [
  {
    id: "A-001",
    action: "Evidence Upload",
    description: "Uploaded disk_image_laptop.dd to case FF-2023-104",
    user: "John Smith",
    role: "Officer",
    timestamp: new Date(),
    category: "evidence",
    severity: "normal",
  },
  {
    id: "A-002",
    action: "Evidence Verification",
    description: "Verified system_logs.zip for case FF-2023-104",
    user: "Emily Chen",
    role: "Forensic",
    timestamp: subDays(new Date(), 1),
    category: "evidence",
    severity: "normal",
  },
  {
    id: "A-003",
    action: "Case Created",
    description: "Created case FF-2023-104 from FIR-2023-104",
    user: "Michael Wong",
    role: "Court",
    timestamp: subDays(new Date(), 2),
    category: "case",
    severity: "high",
  },
  {
    id: "A-004",
    action: "User Login",
    description: "User logged in from 192.168.1.45",
    user: "Sarah Lee",
    role: "Lawyer",
    timestamp: subDays(new Date(), 2),
    category: "auth",
    severity: "low",
  },
  {
    id: "A-005",
    action: "Permission Change",
    description: "Changed permissions for case FF-2023-092",
    user: "Michael Wong",
    role: "Court",
    timestamp: subDays(new Date(), 3),
    category: "admin",
    severity: "medium",
  },
  {
    id: "A-006",
    action: "Failed Login Attempt",
    description: "Failed login for user 'admin' from IP 10.0.0.5",
    user: "System",
    role: "System",
    timestamp: subDays(new Date(), 4),
    category: "auth",
    severity: "high",
  },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  evidence: FileUp,
  case: ShieldCheck,
  auth: LogIn,
  admin: UserCog,
  default: ActivityIcon,
};

const severityConfig = {
  low: { variant: "success", label: "Low" },
  normal: { variant: "info", label: "Normal" },
  medium: { variant: "warning", label: "Medium" },
  high: { variant: "destructive", label: "High" },
} as const;

const ActivityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredActivities = useMemo(() => {
    return activityData.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      const matchesSearch = Object.values(activity)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate = dateRange?.from && dateRange?.to
        ? activityDate >= dateRange.from && activityDate <= dateRange.to
        : true;
      const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
      const matchesSeverity = severityFilter === "all" || activity.severity === severityFilter;

      return matchesSearch && matchesDate && matchesCategory && matchesSeverity;
    });
  }, [searchTerm, dateRange, categoryFilter, severityFilter]);

  const ActivityIconComponent = ({ category }: { category: string }) => {
    const Icon = categoryIcons[category] || categoryIcons.default;
    return <Icon className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity Log</h1>
          <p className="text-muted-foreground">
            Monitor all system and user activities across the platform.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </header>

      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="evidence">Evidence</SelectItem>
                <SelectItem value="case">Case</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden lg:table-cell">User</TableHead>
                    <TableHead className="hidden md:table-cell">Timestamp</TableHead>
                    <TableHead className="text-right">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => {
                    const severity = severityConfig[activity.severity as keyof typeof severityConfig];
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <ActivityIconComponent category={activity.category} />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground hidden md:block">
                            {activity.description}
                          </p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{activity.user}</p>
                              <p className="text-sm text-muted-foreground">{activity.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(activity.timestamp, "PPpp")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={severity.variant}>{severity.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No Activities Found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;

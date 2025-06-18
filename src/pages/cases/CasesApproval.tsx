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
  FileText,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

// Mock case data
const caseData = [
  {
    id: "FF-2023-112",
    title: "State vs. Thompson",
    submittedBy: "Officer Johnson",
    submittedDate: "2025-04-08T08:30:00Z",
    status: "pending",
    priority: "high",
    fir: "FF-2023-112-FIR",
  },
  {
    id: "FF-2023-113",
    title: "People vs. Miller",
    submittedBy: "Officer Wilson",
    submittedDate: "2025-04-07T14:15:00Z",
    status: "pending",
    priority: "medium",
    fir: "FF-2023-113-FIR",
  },
  {
    id: "FF-2023-114",
    title: "State vs. Davis",
    submittedBy: "Officer Garcia",
    submittedDate: "2025-04-06T10:45:00Z",
    status: "pending",
    priority: "low",
    fir: "FF-2023-114-FIR",
  },
  {
    id: "FF-2023-115",
    title: "Commonwealth vs. Brown",
    submittedBy: "Officer Smith",
    submittedDate: "2025-04-05T16:20:00Z",
    status: "approved",
    priority: "high",
    fir: "FF-2023-115-FIR",
  },
  {
    id: "FF-2023-116",
    title: "State vs. Wilson",
    submittedBy: "Officer Lee",
    submittedDate: "2025-04-04T09:10:00Z",
    status: "rejected",
    priority: "medium",
    fir: "FF-2023-116-FIR",
  },
];

const CasesApproval = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleApprove = (caseId: string) => {
    toast({
      title: "Case Approved",
      description: `Case ${caseId} has been approved and created.`,
    });
  };

  const handleReject = (caseId: string) => {
    toast({
      title: "Case Rejected",
      description: `Case ${caseId} has been rejected.`,
    });
  };

  const handleRequestChanges = (caseId: string) => {
    toast({
      title: "Changes Requested",
      description: `Changes have been requested for case ${caseId}.`,
    });
  };

  // Filter cases based on search and filters
  const filteredCases = caseData
    .filter((caseItem) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          caseItem.id.toLowerCase().includes(query) ||
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.submittedBy.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((caseItem) => {
      // Status filter
      if (statusFilter === "all") return true;
      return caseItem.status === statusFilter;
    })
    .filter((caseItem) => {
      // Priority filter
      if (priorityFilter === "all") return true;
      return caseItem.priority === priorityFilter;
    })
    .filter((caseItem) => {
      // Date filter
      if (!date) return true;
      const caseDate = new Date(caseItem.submittedDate);
      return caseDate.toDateString() === date.toDateString();
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-forensic-warning text-forensic-900">
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-forensic-success text-white">Approved</Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-forensic-danger text-white">Rejected</Badge>
        );
      default:
        return <Badge className="bg-forensic-400 text-white">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-forensic-danger text-forensic-danger"
          >
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-forensic-warning text-forensic-warning"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="border-forensic-success text-forensic-success"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">
          Case Approval Queue
        </h1>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Pending (
              {caseData.filter((item) => item.status === "pending").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>
              Approved (
              {caseData.filter((item) => item.status === "approved").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span>
              Rejected (
              {caseData.filter((item) => item.status === "rejected").length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
            <Input
              placeholder="Search cases..."
              className="pl-8 border-forensic-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-forensic-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-forensic-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-forensic-500" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="border-forensic-200">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-forensic-200 w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span className="text-forensic-500">Filter by date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cases Pending Approval</CardTitle>
            <CardDescription>
              Review and process case creation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="border border-forensic-200 rounded-md p-4 hover:bg-forensic-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-forensic-court" />
                          <h3 className="font-medium text-forensic-900">
                            {caseItem.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-forensic-600">
                            Case ID: {caseItem.id}
                          </span>
                          <span className="text-sm text-forensic-600">
                            FIR: {caseItem.fir}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-forensic-600">
                            Submitted by {caseItem.submittedBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-forensic-600">
                            {new Date(caseItem.submittedDate).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2 justify-end">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(caseItem.status)}
                          {getPriorityBadge(caseItem.priority)}
                        </div>

                        {caseItem.status === "pending" && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-forensic-warning border-forensic-warning"
                              onClick={() => handleRequestChanges(caseItem.id)}
                            >
                              Request Changes
                            </Button>
                            <Button
                              size="sm"
                              className="bg-forensic-danger hover:bg-forensic-danger/90"
                              onClick={() => handleReject(caseItem.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-forensic-success hover:bg-forensic-success/90"
                              onClick={() => handleApprove(caseItem.id)}
                            >
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-forensic-500">
                    No cases found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CasesApproval;

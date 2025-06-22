import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  PlusCircle,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Eye,
  Pencil,
  FilePlus,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Mock FIR data
const firData = [
  {
    id: "FIR-2025-04-00120",
    title: "Unauthorized Data Access Incident",
    filedBy: "John Smith",
    filedDate: "2025-04-09T13:45:22Z",
    status: "pending",
    suspect: "Unknown",
    location: "Tech Corp HQ, 123 Main St",
    complainant: "Tech Corp Inc.",
  },
  {
    id: "FIR-2025-04-00119",
    title: "Enterprise Network Breach",
    filedBy: "Robert Johnson",
    filedDate: "2025-04-08T10:15:00Z",
    status: "verified",
    suspect: "Former Employee",
    location: "Finance Plus, 456 Business Ave",
    complainant: "Finance Plus LLC",
  },
  {
    id: "FIR-2025-04-00118",
    title: "Ransomware Attack",
    filedBy: "John Smith",
    filedDate: "2025-04-05T09:30:45Z",
    status: "assigned",
    suspect: "Hacking Group",
    location: "City Hospital, 789 Health Dr",
    complainant: "City General Hospital",
  },
  {
    id: "FIR-2025-04-00117",
    title: "Corporate Data Theft",
    filedBy: "Robert Johnson",
    filedDate: "2025-04-01T14:20:10Z",
    status: "processed",
    suspect: "Corporate Espionage",
    location: "Innovate Inc, 101 Tech Pkwy",
    complainant: "Innovate Inc.",
  },
  {
    id: "FIR-2025-03-00116",
    title: "Personal Device Compromise",
    filedBy: "John Smith",
    filedDate: "2025-03-28T16:45:30Z",
    status: "rejected",
    suspect: "Remote Attacker",
    location: "123 Residential St",
    complainant: "Jane Citizen",
  },
];

type FIRStatus = "pending" | "verified" | "assigned" | "processed" | "rejected";

const FIRStatusBadge: React.FC<{ status: FIRStatus }> = ({ status }) => {
  const statusConfig: Record<
    FIRStatus,
    { variant: BadgeProps["variant"]; icon: React.ReactNode; label: string }
  > = {
    pending: {
      variant: "warning",
      icon: <Clock className="h-3 w-3 mr-1.5" />,
      label: "Pending",
    },
    verified: {
      variant: "success",
      icon: <CheckCircle className="h-3 w-3 mr-1.5" />,
      label: "Verified",
    },
    assigned: {
      variant: "info",
      icon: <Archive className="h-3 w-3 mr-1.5" />,
      label: "Assigned",
    },
    processed: {
      variant: "success",
      icon: <CheckCircle className="h-3 w-3 mr-1.5" />,
      label: "Processed",
    },
    rejected: {
      variant: "destructive",
      icon: <AlertTriangle className="h-3 w-3 mr-1.5" />,
      label: "Rejected",
    },
  };

  const { variant, icon, label } = statusConfig[status];

  return (
    <Badge variant={variant} className="capitalize">
      {icon}
      {label}
    </Badge>
  );
};

const FIR = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const filteredFIRs = useMemo(
    () =>
      firData
        .filter((fir) => {
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              fir.id.toLowerCase().includes(query) ||
              fir.title.toLowerCase().includes(query) ||
              fir.filedBy.toLowerCase().includes(query) ||
              fir.complainant.toLowerCase().includes(query)
            );
          }
          return true;
        })
        .filter((fir) => {
          if (statusFilter === "all") return true;
          return fir.status === statusFilter;
        }),
    [searchQuery, statusFilter]
  );

  const handleCreateFIR = () => {
    navigate("/fir/new");
  };

  const handleViewFIR = (firId: string) => {
    toast({
      title: "Viewing FIR",
      description: `Opening details for FIR ${firId}`,
    });
  };

  const handleEditFIR = (firId: string) => {
    toast({
      title: "Edit FIR",
      description: `Opening edit form for FIR ${firId}`,
    });
  };

  const handleAddEvidence = (firId: string) => {
    navigate("/upload", { state: { firId } });
  };

  const handleRequestCaseCreation = (firId: string) => {
    toast({
      title: "Request Sent",
      description: `Case creation request sent for FIR ${firId}`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          First Information Reports
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse, manage, and track all filed First Information Reports.
        </p>
      </header>

      <Card className="border-border/40 shadow-lg">
        <CardHeader className="border-b border-border/40 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, title, complainant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border/60 focus:ring-primary w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-input border-border/60">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCreateFIR}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New FIR
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {filteredFIRs.length > 0 ? (
              filteredFIRs.map((fir) => (
                <div
                  key={fir.id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            {fir.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {fir.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-4">
                        <span className="font-medium">
                          Complainant:{" "}
                          <span className="font-normal text-muted-foreground">
                            {fir.complainant}
                          </span>
                        </span>
                        <span className="font-medium">
                          Filed By:{" "}
                          <span className="font-normal text-muted-foreground">
                            {fir.filedBy}
                          </span>
                        </span>
                        <span className="font-medium">
                          Date:{" "}
                          <span className="font-normal text-muted-foreground">
                            {new Date(fir.filedDate).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end justify-between gap-4 flex-shrink-0">
                      <FIRStatusBadge status={fir.status as FIRStatus} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewFIR(fir.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditFIR(fir.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit FIR</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddEvidence(fir.id)}>
                            <FilePlus className="mr-2 h-4 w-4" />
                            <span>Add Evidence</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRequestCaseCreation(fir.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            <span>Request Case Creation</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No FIRs Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No First Information Reports match your search criteria.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FIR;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  PanelRight,
  Eye,
  Pencil,
  FilePlus,
  MoreVertical,
} from "lucide-react";
// ...existing code...
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
    id: "FF-2023-120",
    title: "Unauthorized Data Access Incident",
    filedBy: "John Smith",
    filedDate: "2025-04-09T13:45:22Z",
    status: "pending",
    suspect: "Unknown",
    location: "Tech Corp HQ, 123 Main St",
    complainant: "Tech Corp Inc.",
  },
  {
    id: "FF-2023-119",
    title: "Enterprise Network Breach",
    filedBy: "Robert Johnson",
    filedDate: "2025-04-08T10:15:00Z",
    status: "verified",
    suspect: "Former Employee",
    location: "Finance Plus, 456 Business Ave",
    complainant: "Finance Plus LLC",
  },
  {
    id: "FF-2023-118",
    title: "Ransomware Attack",
    filedBy: "John Smith",
    filedDate: "2025-04-05T09:30:45Z",
    status: "assigned",
    suspect: "Hacking Group",
    location: "City Hospital, 789 Health Dr",
    complainant: "City General Hospital",
  },
  {
    id: "FF-2023-117",
    title: "Corporate Data Theft",
    filedBy: "Robert Johnson",
    filedDate: "2025-04-01T14:20:10Z",
    status: "processed",
    suspect: "Corporate Espionage",
    location: "Innovate Inc, 101 Tech Pkwy",
    complainant: "Innovate Inc.",
  },
  {
    id: "FF-2023-116",
    title: "Personal Device Compromise",
    filedBy: "John Smith",
    filedDate: "2025-03-28T16:45:30Z",
    status: "verified",
    suspect: "Remote Attacker",
    location: "123 Residential St",
    complainant: "Jane Citizen",
  },
];

const getFIRStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-forensic-warning/20 text-forensic-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "verified":
      return (
        <Badge className="bg-forensic-accent/20 text-forensic-accent">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    case "assigned":
      return (
        <Badge className="bg-forensic-court/20 text-forensic-court">
          <PanelRight className="h-3 w-3 mr-1" />
          Assigned
        </Badge>
      );
    case "processed":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Processed
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-forensic-danger/20 text-forensic-danger">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge className="bg-gray-200 text-gray-600">Unknown</Badge>;
  }
};

const FIR = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Filter FIRs based on search and filter
  const filteredFIRs = firData
    .filter((fir) => {
      // Search query filter
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
      // Status filter
      if (statusFilter === "all") return true;
      return fir.status === statusFilter;
    });

  const handleCreateFIR = () => {
    navigate("/fir/new");
  };

  const handleViewFIR = (firId: string) => {
    // This would navigate to a details page in a real implementation
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
        <h1 className="text-2xl font-bold text-forensic-800">
          First Information Reports
        </h1>
        <Button
          onClick={handleCreateFIR}
          className="bg-forensic-800 hover:bg-forensic-800/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>New FIR</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-500" />
          <Input
            placeholder="Search FIRs..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FIR List */}
      <div className="space-y-4">
        {filteredFIRs.map((fir) => (
          <Card
            key={fir.id}
            className="hover:shadow-md transition-all duration-200 border border-forensic-200"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-forensic-50 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-forensic-800" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-forensic-800">
                          {fir.id}
                        </h3>
                        {getFIRStatusBadge(fir.status)}
                      </div>
                      <p className="text-sm text-forensic-500">
                        Filed on {new Date(fir.filedDate).toLocaleDateString()}{" "}
                        by {fir.filedBy}
                      </p>
                    </div>
                  </div>

                  <p className="text-forensic-600 font-medium">{fir.title}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-forensic-600">
                    <span>
                      <strong>Complainant:</strong> {fir.complainant}
                    </span>
                    <span>
                      <strong>Suspect:</strong> {fir.suspect}
                    </span>
                    <span>
                      <strong>Location:</strong> {fir.location}
                    </span>
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleViewFIR(fir.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 flex items-center gap-1"
                    onClick={() => handleEditFIR(fir.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    className="bg-forensic-evidence hover:bg-forensic-evidence/90 h-8 flex items-center gap-1"
                    onClick={() => handleAddEvidence(fir.id)}
                  >
                    <FilePlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Evidence</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewFIR(fir.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-forensic-court"
                        onClick={() => handleRequestCaseCreation(fir.id)}
                      >
                        Request Case Creation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFIRs.length === 0 && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-forensic-400 mb-2" />
            <h3 className="text-lg font-medium text-forensic-800">
              No FIRs found
            </h3>
            <p className="text-forensic-500 mb-4">
              No first information reports match your search criteria
            </p>
            <Button
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FIR;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  PanelRight,
  Eye,
  FilePlus,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const getFIRStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-forensic-warning/20 text-forensic-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending Promotion
        </Badge>
      );

    case "promoted":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Promoted
        </Badge>
      );
    default:
      return <Badge className="bg-gray-200 text-gray-600">Unknown</Badge>;
  }
};

/** Helper: safely extract a display name from various shapes:
 * - string
 * - { name: string }
 * - [{ name: string }, ...]
 * - undefined/null
 */
const extractName = (val: any): string => {
  if (!val && val !== 0) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0) {
    // Supabase often returns relations as arrays
    return val[0]?.name ?? String(val[0]);
  }
  if (typeof val === "object") {
    return val.name ?? JSON.stringify(val);
  }
  return String(val);
};

const FIR = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const [firData, setFirData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from("fir").select(`
          *,
          suspect ( name ),
          complainant ( name )
        `);

      if (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load FIRs" });
      } else {
        setFirData(data || []);
      }
    };

    loadData();
  }, []);

  // Precompute display fields so we don't call extractName repeatedly in JSX
  const enrichedFIRs = firData.map((f) => ({
    ...f,
    complainantDisplay: extractName(f.complainant),
    suspectDisplay: extractName(f.suspect),
    filedByDisplay: extractName(f.filed_by ?? f.filedBy),
  }));

  const filteredFIRs = enrichedFIRs
    .filter((fir) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        String(fir.fir_id ?? "")
          .toLowerCase()
          .includes(q) ||
        String(fir.title ?? "")
          .toLowerCase()
          .includes(q) ||
        String(fir.filedByDisplay ?? "")
          .toLowerCase()
          .includes(q) ||
        String(fir.complainantDisplay ?? "")
          .toLowerCase()
          .includes(q)
      );
    })
    .filter((fir) => {
      if (statusFilter === "all") return true;
      return fir.status === statusFilter;
    });

  const handleCreateFIR = () => navigate("/fir/new");
  const handleViewFIR = (firId: string) => {
    toast({
      title: "Viewing FIR",
      description: `Opening details for FIR ${firId}`,
    });
    navigate(`/fir/view/${firId}`);
  };
  const handleAddEvidence = (firId: string) =>
    navigate("/upload", { state: { firId } });
  const handleRequestCaseCreation = (firId: string) =>
    toast({
      title: "Request Sent",
      description: `Case creation request sent for FIR ${firId}`,
    });

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
              <SelectItem value="promoted">Promoted</SelectItem>
              <SelectItem value="pending">Pending Promotion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFIRs.map((fir) => (
          <Card
            key={fir.fir_id ?? fir.id}
            className="hover:shadow-md transition-all duration-200 border border-forensic-200"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-forensic-50 p-2 rounded-full">
                      <FilePlus className="h-5 w-5 text-forensic-800" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-forensic-800">
                          {fir.fir_id}
                        </h3>
                        {getFIRStatusBadge(fir.status)}
                      </div>
                      <p className="text-sm text-forensic-500">
                        Filed on{" "}
                        {fir.filed_on
                          ? new Date(fir.filed_on).toLocaleDateString()
                          : ""}{" "}
                        by: Officer {fir.filedByDisplay}
                      </p>
                    </div>
                  </div>

                  <p className="text-forensic-600 font-medium">{fir.title}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-forensic-600">
                    <span>
                      <strong>Complainant:</strong> {fir.complainantDisplay}
                    </span>
                    <span>
                      <strong>Suspect:</strong> {fir.suspectDisplay}
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
                    onClick={() => handleViewFIR(fir.fir_id ?? fir.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>

                  <Button
                    size="sm"
                    className="bg-forensic-evidence hover:bg-forensic-evidence/90 h-8 flex items-center gap-1"
                    onClick={() => handleAddEvidence(fir.fir_id ?? fir.id)}
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
                      <DropdownMenuItem
                        onClick={() => handleViewFIR(fir.fir_id ?? fir.id)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-forensic-court"
                        onClick={() =>
                          handleRequestCaseCreation(fir.fir_id ?? fir.id)
                        }
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

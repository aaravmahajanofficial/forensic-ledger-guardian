import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FolderPlus,
  Search,
  Filter,
  ArrowUpDown,
  FileCheck,
  UserPlus,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Role } from "@/services/web3Service";
import web3Service from "@/services/web3Service";
import { useToast } from "@/hooks/use-toast";
import {
  roleManagementService,
  RoleAssignment,
} from "@/services/roleManagementService";

// ✅ Adjust this path to your actual Supabase client
import { supabase } from "@/lib/supabaseClient";

// UI Case type (unchanged)
type CaseData = {
  id: string;
  title: string;
  status: string;
  date: string;
  filedBy: string;
  evidenceCount: number;
  tags: string[];
  assignedOfficer: string | null;
};

// Exact shape of a row from public.cases
type SupabaseCaseRow = {
  case_id: string;
  type: string | null;
  title: string | null;
  description: string | null;
  filed_date: string | null; // Supabase returns date as string "YYYY-MM-DD"
  filed_by: string | null;
  tags;
  fir_id: string | null;
  assigned_officer: string | null;
};

const CaseList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useWeb3();
  const { toast } = useToast();

  const [cases, setCases] = React.useState<CaseData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Officer assignment state
  const [officers, setOfficers] = React.useState<RoleAssignment[]>([]);
  const [selectedOfficer, setSelectedOfficer] = React.useState<string>("");
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [showAssignDialog, setShowAssignDialog] = React.useState(false);
  const [selectedCaseId, setSelectedCaseId] = React.useState<string>("");

  // Only Court can create cases and assign officers
  const canCreateCase = user?.role === Role.Court || userRole === Role.Court;
  const canAssignOfficer = user?.role === Role.Court || userRole === Role.Court;

  // Shorten wallet address for display
  const shortenAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Load officers on component mount
  React.useEffect(() => {
    async function loadOfficers() {
      try {
        const officersList =
          await roleManagementService.getRoleAssignmentsByRole(Role.Officer);
        setOfficers(officersList);
        console.log("Loaded officers:", officersList);
      } catch (err) {
        console.error("Failed to fetch officers", err);
      }
    }
    loadOfficers();
  }, []);

  // Fetch cases
  React.useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("cases")
          .select(
            "case_id, type, title, description, filed_date, filed_by, tags, fir_id, assigned_officer"
          )
          .order("filed_date", { ascending: false });

        if (error) {
          console.error("Error fetching cases:", error);
          setError("Failed to load cases.");
          setCases([]);
          return;
        }

        const rows = (data || []) as SupabaseCaseRow[];

        const mapped: CaseData[] = rows.map((row) => {
          // tags is json: could already be string[] or something else
          let tags: string[] = [];
          if (Array.isArray(row.tags)) {
            tags = row.tags as string[];
          } else if (typeof row.tags === "string") {
            // if someone stored a JSON string
            try {
              const parsed = JSON.parse(row.tags);
              if (Array.isArray(parsed)) tags = parsed;
            } catch {
              // ignore parse error
            }
          }

          return {
            id: row.case_id,
            title: row.title || "Untitled Case",
            // status not in DB => derive from type or default
            status: row.type || "open",
            // filed_date is "YYYY-MM-DD" => keep as string ISO-ish
            date: row.filed_date || new Date().toISOString(),
            filedBy: row.filed_by || "Unknown",
            // evidenceCount not in DB yet => default 0 (or later from blockchain)
            evidenceCount: 0,
            tags,
            assignedOfficer: row.assigned_officer || null,
          };
        });

        setCases(mapped);
      } catch (err) {
        console.error("Unexpected error while loading cases:", err);
        setError("Something went wrong while loading cases.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Handle opening the assign dialog
  const handleOpenAssignDialog = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedCaseId(caseId);
    setSelectedOfficer("");
    setShowAssignDialog(true);
  };

  // Handle officer assignment
  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      toast({
        title: "No Officer Selected",
        description: "Please select an officer to assign to this case.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCaseId) {
      toast({
        title: "No Case Selected",
        description: "Please select a case to assign the officer to.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);

    try {
      console.log(
        `Assigning officer ${selectedOfficer} to case ${selectedCaseId}`
      );

      // Call blockchain to assign role
      const success = await web3Service.assignCaseRole(
        selectedCaseId,
        selectedOfficer,
        Role.Officer
      );

      if (success) {
        // Update Supabase with assigned officer
        const { error: updateError } = await supabase
          .from("cases")
          .update({ assigned_officer: selectedOfficer })
          .eq("case_id", selectedCaseId);

        if (updateError) {
          console.error(
            "Error updating case assignment in Supabase:",
            updateError
          );
        }

        // Update local state
        setCases((prevCases) =>
          prevCases.map((c) =>
            c.id === selectedCaseId
              ? { ...c, assignedOfficer: selectedOfficer }
              : c
          )
        );

        toast({
          title: "Officer Assigned",
          description: `Officer ${shortenAddress(
            selectedOfficer
          )} has been assigned to case ${selectedCaseId}`,
        });

        setShowAssignDialog(false);
        setSelectedOfficer("");
        setSelectedCaseId("");
      } else {
        throw new Error("Assignment transaction failed");
      }
    } catch (error) {
      console.error("Officer assignment error:", error);
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign officer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleNewCase = () => {
    navigate("/cases/create");
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge className="bg-forensic-accent">Open</Badge>;
      case "active":
        return <Badge className="bg-forensic-evidence">Active</Badge>;
      case "review":
        return <Badge className="bg-forensic-warning">Under Review</Badge>;
      case "closed":
        return (
          <Badge variant="outline" className="text-forensic-500">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">
          Case Management
        </h1>
        {canCreateCase && (
          <Button
            onClick={handleNewCase}
            className="bg-forensic-accent hover:bg-forensic-accent/90"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Repository</CardTitle>
          <CardDescription>
            Browse and manage case files, evidence, and related information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forensic-400" />
              <Input placeholder="Search cases..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <p className="text-sm text-forensic-500">Loading cases...</p>
          )}

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          {!loading && !error && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Case ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed Date</TableHead>
                    <TableHead>Filed By</TableHead>
                    <TableHead>Assigned Officer</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow
                      key={caseItem.id}
                      className="cursor-pointer hover:bg-forensic-50"
                      onClick={() => handleCaseClick(caseItem.id)}
                    >
                      <TableCell className="font-medium">
                        {caseItem.id}
                      </TableCell>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                      <TableCell>
                        {new Date(caseItem.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{caseItem.filedBy}</TableCell>
                      <TableCell>
                        {caseItem.assignedOfficer ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-forensic-officer" />
                            <span className="font-mono text-xs">
                              {shortenAddress(caseItem.assignedOfficer)}
                            </span>
                          </div>
                        ) : canAssignOfficer ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) =>
                              handleOpenAssignDialog(caseItem.id, e)
                            }
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-500"
                          >
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileCheck className="h-4 w-4 text-forensic-accent mr-1" />
                          <span>{caseItem.evidenceCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {cases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No cases found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Officer Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-forensic-officer" />
              Assign Officer to Case
            </DialogTitle>
            <DialogDescription>
              Case ID:{" "}
              <span className="font-mono font-semibold">{selectedCaseId}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="officerSelectDialog">Select Officer</Label>
              <Select
                value={selectedOfficer}
                onValueChange={setSelectedOfficer}
                disabled={isAssigning}
              >
                <SelectTrigger id="officerSelectDialog">
                  <SelectValue placeholder="Choose an officer to assign" />
                </SelectTrigger>
                <SelectContent>
                  {officers.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      No officers available
                    </div>
                  ) : (
                    officers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.address}>
                        <span className="font-mono text-sm">
                          {officer.address}
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {officers.length} officer{officers.length !== 1 ? "s" : ""}{" "}
                available for assignment
              </p>
            </div>

            <div className="flex flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowAssignDialog(false)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignOfficer}
                disabled={isAssigning || !selectedOfficer}
                className="bg-forensic-court text-white w-1/2 hover:bg-forensic-court/90"
              >
                {isAssigning ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseList;

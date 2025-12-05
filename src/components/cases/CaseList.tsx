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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FolderPlus,
  Search,
  Filter,
  ArrowUpDown,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Role } from "@/services/web3Service";

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
};

const CaseList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useWeb3();

  const [cases, setCases] = React.useState<CaseData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Only Court can create cases (not Officer)
  const canCreateCase = user?.role === Role.Court || userRole === Role.Court;

  React.useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("cases")
          .select(
            "case_id, type, title, description, filed_date, filed_by, tags, fir_id"
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

          {error && (
            <p className="text-sm text-red-500 mb-2">{error}</p>
          )}

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
                      <TableCell colSpan={7} className="text-center py-6">
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
    </div>
  );
};

export default CaseList;

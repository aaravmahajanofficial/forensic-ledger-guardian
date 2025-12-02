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

// Case data type
type CaseData = {
  id: string;
  title: string;
  status: string;
  date: string;
  filedBy: string;
  evidenceCount: number;
  tags: string[];
};

// Mock data for cases
const mockCases: CaseData[] = [
  {
    id: "FF-2023-089",
    title: "Tech Corp Data Breach",
    status: "open",
    date: "2023-04-08T10:30:00Z",
    filedBy: "Officer Johnson",
    evidenceCount: 8,
    tags: ["cybercrime", "data breach", "corporate"],
  },
  {
    id: "FF-2023-092",
    title: "Financial Fraud Investigation",
    status: "active",
    date: "2023-04-05T14:15:00Z",
    filedBy: "Detective Williams",
    evidenceCount: 12,
    tags: ["fraud", "financial", "evidence collection"],
  },
  {
    id: "FF-2023-104",
    title: "Intellectual Property Theft",
    status: "review",
    date: "2023-03-28T09:45:00Z",
    filedBy: "Specialist Chen",
    evidenceCount: 5,
    tags: ["ip theft", "corporate espionage"],
  },
  {
    id: "FF-2023-118",
    title: "Server Room Security Breach",
    status: "closed",
    date: "2023-03-15T16:20:00Z",
    filedBy: "Officer Martinez",
    evidenceCount: 10,
    tags: ["physical breach", "security", "theft"],
  },
];

const CaseList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useWeb3();
  const [cases, setCases] = React.useState<CaseData[]>([]);

  // Only Court can create cases (not Officer)
  // Check both AuthContext (email auth) and Web3Context (wallet auth)
  const canCreateCase = user?.role === Role.Court || userRole === Role.Court;

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("forensicLedgerCases");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCases(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore and fallback to mock
    }

    setCases(mockCases);
  }, []);

  const handleNewCase = () => {
    navigate("/cases/create");
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseList;

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderPlus,
  Search,
  ListFilter,
  ArrowUpDown,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Archive,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaseData } from "@/types/case"; // Assuming a more detailed case type

// Enhanced Mock data for cases
const mockCases: CaseData[] = [
  {
    id: "FF-2023-089",
    title: "Tech Corp Data Breach",
    status: "open",
    dateCreated: "2023-04-08T10:30:00Z",
    courtDate: "2025-08-15T10:00:00Z",
    filingOfficer: "Officer Johnson",
    assignedJudge: "Judge Eva Rostova",
    description: "A major data breach at a leading tech corporation, potential exfiltration of user data.",
    evidenceCount: 8,
    parties: [{ name: "Tech Corp", role: "Victim" }, { name: "John Doe", role: "Suspect" }],
    evidenceItems: [],
    timeline: [],
    tags: ["cybercrime", "data breach", "corporate"],
  },
  {
    id: "FF-2023-092",
    title: "Financial Fraud Investigation",
    status: "active",
    dateCreated: "2023-04-05T14:15:00Z",
    courtDate: "2025-09-01T09:00:00Z",
    filingOfficer: "Detective Williams",
    assignedJudge: "Judge Arthur Pendragon",
    description: "Investigation into a multi-level marketing scheme with suspected fraudulent activities.",
    evidenceCount: 12,
    parties: [],
    evidenceItems: [],
    timeline: [],
    tags: ["fraud", "financial", "evidence collection"],
  },
  {
    id: "FF-2023-104",
    title: "Intellectual Property Theft",
    status: "review",
    dateCreated: "2023-03-28T09:45:00Z",
    courtDate: "2025-07-20T14:00:00Z",
    filingOfficer: "Specialist Chen",
    assignedJudge: "Judge Alistair Finch",
    description: "Allegations of intellectual property theft from a rival company.",
    evidenceCount: 5,
    parties: [],
    evidenceItems: [],
    timeline: [],
    tags: ["ip theft", "corporate espionage"],
  },
  {
    id: "FF-2023-118",
    title: "Server Room Security Breach",
    status: "closed",
    dateCreated: "2023-03-15T16:20:00Z",
    courtDate: "2024-05-10T11:00:00Z",
    filingOfficer: "Officer Martinez",
    assignedJudge: "Judge Evelyn Reed",
    description: "Unauthorized physical access to a secure server room, resulting in data theft.",
    evidenceCount: 10,
    parties: [],
    evidenceItems: [],
    timeline: [],
    tags: ["physical breach", "security", "theft"],
  },
];


const CaseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date-desc");

  const handleNewCase = () => {
    navigate("/cases/create");
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="border-blue-500 bg-blue-500/10 text-blue-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Open
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500">
            <ShieldCheck className="mr-1 h-3 w-3" /> Active
          </Badge>
        );
      case "review":
        return (
          <Badge variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-500">
            <Clock className="mr-1 h-3 w-3" /> Review
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            <Archive className="mr-1 h-3 w-3" /> Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAndSortedCases = useMemo(() => {
    return mockCases
      .filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter((c) => (statusFilter ? c.status === statusFilter : true))
      .sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
          case "date-desc":
            return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [searchTerm, statusFilter, sortBy]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Case Repository
          </h1>
          <p className="text-muted-foreground">
            Browse, manage, and analyze all case files.
          </p>
        </div>
        <Button onClick={handleNewCase} size="lg">
          <FolderPlus className="mr-2 h-5 w-5" />
          Register New Case
        </Button>
      </header>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by Case ID, Title, or Tag..."
                className="pl-10 py-2 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter by Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("open")}>Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("review")}>Review</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("date-desc")}>Newest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date-asc")}>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title-asc")}>Title (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title-desc")}>Title (Z-A)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedCases.length > 0 ? (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="flex flex-col justify-between hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm text-muted-foreground">{caseItem.id}</div>
                  {getStatusBadge(caseItem.status)}
                </div>
                <CardTitle className="text-lg leading-tight">{caseItem.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>
                    <strong>Filed:</strong>{" "}
                    {formatDistanceToNow(new Date(caseItem.dateCreated), { addSuffix: true })}
                  </div>
                  <div>
                    <strong>Officer:</strong> {caseItem.filingOfficer}
                  </div>
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 text-primary mr-2" />
                    <strong>{caseItem.evidenceCount}</strong>
                    <span className="ml-1">Evidence Items</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {caseItem.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleCaseClick(caseItem.id)}
                  className="w-full"
                  variant="outline"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No Cases Found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default CaseList;

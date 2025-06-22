import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FileDigit,
  Search,
  FileX,
  Eye,
  Download,
  FileLock2,
  RefreshCcw,
  Briefcase,
  ListFilter,
  LayoutGrid,
  List,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EvidenceItem, useEvidenceManager } from "@/hooks/useEvidenceManager";
import { useNavigate, useLocation } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion, AnimatePresence } from "framer-motion";

// Format bytes to human-readable size
const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const Evidence = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCaseId = queryParams.get("caseId") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [caseFilter, setCaseFilter] = useState(initialCaseId);
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { evidence, isLoading, refetch } = useEvidenceManager();

  const uniqueCaseIds = useMemo(
    () => [...new Set(evidence.map((item) => item.caseId))],
    [evidence]
  );

  const filteredEvidence = useMemo(() => {
    return evidence
      .filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.caseId.toLowerCase().includes(query)
        );
      })
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => caseFilter === "all" || item.caseId === caseFilter)
      .sort((a, b) => {
        const dateA = new Date(a.submittedDate).getTime();
        const dateB = new Date(b.submittedDate).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [evidence, searchQuery, typeFilter, caseFilter, sortOrder]);

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Evidence Refreshed",
      description: "The evidence list has been updated.",
      variant: "default",
    });
  };

  const handleVerify = (id: string) => navigate(`/verify?evidenceId=${id}`);
  const handleView = (id: string) => alert(`Viewing details for ${id}`);
  const handleDownload = (id: string) => alert(`Downloading evidence ${id}`);

  return (
    <div className="space-y-8">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-foreground">Evidence Locker</h1>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ListFilter className="h-5 w-5 mr-2 text-primary" />
                Filter & Sort
              </div>
              <div className="flex items-center space-x-2">
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => {
                    if (value === "grid" || value === "list") {
                      setViewMode(value);
                    }
                  }}
                  defaultValue="grid"
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={caseFilter} onValueChange={setCaseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                {uniqueCaseIds.map((caseId) => (
                  <SelectItem key={caseId} value={caseId}>
                    {caseId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading evidence...</p>
          </div>
        ) : filteredEvidence.length === 0 ? (
          <Card className="text-center py-12 bg-card">
            <CardHeader>
              <div className="mx-auto bg-secondary/10 rounded-full p-4 w-fit">
                <FileX className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="mt-4">No Evidence Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredEvidence.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {viewMode === "grid" ? (
                    <EvidenceGridItem
                      item={item}
                      onVerify={handleVerify}
                      onView={handleView}
                      onDownload={handleDownload}
                    />
                  ) : (
                    <EvidenceListItem
                      item={item}
                      onVerify={handleVerify}
                      onView={handleView}
                      onDownload={handleDownload}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

const EvidenceGridItem = ({
  item,
  onVerify,
  onView,
  onDownload,
}: {
  item: EvidenceItem;
  onVerify: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}) => (
  <Card className="bg-card hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <CardHeader>
      <div className="flex items-start justify-between">
        <FileDigit className="h-8 w-8 text-primary" />
        <Badge variant={item.status === "verified" ? "success" : "warning"}>
          {item.status}
        </Badge>
      </div>
      <CardTitle className="pt-4 text-lg truncate">{item.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-sm text-muted-foreground space-y-2">
        <p className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2" /> Case: {item.caseId}
        </p>
        <p>Size: {formatBytes(item.size)}</p>
        <p>Submitted: {new Date(item.submittedDate).toLocaleDateString()}</p>
      </div>
    </CardContent>
    <div className="p-4 border-t flex items-center justify-end space-x-2">
      <Button variant="outline" size="sm" onClick={() => onView(item.id)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onDownload(item.id)}>
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="default" size="sm" onClick={() => onVerify(item.id)}>
        <FileLock2 className="h-4 w-4 mr-2" /> Verify
      </Button>
    </div>
  </Card>
);

const EvidenceListItem = ({
  item,
  onVerify,
  onView,
  onDownload,
}: {
  item: EvidenceItem;
  onVerify: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}) => (
  <Card className="bg-card hover:shadow-lg transition-shadow duration-300 flex items-center p-4">
    <FileDigit className="h-8 w-8 text-primary mr-4" />
    <div className="flex-grow grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
      <p className="font-semibold truncate col-span-2 md:col-span-1">
        {item.name}
      </p>
      <p className="text-muted-foreground">
        <Briefcase className="h-4 w-4 mr-2 inline" />
        {item.caseId}
      </p>
      <p className="text-muted-foreground">{formatBytes(item.size)}</p>
      <div className="flex justify-start">
        <Badge variant={item.status === "verified" ? "success" : "warning"}>
          {item.status}
        </Badge>
      </div>
      <div className="flex items-center justify-end space-x-2 col-span-2 md:col-span-1">
        <Button variant="outline" size="sm" onClick={() => onView(item.id)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDownload(item.id)}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="default" size="sm" onClick={() => onVerify(item.id)}>
          <FileLock2 className="h-4 w-4 mr-2" /> Verify
        </Button>
      </div>
    </div>
  </Card>
);

export default Evidence;

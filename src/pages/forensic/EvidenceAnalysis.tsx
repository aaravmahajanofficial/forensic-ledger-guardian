import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileDigit,
  Download,
  ChevronRight,
  Save,
  Share2,
  Fingerprint,
  FileText,
  Network,
  Clock,
  FileUp,
  FileX2,
  FileCheck2,
} from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock evidence data
const evidenceItems = [
  {
    id: "EV-2023-421",
    name: "Network Traffic Log",
    type: "log",
    fileSize: "4.2 MB",
    uploadedOn: "2025-04-09T14:32:00Z",
    hash: "0x8a7b561c4de93f2b7af3ab36a335d4df91d173c7",
    caseId: "FF-2023-089",
    analysisStatus: "In Progress",
    analysisProgress: 75,
    findings: "Unusual data transfer pattern detected at 14:23:15",
    analyst: "Dr. Evelyn Reed",
  },
  {
    id: "EV-2023-420",
    name: "Server Access Logs",
    type: "log",
    fileSize: "2.8 MB",
    uploadedOn: "2025-04-09T10:12:00Z",
    hash: "0x9c3fed4771290b8431f43c29c6c056a3b4cb31a2",
    caseId: "FF-2023-092",
    analysisStatus: "Completed",
    analysisProgress: 100,
    findings: "Unauthorized access attempts from external IP.",
    analyst: "Dr. Evelyn Reed",
  },
  {
    id: "EV-2023-419",
    name: "Email Backup",
    type: "email",
    fileSize: "156 MB",
    uploadedOn: "2025-04-08T16:47:00Z",
    hash: "0x45f6d1a54e7b89c23f1abd4ca78931e2d5f2d80c",
    caseId: "FF-2023-092",
    analysisStatus: "Pending",
    analysisProgress: 30,
    findings: "Awaiting keyword analysis.",
    analyst: "Dr. Kenji Tanaka",
  },
  {
    id: "EV-2023-418",
    name: "Hard Drive Image",
    type: "disk",
    fileSize: "500 GB",
    uploadedOn: "2025-04-07T11:30:00Z",
    hash: "0x2d5f81a9c7b34e9d60fe78223f1d5c94b6a08715",
    caseId: "FF-2023-104",
    analysisStatus: "In Progress",
    analysisProgress: 45,
    findings: "Multiple deleted files recovered, analyzing content.",
    analyst: "Dr. Evelyn Reed",
  },
];

type Evidence = typeof evidenceItems[0];

const getStatusVariant = (status: string): BadgeProps["variant"] => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "secondary";
    case "Pending":
      return "warning";
    default:
      return "default";
  }
};

const getIconForType = (type: string) => {
  switch (type) {
    case "log":
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    case "email":
      return <FileUp className="h-5 w-5 text-muted-foreground" />;
    case "disk":
      return <FileCheck2 className="h-5 w-5 text-muted-foreground" />;
    default:
      return <FileDigit className="h-5 w-5 text-muted-foreground" />;
  }
};

const EvidenceAnalysis = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(
    evidenceItems[0]
  );
  const { toast } = useToast();

  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: `Analysis report for ${selectedEvidence?.id} has been saved.`,
      variant: "default",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Report Shared",
      description: `Analysis report for ${selectedEvidence?.id} has been securely shared.`,
      variant: "default",
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Forensic Evidence Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Analyze, document, and report on digital evidence.
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Evidence Queue</h2>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b border-border p-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search evidence..." className="pl-8" />
                  </div>
                  <div className="mt-4">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {evidenceItems.map((item) => (
                    <button
                      key={item.id}
                      className={`flex w-full items-center gap-4 border-b border-border p-4 text-left transition-colors hover:bg-muted/40 ${
                        selectedEvidence?.id === item.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedEvidence(item)}
                    >
                      <div className="flex-shrink-0">
                        {getIconForType(item.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.id}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedEvidence ? (
              <Card>
                <CardHeader className="border-b border-border bg-muted/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileDigit className="h-6 w-6" />
                        {selectedEvidence.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Case ID: {selectedEvidence.caseId}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusVariant(selectedEvidence.analysisStatus)}
                    >
                      {selectedEvidence.analysisStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        Analysis Progress
                      </h3>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={selectedEvidence.analysisProgress}
                          className="flex-1"
                        />
                        <span className="font-mono text-sm">
                          {selectedEvidence.analysisProgress}%
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Fingerprint className="h-5 w-5" />
                            Metadata
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>ID:</strong> {selectedEvidence.id}
                            </p>
                            <p>
                              <strong>Type:</strong> {selectedEvidence.type}
                            </p>
                            <p>
                              <strong>Size:</strong> {selectedEvidence.fileSize}
                            </p>
                            <p>
                              <strong>Uploaded:</strong>{" "}
                              {new Date(
                                selectedEvidence.uploadedOn
                              ).toLocaleString()}
                            </p>
                            <p>
                              <strong>Analyst:</strong>{" "}
                              {selectedEvidence.analyst}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <FileCheck2 className="h-5 w-5" />
                            Integrity Hash (SHA-256)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="break-all font-mono text-sm">
                            {selectedEvidence.hash}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            Verify Hash
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Findings</h3>
                      <Card className="bg-muted/20">
                        <CardContent className="p-4">
                          <p className="italic">{selectedEvidence.findings}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        Analysis Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline">
                          <Network className="mr-2 h-4 w-4" />
                          Network Analysis
                        </Button>
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          File Content Analysis
                        </Button>
                        <Button variant="outline">
                          <Clock className="mr-2 h-4 w-4" />
                          Timeline Analysis
                        </Button>
                        <Button variant="outline">
                          <FileX2 className="mr-2 h-4 w-4" />
                          Deleted File Recovery
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border bg-muted/40 p-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Evidence
                  </Button>
                  <Button onClick={handleSaveReport}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Report
                  </Button>
                  <Button variant="secondary" onClick={handleShareReport}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 p-12 text-center">
                <div>
                  <FileDigit className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Select Evidence to Analyze
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose an item from the queue to view its details and begin
                    analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvidenceAnalysis;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileDigit,
  Download,
  ChevronRight,
  Save,
  CheckCircle,
  Share2,
  Fingerprint,
  FileText,
  Network,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

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
    metadata: {
      source: "Server Room Camera 2",
      timeframe: "Apr 8 13:20 - 15:45",
      format: "PCAP",
      analysisStatus: 75,
      findings: "Unusual data transfer pattern detected at 14:23:15",
    },
  },
  {
    id: "EV-2023-420",
    name: "Server Access Logs",
    type: "log",
    fileSize: "2.8 MB",
    uploadedOn: "2025-04-09T10:12:00Z",
    hash: "0x9c3fed4771290b8431f43c29c6c056a3b4cb31a2",
    caseId: "FF-2023-092",
    metadata: {
      source: "Main Database Server",
      timeframe: "Apr 7 08:00 - 20:00",
      format: "TXT",
      analysisStatus: 90,
      findings: "Unauthorized access attempts from external IP",
    },
  },
  {
    id: "EV-2023-419",
    name: "Email Backup",
    type: "email",
    fileSize: "156 MB",
    uploadedOn: "2025-04-08T16:47:00Z",
    hash: "0x45f6d1a54e7b89c23f1abd4ca78931e2d5f2d80c",
    caseId: "FF-2023-092",
    metadata: {
      source: "Exchange Server Backup",
      timeframe: "Last 30 days",
      format: "PST",
      analysisStatus: 30,
      findings: "Analysis in progress",
    },
  },
  {
    id: "EV-2023-418",
    name: "Hard Drive Image",
    type: "disk",
    fileSize: "500 GB",
    uploadedOn: "2025-04-07T11:30:00Z",
    hash: "0x2d5f81a9c7b34e9d60fe78223f1d5c94b6a08715",
    caseId: "FF-2023-104",
    metadata: {
      source: "Workstation HD-1234",
      timeframe: "Full disk",
      format: "E01",
      analysisStatus: 45,
      findings: "Multiple deleted files recovered, analyzing content",
    },
  },
  {
    id: "EV-2023-415",
    name: "Mobile Extraction",
    type: "mobile",
    fileSize: "8.4 GB",
    uploadedOn: "2025-04-06T09:15:00Z",
    hash: "0xd15a74c98b62f532e97a1c4f690cb8743ee1f90b",
    caseId: "FF-2023-118",
    metadata: {
      source: "iPhone 13 - SN:78452XYZ",
      timeframe: "Full extraction",
      format: "UFDR",
      analysisStatus: 80,
      findings: "Message exchanges of interest found in encrypted chat",
    },
  },
];

const EvidenceAnalysis = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedEvidence, setSelectedEvidence] = useState(evidenceItems[0]);
  const [activeTab, setActiveTab] = useState("details");
  const [analysisRunning, setAnalysisRunning] = useState(false);

  const handleAnalyze = (item: (typeof evidenceItems)[0]) => {
    setSelectedEvidence(item);
    toast({
      title: "Evidence Selected",
      description: `Now analyzing: ${item.name}`,
    });
  };

  const handleSaveAnalysis = () => {
    toast({
      title: "Analysis Saved",
      description: `Analysis for ${selectedEvidence.name} has been saved successfully.`,
      variant: "default",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${selectedEvidence.name}...`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Dialog",
      description: "Share options opened. Select users to share with.",
    });
  };

  const handleToolClick = (toolName: string) => {
    toast({
      title: `${toolName} Tool`,
      description: `Opening ${toolName} tool for ${selectedEvidence.name}`,
    });

    if (toolName === "Hash Verification") {
      setActiveTab("metadata");
    }
  };

  const handleGenerateReport = () => {
    setAnalysisRunning(true);

    setTimeout(() => {
      setAnalysisRunning(false);
      toast({
        title: "Report Generated",
        description: `Forensic analysis report for ${selectedEvidence.name} has been generated.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800">
        Evidence Analysis Workspace
      </h1>

      {/* Evidence Selection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Select Evidence for Analysis
          </CardTitle>
          <CardDescription>
            Choose evidence to analyze from your assigned cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evidence ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Analysis Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={
                      selectedEvidence.id === item.id ? "bg-forensic-50" : ""
                    }
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.type === "log"
                            ? "bg-forensic-accent/20 text-forensic-accent"
                            : item.type === "email"
                            ? "bg-forensic-evidence/20 text-forensic-evidence"
                            : item.type === "disk"
                            ? "bg-forensic-court/20 text-forensic-court"
                            : "bg-forensic-warning/20 text-forensic-warning"
                        }
                      >
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.caseId}</TableCell>
                    <TableCell>{item.fileSize}</TableCell>
                    <TableCell>
                      {new Date(item.uploadedOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={item.metadata.analysisStatus}
                          className="h-2 w-24"
                        />
                        <span className="text-sm">
                          {item.metadata.analysisStatus}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-forensic-accent hover:bg-forensic-accent/90"
                        onClick={() => handleAnalyze(item)}
                      >
                        Analyze
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <FileDigit className="h-5 w-5 mr-2 text-forensic-accent" />
                  Evidence Analyzer: {selectedEvidence.name}
                </CardTitle>
                <CardDescription>
                  Evidence ID: {selectedEvidence.id} | Case:{" "}
                  {selectedEvidence.caseId}
                </CardDescription>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="bg-forensic-50 p-4 rounded-md border border-forensic-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-forensic-500">Evidence Hash</p>
                      <p className="font-mono text-sm">
                        {selectedEvidence.hash}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">File Size</p>
                      <p>{selectedEvidence.fileSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Source</p>
                      <p>{selectedEvidence.metadata.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Timeframe</p>
                      <p>{selectedEvidence.metadata.timeframe}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-forensic-200 rounded-md p-4 h-56 flex items-center justify-center">
                  <div className="text-center">
                    <Search className="h-8 w-8 text-forensic-300 mx-auto mb-2" />
                    <p className="text-sm text-forensic-500">
                      Evidence preview would appear here in a real
                      implementation
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-forensic-200 rounded-md bg-forensic-50">
                  <h4 className="font-medium mb-2">Analysis Findings</h4>
                  <p className="text-forensic-600">
                    {selectedEvidence.metadata.findings}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="border border-forensic-200 rounded-md p-4">
                  <h4 className="font-medium mb-2">Technical Metadata</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-sm py-1 border-b border-forensic-100">
                      <span className="text-forensic-500">File Format</span>
                      <span className="col-span-2">
                        {selectedEvidence.metadata.format}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm py-1 border-b border-forensic-100">
                      <span className="text-forensic-500">Created Date</span>
                      <span className="col-span-2">
                        {new Date(selectedEvidence.uploadedOn).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm py-1 border-b border-forensic-100">
                      <span className="text-forensic-500">Modified Date</span>
                      <span className="col-span-2">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm py-1 border-b border-forensic-100">
                      <span className="text-forensic-500">Hash Algorithm</span>
                      <span className="col-span-2">SHA-256</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm py-1">
                      <span className="text-forensic-500">
                        Chain of Custody
                      </span>
                      <span className="col-span-2">
                        Verified (3 transactions)
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Event Timeline</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        toast({
                          title: "Filter Applied",
                          description: "Timeline events have been filtered.",
                        })
                      }
                    >
                      <Clock className="h-4 w-4" />
                      <span>Filter Events</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Timeline items would go here */}
                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-forensic-accent"></div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Evidence uploaded</p>
                          <span className="text-sm text-forensic-500">
                            {new Date(
                              selectedEvidence.uploadedOn
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-forensic-600">
                          Evidence file uploaded to the system by Dr. Anderson
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-forensic-accent"></div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Evidence hash verified</p>
                          <span className="text-sm text-forensic-500">
                            {new Date(
                              selectedEvidence.uploadedOn
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-forensic-600">
                          Hash verification completed and recorded to blockchain
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-2 w-2 rounded-full bg-forensic-accent"></div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Analysis started</p>
                          <span className="text-sm text-forensic-500">
                            {new Date(
                              selectedEvidence.uploadedOn
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-forensic-600">
                          Automated analysis process initiated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="report">
                <div className="space-y-4">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleGenerateReport}
                      disabled={analysisRunning}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Generate Report</span>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-1"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-forensic-300 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">
                          Generate Analysis Report
                        </h4>
                        <p className="text-sm text-forensic-500 mb-4">
                          Create a detailed forensic analysis report for this
                          evidence item
                        </p>
                        <Button
                          className="bg-forensic-accent hover:bg-forensic-accent/90"
                          onClick={handleGenerateReport}
                          disabled={analysisRunning}
                        >
                          {analysisRunning
                            ? "Generating..."
                            : "Generate Report"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-forensic-50 border-t border-forensic-100">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <Badge className="bg-forensic-accent text-white mr-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Analysis in progress
                </Badge>
                <span className="text-sm text-forensic-600">
                  {selectedEvidence.metadata.analysisStatus}% Complete
                </span>
              </div>
              <Button
                className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-1"
                onClick={handleSaveAnalysis}
              >
                <Save className="h-4 w-4" />
                <span>Save Analysis</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Analysis Tools Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => handleToolClick("Hash Verification")}
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              <span>Hash Verification</span>
            </Button>

            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => handleToolClick("Data Search")}
            >
              <Search className="h-4 w-4 mr-2" />
              <span>Data Search</span>
            </Button>

            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => handleToolClick("Metadata Extractor")}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>Metadata Extractor</span>
            </Button>

            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => handleToolClick("Relationship Mapping")}
            >
              <Network className="h-4 w-4 mr-2" />
              <span>Relationship Mapping</span>
            </Button>

            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => handleToolClick("Timeline Generator")}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>Timeline Generator</span>
            </Button>

            <div className="p-4 bg-forensic-warning/10 border border-forensic-warning/20 rounded-md">
              <h4 className="flex items-center text-sm font-medium text-forensic-warning">
                <CheckCircle className="h-4 w-4 mr-1" />
                Analysis Running
              </h4>
              <p className="text-xs text-forensic-600 mt-1">
                Automated analysis running on {selectedEvidence.name}. Estimated
                completion time: 25 minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvidenceAnalysis;

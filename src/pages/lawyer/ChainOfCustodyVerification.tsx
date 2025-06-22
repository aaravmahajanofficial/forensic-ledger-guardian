import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileLock2,
  Search,
  FileDigit,
  CheckCircle2,
  FileCheck2,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  History,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvidenceManager, EvidenceItem } from "@/hooks/useEvidenceManager";
import ChainOfCustody from "@/components/chainOfCustody/ChainOfCustody";

type CustodyEvent = {
  actor: string;
  action: string;
  timestamp: string;
  notes?: string;
  verified: boolean;
};

const ChainOfCustodyVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const evidenceIdParam = searchParams.get("evidenceId");

  const [evidenceId, setEvidenceId] = useState(evidenceIdParam || "");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    null
  );
  const [custodyChain, setCustodyChain] = useState<CustodyEvent[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  const { evidence, verifyEvidence } = useEvidenceManager();

  useEffect(() => {
    if (evidenceIdParam && evidenceIdParam !== evidenceId) {
      setEvidenceId(evidenceIdParam);
    }
  }, [evidenceIdParam, evidenceId]);

  useEffect(() => {
    if (evidenceId) {
      const found = evidence.find((item) => item.id === evidenceId);
      if (found) {
        setSelectedEvidence(found);

        // Generate chain of custody events
        const mockChain: CustodyEvent[] = [
          {
            actor: "Officer Johnson",
            action: "Collection",
            timestamp: new Date(found.submittedDate).toISOString(),
            notes: "Initial collection of evidence from the scene.",
            verified: true,
          },
          {
            actor: "Evidence Technician Smith",
            action: "Processing",
            timestamp: new Date(
              new Date(found.submittedDate).getTime() + 3600000
            ).toISOString(),
            notes: "Evidence documented, sealed, and prepared for analysis.",
            verified: true,
          },
          {
            actor: "Forensic Analyst Chen",
            action: "Analysis",
            timestamp: new Date(
              new Date(found.submittedDate).getTime() + 86400000
            ).toISOString(),
            notes: "Digital forensic analysis initiated.",
            verified: true,
          },
        ];

        // Add verification event if the evidence is verified
        if (found.verified) {
          mockChain.push({
            actor: "System Verification",
            action: "Digital Verification",
            timestamp: new Date(
              new Date(found.submittedDate).getTime() + 90000000
            ).toISOString(),
            notes: "Blockchain verification completed successfully.",
            verified: true,
          });
        }

        setCustodyChain(mockChain);
      } else {
        setSelectedEvidence(null);
        setCustodyChain([]);
      }
    }
  }, [evidenceId, evidence]);

  const handleSearch = () => {
    if (!evidenceId.trim()) {
      toast({
        title: "Evidence ID Required",
        description: "Please enter an evidence ID to begin your search.",
        variant: "destructive",
      });
      return;
    }

    const found = evidence.find((item) => item.id === evidenceId);
    if (!found) {
      toast({
        title: "Evidence Not Found",
        description: `No evidence could be found with the ID: ${evidenceId}`,
        variant: "destructive",
      });
      setSelectedEvidence(null);
      setCustodyChain([]);
    }
    // The useEffect will handle setting the evidence and chain
  };

  const handleVerifyEvidence = async () => {
    if (!selectedEvidence) return;

    setIsVerifying(true);
    setVerificationProgress(0);

    // Simulate verification progress
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeVerification();
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    const completeVerification = async () => {
      try {
        // Perform actual verification
        await verifyEvidence(selectedEvidence.id);

        toast({
          title: "Verification Successful",
          description: "Evidence integrity has been confirmed on the blockchain.",
          variant: "success",
        });

        // Update the custody chain with a new verification event
        setCustodyChain((prev) => [
          ...prev,
          {
            actor: "Lawyer Verification",
            action: "Legal Review & Verification",
            timestamp: new Date().toISOString(),
            notes: "Evidence integrity verified by legal counsel.",
            verified: true,
          },
        ]);

        // Update selected evidence to show verified status
        const updatedEvidence = evidence.find(
          (item) => item.id === selectedEvidence.id
        );
        if (updatedEvidence) {
          setSelectedEvidence(updatedEvidence);
        }
      } catch {
        toast({
          title: "Verification Failed",
          description: "An error occurred while verifying the evidence.",
          variant: "destructive",
        });
      }

      setIsVerifying(false);
    };
  };

  const handlePrint = () => {
    toast({
      title: "Printing Report",
      description: "Your chain of custody report is being prepared for printing.",
    });
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: "Generating PDF of the chain of custody report.",
    });

    // In a real implementation, this would generate a PDF
    setTimeout(() => {
      const filename = `CoC-Report-${selectedEvidence?.id}-${new Date().toISOString().split("T")[0]}.pdf`;
      toast({
        title: "Download Ready",
        description: `Report saved as ${filename}`,
        variant: "success",
      });
    }, 1500);
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Preparing chain of custody data for export (JSON format).",
    });

    // In a real implementation, this would export the data
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Chain of custody data has been successfully exported.",
        variant: "success",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Chain of Custody Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Verify the integrity and timeline of evidence handling.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/evidence")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Evidence List
        </Button>
      </div>

      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="mr-3 h-6 w-6 text-primary" />
            Evidence Search
          </CardTitle>
          <CardDescription>
            Enter a unique Evidence ID to retrieve its full chain of custody record from the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:flex-grow">
              <label htmlFor="evidenceId" className="text-sm font-medium">
                Evidence ID
              </label>
              <Input
                id="evidenceId"
                value={evidenceId}
                onChange={(e) => setEvidenceId(e.target.value)}
                placeholder="e.g., EV-104-002"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto"
              disabled={isVerifying}
            >
              <Search className="mr-2 h-4 w-4" />
              Search Evidence
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="flex items-center flex-wrap">
              <History className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium mr-1">Recently Searched:</span>
              {evidence.slice(0, 3).map((item, index) => (
                <span
                  key={item.id}
                  className="mx-1 cursor-pointer hover:text-primary hover:underline"
                  onClick={() => setEvidenceId(item.id)}
                >
                  {item.id}
                  {index < 2 ? "," : ""}
                </span>
              ))}
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedEvidence && (
        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <FileDigit className="mr-3 h-6 w-6 text-primary" />
                  Evidence Details
                </CardTitle>
                <CardDescription>Core information for {selectedEvidence.id}</CardDescription>
              </div>
              {selectedEvidence.verified ? (
                  <Badge variant="success" className="text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="warning" className="text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Unverified
                  </Badge>
                )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold text-base">{selectedEvidence.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Case ID</p>
                  <p
                    className="font-semibold text-base text-primary hover:underline cursor-pointer"
                    onClick={() => navigate(`/cases/${selectedEvidence.caseId}`)}
                  >
                    {selectedEvidence.caseId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <p className="font-semibold text-base">{selectedEvidence.submittedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Date</p>
                  <p className="font-semibold text-base">
                    {new Date(selectedEvidence.submittedDate).toLocaleString()}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-sm text-muted-foreground">File Hash (SHA-256)</p>
                  <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">
                    {selectedEvidence.hash || "Hash not available"}
                  </p>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileLock2 className="mr-3 h-6 w-6 text-primary" />
                Chain of Custody Timeline
              </CardTitle>
              <CardDescription>
                Complete chronological record of evidence handling, secured by the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isVerifying ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <p className="text-lg font-semibold text-primary">Verification in Progress</p>
                  <Progress value={verificationProgress} className="w-full max-w-md" />
                  <p className="text-muted-foreground">
                    Verifying evidence integrity on the blockchain... {verificationProgress}%
                  </p>
                </div>
              ) : (
                <ChainOfCustody
                  evidenceId={selectedEvidence.id}
                  caseId={selectedEvidence.caseId}
                  events={custodyChain.map((event, index) => ({
                    id: `${index + 1}`,
                    type:
                      event.action.toLowerCase().includes("collection") ? "upload"
                      : event.action.toLowerCase().includes("processing") ? "modify"
                      : event.action.toLowerCase().includes("analysis") ? "access"
                      : "verify",
                    timestamp: event.timestamp,
                    user: {
                      name: event.actor,
                      role: event.actor.includes("Officer") ? "Officer"
                        : event.actor.includes("Technician") ? "Forensic"
                        : event.actor.includes("System") ? "Court" // Map System to Court
                        : "Lawyer",
                      avatarUrl: `https://i.pravatar.cc/150?u=${event.actor.replace(/\s/g, '')}`,
                      initials: event.actor.split(" ").map((n) => n[0]).join(""),
                    },
                    details: event.notes || `${event.action} of evidence`,
                    transactionHash: `0x${Array.from({ length: 64 }, () =>
                      Math.floor(Math.random() * 16).toString(16)
                    ).join("")}`,
                  }))}
                />
              )}
            </CardContent>
            <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50">
              <div className="flex items-center gap-4">
                {!selectedEvidence.verified && !isVerifying && (
                  <Button onClick={handleVerifyEvidence} variant="success">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify Evidence Integrity
                  </Button>
                )}
                {selectedEvidence.verified && (
                  <p className="text-sm font-medium text-success flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2"/>
                    Evidence Verified & Secured
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrint} disabled={isVerifying}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleDownload} disabled={isVerifying}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleExport} disabled={isVerifying}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <FileCheck2 className="mr-3 h-6 w-6 text-primary" />
                Blockchain Verification Status
              </CardTitle>
              <CardDescription>
                Cryptographic proof of evidence integrity and chain of custody.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvidence.verified ? (
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Verification Successful</AlertTitle>
                  <AlertDescription>
                    This evidence has been cryptographically verified on the blockchain. The chain of custody is complete and its integrity is intact.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Pending</AlertTitle>
                  <AlertDescription>
                    This evidence has not yet been fully verified by your office on the blockchain. Complete the verification process to ensure chain of custody integrity.
                    <Button
                      className="mt-4 w-full sm:w-auto"
                      onClick={handleVerifyEvidence}
                      disabled={isVerifying}
                      variant="warning"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Verify Evidence Now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChainOfCustodyVerification;

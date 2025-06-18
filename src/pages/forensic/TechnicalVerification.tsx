import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileDigit,
  UploadCloud,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Database,
  History,
  Clock,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const TechnicalVerification = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hash");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [hashValue, setHashValue] = useState("");
  const [caseId, setCaseId] = useState("");
  const [evidenceId, setEvidenceId] = useState("");

  const handleFileUpload = () => {
    // Simulating verification process
    setVerificationStatus("loading");

    toast({
      title: "File Received",
      description:
        activeTab === "hash"
          ? "Calculating file hash for verification..."
          : "Analyzing file for chain of custody verification...",
    });

    setTimeout(() => {
      if (activeTab === "hash") {
        setVerificationStatus("success");
        setVerificationMessage(
          "Evidence hash has been verified successfully. The hash matches the blockchain record."
        );
        toast({
          title: "Hash Verified",
          description: "The evidence hash has been successfully verified.",
        });
      } else {
        setVerificationStatus("success");
        setVerificationMessage(
          "Chain of custody verified. This evidence has a complete and unbroken chain of custody with 6 recorded transfers."
        );
        toast({
          title: "Chain of Custody Verified",
          description: "Complete and unbroken chain of custody confirmed.",
        });
      }
    }, 2000);
  };

  const handleManualVerify = () => {
    // Input validation
    if (!hashValue && activeTab === "hash") {
      toast({
        title: "Missing Hash Value",
        description: "Please enter a hash value for verification.",
        variant: "destructive",
      });
      return;
    }

    if (!caseId) {
      toast({
        title: "Missing Case ID",
        description: "Please enter a Case ID for verification.",
        variant: "destructive",
      });
      return;
    }

    // Simulating verification process
    setVerificationStatus("loading");

    toast({
      title: "Verification In Progress",
      description: "Checking blockchain records...",
    });

    setTimeout(() => {
      const randomSuccess = Math.random() > 0.3;
      if (randomSuccess) {
        setVerificationStatus("success");
        setVerificationMessage(
          "Evidence hash has been verified successfully. The hash matches the blockchain record."
        );
        toast({
          title: "Verification Successful",
          description: "The provided hash matches the blockchain record.",
        });
      } else {
        setVerificationStatus("error");
        setVerificationMessage(
          "Hash verification failed. The provided hash does not match the blockchain record."
        );
        toast({
          title: "Verification Failed",
          description:
            "The provided hash does not match the blockchain record.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleLookupCustody = () => {
    if (!evidenceId || !caseId) {
      toast({
        title: "Missing Information",
        description: "Please provide both Evidence ID and Case ID.",
        variant: "destructive",
      });
      return;
    }

    setVerificationStatus("loading");

    toast({
      title: "Looking Up Chain of Custody",
      description: `Retrieving custody records for ${evidenceId}`,
    });

    setTimeout(() => {
      setVerificationStatus("success");
      setVerificationMessage(
        "Chain of custody verified. This evidence has a complete and unbroken chain of custody with 6 recorded transfers."
      );
      toast({
        title: "Chain of Custody Retrieved",
        description: "Full custody history retrieved from blockchain.",
      });
    }, 2000);
  };

  const handleCloseVerification = () => {
    setVerificationStatus("idle");
    setVerificationMessage("");
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Chain of custody report has been exported to PDF.",
    });
  };

  const handleViewFullHistory = () => {
    toast({
      title: "Full History",
      description: "Showing complete history of all custody transfers.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-forensic-800">
        Technical Verification
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="hash" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Hash Verification</span>
          </TabsTrigger>
          <TabsTrigger value="custody" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>Chain of Custody</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hash" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UploadCloud className="h-5 w-5 text-forensic-accent" />
                  File-Based Verification
                </CardTitle>
                <CardDescription>
                  Upload evidence file to verify its cryptographic hash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-forensic-200 rounded-lg p-6 text-center cursor-pointer hover:border-forensic-accent/40 transition-colors"
                  onClick={handleFileUpload}
                >
                  <FileDigit className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1">
                    Drop evidence file here or click to browse
                  </h4>
                  <p className="text-xs text-forensic-500 mb-2">
                    Supports all file types up to 2GB
                  </p>
                  <Button variant="outline" onClick={handleFileUpload}>
                    Select File
                  </Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>File Handling Notice</AlertTitle>
                  <AlertDescription className="text-sm">
                    Files are processed locally and hashed for verification. No
                    content is uploaded to our servers.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-forensic-accent" />
                  Manual Hash Verification
                </CardTitle>
                <CardDescription>
                  Enter hash value and case ID manually to verify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Evidence Hash</label>
                  <Input
                    placeholder="Enter SHA-256 hash value"
                    className="font-mono text-sm"
                    value={hashValue}
                    onChange={(e) => setHashValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case ID</label>
                  <Input
                    placeholder="e.g., FF-2023-089"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Evidence ID (Optional)
                  </label>
                  <Input
                    placeholder="e.g., EV-2023-421"
                    value={evidenceId}
                    onChange={(e) => setEvidenceId(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-forensic-accent hover:bg-forensic-accent/90"
                  onClick={handleManualVerify}
                >
                  Verify Hash
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-forensic-accent" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-forensic-success text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    <span className="font-mono text-sm">
                      0x9c3fed4...cb31a2
                    </span>
                  </div>
                  <div className="text-sm text-forensic-500">
                    <span className="mr-4">Case: FF-2023-092</span>
                    <span>10 minutes ago</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-forensic-success text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    <span className="font-mono text-sm">0x8a7b561c...73c7</span>
                  </div>
                  <div className="text-sm text-forensic-500">
                    <span className="mr-4">Case: FF-2023-089</span>
                    <span>2 hours ago</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-forensic-danger text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                    <span className="font-mono text-sm">0xd51e92...f49a2</span>
                  </div>
                  <div className="text-sm text-forensic-500">
                    <span className="mr-4">Case: FF-2023-104</span>
                    <span>Yesterday</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {verificationStatus !== "idle" && (
            <Card
              className={
                verificationStatus === "loading"
                  ? "border-forensic-accent"
                  : verificationStatus === "success"
                  ? "border-forensic-success"
                  : "border-forensic-danger"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {verificationStatus === "loading" && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forensic-accent" />
                  )}
                  {verificationStatus === "success" && (
                    <CheckCircle2 className="h-6 w-6 text-forensic-success" />
                  )}
                  {verificationStatus === "error" && (
                    <AlertTriangle className="h-6 w-6 text-forensic-danger" />
                  )}
                  <div>
                    <h4 className="font-medium mb-1">
                      {verificationStatus === "loading"
                        ? "Verifying..."
                        : verificationStatus === "success"
                        ? "Verification Successful"
                        : "Verification Failed"}
                    </h4>
                    <p className="text-sm text-forensic-600">
                      {verificationMessage}
                    </p>

                    {verificationStatus === "success" && (
                      <div className="mt-4 pt-4 border-t border-forensic-100">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-forensic-500">
                            Transaction ID:
                          </span>
                          <span className="font-mono">0x1f95d39680c2e7ac1</span>

                          <span className="text-forensic-500">
                            Block Number:
                          </span>
                          <span>14,563,921</span>

                          <span className="text-forensic-500">
                            Verification Date:
                          </span>
                          <span>April 9, 2025 15:32 UTC</span>
                        </div>
                      </div>
                    )}

                    {verificationStatus !== "loading" && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleCloseVerification}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custody" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-forensic-accent" />
                  Lookup Chain of Custody
                </CardTitle>
                <CardDescription>
                  Enter evidence ID to view full chain of custody
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Evidence ID</label>
                  <Input
                    placeholder="e.g., EV-2023-421"
                    value={evidenceId}
                    onChange={(e) => setEvidenceId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case ID</label>
                  <Input
                    placeholder="e.g., FF-2023-089"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-forensic-accent hover:bg-forensic-accent/90"
                  onClick={handleLookupCustody}
                >
                  Lookup Custody Chain
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UploadCloud className="h-5 w-5 text-forensic-accent" />
                  Upload Evidence for Verification
                </CardTitle>
                <CardDescription>
                  Upload evidence file to verify its chain of custody
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-forensic-200 rounded-lg p-6 text-center cursor-pointer hover:border-forensic-accent/40 transition-colors"
                  onClick={handleFileUpload}
                >
                  <FileDigit className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                  <h4 className="text-sm font-medium mb-1">
                    Drop evidence file here or click to browse
                  </h4>
                  <p className="text-xs text-forensic-500 mb-2">
                    File will be hashed locally to verify chain of custody
                  </p>
                  <Button variant="outline" onClick={handleFileUpload}>
                    Select File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-forensic-accent" />
                Chain of Custody Verification
              </CardTitle>
              <CardDescription>
                Evidence custody trail recorded on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              {verificationStatus === "success" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Evidence ID: EV-2023-421</h4>
                      <p className="text-sm text-forensic-600">
                        Case ID: FF-2023-089
                      </p>
                    </div>
                    <Badge className="bg-forensic-success text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  {/* Timeline of custody */}
                  <div className="relative border-l-2 border-forensic-200 pl-6 py-2">
                    {/* Chain of custody items */}
                    <div className="mb-6 relative">
                      <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-accent"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Evidence Collection</h4>
                          <Badge className="bg-forensic-800 text-white">
                            Initial
                          </Badge>
                        </div>
                        <p className="text-sm text-forensic-600 mb-1">
                          April 9, 2025 at 09:30 AM
                        </p>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Officer:</span>{" "}
                          Officer Johnson
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Location:</span>{" "}
                          Tech Corp HQ, Server Room
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">
                            Transaction:
                          </span>
                          <span className="font-mono text-xs">
                            0x5483d2f1a00bc14e...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 relative">
                      <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-accent"></div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Evidence Transfer</h4>
                        </div>
                        <p className="text-sm text-forensic-600 mb-1">
                          April 9, 2025 at 11:45 AM
                        </p>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">From:</span>{" "}
                          Officer Johnson
                          <span className="mx-2">→</span>
                          <span className="text-forensic-500">To:</span> Dr.
                          Anderson
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Purpose:</span>{" "}
                          Forensic Analysis
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">
                            Transaction:
                          </span>
                          <span className="font-mono text-xs">
                            0x3ba196e58d05fcd7...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 relative">
                      <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-accent"></div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">Evidence Analysis</h4>
                        </div>
                        <p className="text-sm text-forensic-600 mb-1">
                          April 9, 2025 at 14:32 PM
                        </p>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Analyst:</span>{" "}
                          Dr. Anderson
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Action:</span>{" "}
                          Technical metadata extraction and verification
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">
                            Transaction:
                          </span>
                          <span className="font-mono text-xs">
                            0x7c1a0f9b42e6dd3a...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-accent"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">Current Possession</h4>
                          <Badge className="bg-forensic-court text-white">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-forensic-600 mb-1">
                          Currently with: Dr. Anderson
                        </p>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Status:</span>{" "}
                          Under technical analysis
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-forensic-500">Storage:</span>{" "}
                          Forensic Lab, Secure Server
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                  <h3 className="font-medium text-lg mb-1">
                    No Chain of Custody Selected
                  </h3>
                  <p className="text-forensic-500 mb-4">
                    Enter an evidence ID or upload a file to view its chain of
                    custody
                  </p>
                </div>
              )}
            </CardContent>
            {verificationStatus === "success" && (
              <CardFooter className="bg-forensic-50 border-t border-forensic-100">
                <div className="w-full flex items-center justify-between">
                  <Badge className="bg-forensic-success">Chain Verified</Badge>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleViewFullHistory}
                    >
                      <Clock className="h-4 w-4" />
                      <span>Full History</span>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-forensic-accent hover:bg-forensic-accent/90"
                      onClick={handleExportReport}
                    >
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalVerification;

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Shield,
  FileCheck,
  FileX,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import web3Service from "@/services/web3Service";

interface VerificationResult {
  success: boolean;
  message: string;
  evidenceDetails?: {
    id: string;
    caseId: string;
    submittedBy: string;
    submittedAt: string;
    confirmedBy?: string;
    confirmedAt?: string;
    hash: string;
  };
}

const EvidenceVerifier = () => {
  const [fileToVerify, setFileToVerify] = useState<File | null>(null);
  const [evidenceId, setEvidenceId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileToVerify(files[0]);
    }
  };

  const computeFileHash = async (file: File): Promise<string> => {
    // Mock function - in a real app, this would compute the actual hash
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock hash based on filename and size
        const mockHash = `0x${Array.from(file.name + file.size.toString())
          .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
          .toString(16)
          .padStart(64, "0")}`;
        resolve(mockHash);
      }, 500);
    });
  };

  const verifyByFile = async () => {
    if (!fileToVerify) {
      toast({
        title: "No File Selected",
        description: "Please select a file to verify.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would:
      // 1. Generate the hash from the file
      // 2. Call the blockchain to verify the hash
      const fileHash = await computeFileHash(fileToVerify);

      // Mock successful verification
      setTimeout(() => {
        setResult({
          success: true,
          message:
            "Evidence verified successfully. The file hash matches the blockchain record.",
          evidenceDetails: {
            id: "EV-2023-085",
            caseId: "FF-2023-092",
            submittedBy: "Officer Michael Chen",
            submittedAt: "Apr 08, 2025 16:12:05",
            confirmedBy: "Forensic Sarah Lee",
            confirmedAt: "Apr 09, 2025 09:45:21",
            hash: fileHash,
          },
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        success: false,
        message:
          "Failed to verify evidence. The file hash does not match any blockchain record.",
      });
      setLoading(false);
    }
  };

  const verifyById = async () => {
    if (!evidenceId || !caseId) {
      toast({
        title: "Missing Information",
        description: "Please enter both Evidence ID and Case ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock verification by ID
      setTimeout(() => {
        // Random success/failure for demo purposes
        const isSuccess = Math.random() > 0.3;

        if (isSuccess) {
          setResult({
            success: true,
            message:
              "Evidence verified successfully. The evidence exists and is valid.",
            evidenceDetails: {
              id: evidenceId,
              caseId: caseId,
              submittedBy: "Officer John Doe",
              submittedAt: "Apr 05, 2025 14:30:15",
              confirmedBy: "Forensic Jane Smith",
              confirmedAt: "Apr 06, 2025 09:15:33",
              hash: "0x7c3e2fb9a91f9dc3bc3176651f3db4597e2b9c597d63aa86c0d16e198774358b",
            },
          });
        } else {
          setResult({
            success: false,
            message:
              "Evidence verification failed. The provided IDs do not match or the evidence is not valid.",
          });
        }
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        success: false,
        message: "An error occurred during verification.",
      });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFileToVerify(null);
    setEvidenceId("");
    setCaseId("");
    setResult(null);

    // Reset file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card className="border border-forensic-200 hover:border-forensic-300 transition-colors">
      <CardHeader className="bg-gradient-to-r from-forensic-50 to-transparent">
        <CardTitle className="text-lg flex items-center">
          <Shield className="h-5 w-5 mr-2 text-forensic-accent" />
          Evidence Verification
        </CardTitle>
        <CardDescription>
          Verify evidence integrity using blockchain records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!result ? (
          <Tabs defaultValue="file" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Verify by File</TabsTrigger>
              <TabsTrigger value="id">Verify by ID</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-forensic-200 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 text-forensic-300 mx-auto mb-2" />
                <p className="text-sm text-forensic-600 mb-4">
                  Upload a file to verify against blockchain records
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Select File
                  </Button>
                  {fileToVerify && (
                    <div className="bg-forensic-50 rounded p-2 text-sm text-forensic-800">
                      {fileToVerify.name} (
                      {(fileToVerify.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={verifyByFile}
                disabled={!fileToVerify || loading}
              >
                {loading ? "Verifying..." : "Verify Evidence"}
              </Button>
            </TabsContent>

            <TabsContent value="id" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Evidence ID</label>
                  <Input
                    placeholder="e.g. EV-2023-085"
                    value={evidenceId}
                    onChange={(e) => setEvidenceId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Case ID</label>
                  <Input
                    placeholder="e.g. FF-2023-092"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={verifyById}
                disabled={!evidenceId || !caseId || loading}
              >
                {loading ? "Verifying..." : "Verify Evidence"}
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div
              className={`p-4 rounded-lg flex items-start gap-3 
              ${
                result.success
                  ? "bg-forensic-success/10 border border-forensic-success/30"
                  : "bg-forensic-destructive/10 border border-forensic-destructive/30"
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-forensic-success mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-forensic-destructive mt-0.5" />
              )}
              <div>
                <h4
                  className={`font-medium ${
                    result.success
                      ? "text-forensic-success"
                      : "text-forensic-destructive"
                  }`}
                >
                  {result.success
                    ? "Verification Successful"
                    : "Verification Failed"}
                </h4>
                <p className="text-sm text-forensic-600 mt-1">
                  {result.message}
                </p>
              </div>
            </div>

            {result.success && result.evidenceDetails && (
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-forensic-800">
                  Evidence Details
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-forensic-600">Evidence ID:</span>
                    <span className="font-medium">
                      {result.evidenceDetails.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-forensic-600">Case ID:</span>
                    <span className="font-medium">
                      {result.evidenceDetails.caseId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-forensic-600">Submitted By:</span>
                    <span className="font-medium">
                      {result.evidenceDetails.submittedBy}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-forensic-600">Submitted At:</span>
                    <span className="font-medium">
                      {result.evidenceDetails.submittedAt}
                    </span>
                  </div>
                  {result.evidenceDetails.confirmedBy && (
                    <div className="flex justify-between text-sm">
                      <span className="text-forensic-600">Confirmed By:</span>
                      <span className="font-medium">
                        {result.evidenceDetails.confirmedBy}
                      </span>
                    </div>
                  )}
                  {result.evidenceDetails.confirmedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-forensic-600">Confirmed At:</span>
                      <span className="font-medium">
                        {result.evidenceDetails.confirmedAt}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <h5 className="text-sm font-medium text-forensic-800 mb-1">
                    Hash
                  </h5>
                  <div className="bg-forensic-50 p-2 rounded text-xs font-mono break-all">
                    {result.evidenceDetails.hash}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  asChild
                >
                  <a href="#">
                    <Shield className="h-4 w-4" />
                    <span>View Blockchain Transaction</span>
                  </a>
                </Button>
              </div>
            )}

            <Button onClick={resetForm} className="w-full">
              Verify Another
            </Button>
          </div>
        )}
      </CardContent>
      {!result && (
        <CardFooter className="text-xs text-forensic-500 text-center">
          Evidence verification uses blockchain technology to ensure file
          integrity and authenticity
        </CardFooter>
      )}
    </Card>
  );
};

export default EvidenceVerifier;

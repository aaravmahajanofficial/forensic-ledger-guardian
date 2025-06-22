import React, { useState, useCallback } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  UploadCloud,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  X,
  Loader2,
  FileSearch,
  Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

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
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileToVerify(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "*/*": [] },
  });

  const computeFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockHash = `0x${
          Array.from(file.name + file.size.toString())
            .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
            .toString(16)
            .padStart(64, "0")
        }`;
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
    setResult(null);
    try {
      const fileHash = await computeFileHash(fileToVerify);

      setTimeout(() => {
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
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
        } else {
          setResult({
            success: false,
            message:
              "Verification Failed. The file's hash does not match any record on the blockchain.",
          });
        }
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        success: false,
        message:
          "An unexpected error occurred during file verification.",
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
    setResult(null);
    try {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3;

        if (isSuccess) {
          setResult({
            success: true,
            message:
              "Evidence record found and is valid on the blockchain.",
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
              "Evidence verification failed. The provided IDs do not match any valid record.",
          });
        }
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        success: false,
        message: "An error occurred during verification by ID.",
      });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFileToVerify(null);
    setEvidenceId("");
    setCaseId("");
    setResult(null);
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Alert variant={result.success ? "success" : "destructive"} className="mt-6">
        {result.success ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertTitle>
          {result.success ? "Verification Successful" : "Verification Failed"}
        </AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
        {result.evidenceDetails && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50 text-sm">
            <h4 className="font-semibold mb-2">Evidence Details:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <p><strong>ID:</strong> {result.evidenceDetails.id}</p>
              <p><strong>Case ID:</strong> {result.evidenceDetails.caseId}</p>
              <p><strong>Submitted By:</strong> {result.evidenceDetails.submittedBy}</p>
              <p><strong>Submitted At:</strong> {result.evidenceDetails.submittedAt}</p>
              <p><strong>Confirmed By:</strong> {result.evidenceDetails.confirmedBy}</p>
              <p><strong>Confirmed At:</strong> {result.evidenceDetails.confirmedAt}</p>
              <p className="col-span-full"><strong>Hash:</strong> <span className="font-mono break-all">{result.evidenceDetails.hash}</span></p>
            </div>
          </div>
        )}
        <Button onClick={resetForm} variant="outline" size="sm" className="mt-4">
          Start New Verification
        </Button>
      </Alert>
    );
  };

  return (
    <Card>
      {!result ? (
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">
              <FileSearch className="mr-2 h-4 w-4" />
              Verify by File
            </TabsTrigger>
            <TabsTrigger value="id">
              <Key className="mr-2 h-4 w-4" />
              Verify by ID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <CardHeader>
              <CardTitle>Verify Evidence by File</CardTitle>
              <CardDescription>
                Upload a file to compute its hash and verify its integrity against the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-10 w-10" />
                  {isDragActive ? (
                    <p>Drop the file here ...</p>
                  ) : (
                    <p>Drag & drop a file here, or click to select a file</p>
                  )}
                </div>
              </div>
              {fileToVerify && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{fileToVerify.name}</p>
                      <p className="text-xs text-muted-foreground">{(fileToVerify.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFileToVerify(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={verifyByFile} disabled={loading || !fileToVerify} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Verify File
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="id">
            <CardHeader>
              <CardTitle>Verify Evidence by ID</CardTitle>
              <CardDescription>
                Enter the Evidence ID and Case ID to check its status on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="evidenceId">Evidence ID</label>
                <Input
                  id="evidenceId"
                  value={evidenceId}
                  onChange={(e) => setEvidenceId(e.target.value)}
                  placeholder="e.g., EV-2023-085"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="caseId">Case ID</label>
                <Input
                  id="caseId"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="e.g., FF-2023-092"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={verifyById} disabled={loading || !evidenceId || !caseId} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Verify by ID
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      ) : (
        <CardContent className="pt-6">
          {renderResult()}
        </CardContent>
      )}
    </Card>
  );
};

export default EvidenceVerifier;

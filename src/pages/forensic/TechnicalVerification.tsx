import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  FileClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const mockVerificationHistory = [
  {
    id: "VER-9876",
    evidenceId: "EV-2023-420",
    type: "Hash Match",
    status: "Success",
    timestamp: "2025-04-10T10:05:00Z",
    verifiedBy: "Dr. Evelyn Reed",
  },
  {
    id: "VER-9875",
    evidenceId: "EV-2023-418",
    type: "Chain of Custody",
    status: "Success",
    timestamp: "2025-04-09T18:20:00Z",
    verifiedBy: "Dr. Kenji Tanaka",
  },
  {
    id: "VER-9874",
    evidenceId: "EV-2023-401",
    type: "Hash Match",
    status: "Failed",
    timestamp: "2025-04-09T11:45:00Z",
    verifiedBy: "Dr. Evelyn Reed",
  },
];

type VerificationStatus = "idle" | "loading" | "success" | "error";

const TechnicalVerification = () => {
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [hashValue, setHashValue] = useState(
    "0x9c3fed4771290b8431f43c29c6c056a3b4cb31a2"
  );
  const [caseId, setCaseId] = useState("FF-2023-092");

  const handleVerify = (type: "hash" | "coc") => {
    if (type === "hash" && !hashValue) {
      toast({ title: "Error", description: "Please enter a hash value." });
      return;
    }
    if (type === "coc" && !caseId) {
      toast({ title: "Error", description: "Please enter a Case ID." });
      return;
    }

    setVerificationStatus("loading");
    setVerificationMessage("Verifying against blockchain records...");

    setTimeout(() => {
      if (Math.random() > 0.2) {
        setVerificationStatus("success");
        setVerificationMessage(
          type === "hash"
            ? "Evidence hash verified successfully. The hash matches the immutable blockchain record."
            : "Chain of custody verified. The evidence has a complete and unbroken chain of custody."
        );
      } else {
        setVerificationStatus("error");
        setVerificationMessage(
          type === "hash"
            ? "Hash mismatch. The evidence may have been tampered with."
            : "Chain of custody broken. Inconsistencies found in the transfer log."
        );
      }
    }, 1500);
  };

  const VerificationResult = () => {
    if (verificationStatus === "idle") {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Verification Status</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Results of your verification will be displayed here.
          </p>
        </div>
      );
    }

    if (verificationStatus === "loading") {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/40 p-12 text-center">
          <div className="loader h-12 w-12 rounded-full border-4 border-t-4 border-muted-foreground border-t-primary"></div>
          <h3 className="mt-4 text-lg font-medium">Verifying...</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {verificationMessage}
          </p>
        </div>
      );
    }

    const isSuccess = verificationStatus === "success";
    const alertVariant = isSuccess ? "success" : "destructive";
    const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

    return (
      <Alert variant={alertVariant} className="h-full">
        <Icon className="h-5 w-5" />
        <AlertTitle className="text-lg">
          {isSuccess ? "Verification Successful" : "Verification Failed"}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {verificationMessage}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Technical Verification
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verify the integrity and chain of custody of digital evidence using
            blockchain records.
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Console</CardTitle>
                  <CardDescription>
                    Choose a method to verify evidence integrity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="hash" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="hash">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Hash Verification
                      </TabsTrigger>
                      <TabsTrigger value="coc">
                        <FileClock className="mr-2 h-4 w-4" />
                        Chain of Custody
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="hash" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 text-center hover:border-primary">
                          <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Drag & drop a file or click to upload
                          </p>
                        </div>
                        <div className="relative flex items-center">
                          <div className="flex-grow border-t border-border"></div>
                          <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">
                            Or
                          </span>
                          <div className="flex-grow border-t border-border"></div>
                        </div>
                        <div>
                          <label htmlFor="hash-input" className="text-sm font-medium">
                            Enter SHA-256 Hash Manually
                          </label>
                          <Input
                            id="hash-input"
                            placeholder="0x..."
                            className="mt-2 font-mono"
                            value={hashValue}
                            onChange={(e) => setHashValue(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleVerify("hash")}
                          className="w-full"
                          disabled={verificationStatus === "loading"}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify Hash
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="coc" className="mt-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="case-id" className="text-sm font-medium">
                            Case ID
                          </label>
                          <Input
                            id="case-id"
                            placeholder="FF-2023-092"
                            className="mt-2"
                            value={caseId}
                            onChange={(e) => setCaseId(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => handleVerify("coc")}
                          className="w-full"
                          disabled={verificationStatus === "loading"}
                        >
                          <FileClock className="mr-2 h-4 w-4" />
                          Verify Chain of Custody
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <VerificationResult />
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evidence ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Verified By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVerificationHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.evidenceId}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "Success" ? "success" : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{item.verifiedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TechnicalVerification;

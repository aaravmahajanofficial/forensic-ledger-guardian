import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileCheck,
  FolderKanban,
  X,
  Loader2,
  FileDigit,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock case data - would be fetched from API
const cases = [
  { id: "FF-2023-104", title: "Network Intrusion at TechCorp" },
  { id: "FF-2023-092", title: "Mobile Device Analysis - Rodriguez Case" },
  { id: "FF-2023-089", title: "Email Fraud Investigation - Acme Corp" },
];

// Constants for upload simulation
const BLOCKCHAIN_TRANSACTION_DELAY = 1000; // 1 second
const HASH_CALCULATION_DELAY = 500; // 0.5 seconds

const EvidenceUpload = () => {
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [evidenceType, setEvidenceType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deviceSource, setDeviceSource] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateForm = () => {
    if (!selectedCase) {
      toast({
        title: "Case required",
        description: "Please select a case for this evidence",
        variant: "destructive",
      });
      return false;
    }

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one evidence file to upload",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFiles([]);
    setDescription("");
    setUploadProgress(0);
  };

  const showSuccessToast = (fileCount: number) => {
    toast({
      title: "Evidence submitted successfully",
      description: `${fileCount} file(s) uploaded and registered on the blockchain`,
      variant: "default",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Upload failed",
      description: "There was a problem uploading your evidence",
      variant: "destructive",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const browseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateHash = (file: File): Promise<string> => {
    // In a real app, this would calculate a SHA-256 hash of the file
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock hash calculation - this would be done with WebCrypto API
        const mockHash = Array.from(
          { length: 64 },
          () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join("");
        resolve(mockHash);
      }, HASH_CALCULATION_DELAY);
    });
  };

  const processFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = Math.round(((i + 1) / files.length) * 100);
      setUploadProgress(progress);

      // Simulate file hash calculation
      const hash = await simulateHash(file);

      // Simulate blockchain transaction delay
      await new Promise((resolve) =>
        setTimeout(resolve, BLOCKCHAIN_TRANSACTION_DELAY)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      await processFiles();
      showSuccessToast(files.length);
      resetForm();
    } catch (error) {
      showErrorToast();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forensic-800">
          Evidence Upload
        </h1>
      </div>

      <Card className="border-forensic-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Upload className="mr-2 h-5 w-5 text-forensic-accent" />
            Submit Digital Evidence
          </CardTitle>
          <CardDescription>
            Upload evidence files securely to the forensic blockchain ledger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Selection */}
            <div className="space-y-2">
              <Label htmlFor="caseId">Select Case</Label>
              <Select value={selectedCase} onValueChange={setSelectedCase}>
                <SelectTrigger id="caseId" className="border-forensic-200">
                  <SelectValue placeholder="Select a case" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((caseItem) => (
                    <SelectItem key={caseItem.id} value={caseItem.id}>
                      <div className="flex items-center">
                        <FolderKanban className="mr-2 h-4 w-4 text-forensic-accent" />
                        <span>
                          {caseItem.id}: {caseItem.title}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evidence Type */}
            <div className="space-y-2">
              <Label htmlFor="evidenceType">Evidence Type</Label>
              <Select value={evidenceType} onValueChange={setEvidenceType}>
                <SelectTrigger
                  id="evidenceType"
                  className="border-forensic-200"
                >
                  <SelectValue placeholder="Select evidence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disk_image">Disk Image</SelectItem>
                  <SelectItem value="memory_dump">Memory Dump</SelectItem>
                  <SelectItem value="log_files">Log Files</SelectItem>
                  <SelectItem value="emails">Email Archives</SelectItem>
                  <SelectItem value="photos">Photographs</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="mobile_data">
                    Mobile Device Data
                  </SelectItem>
                  <SelectItem value="network_captures">
                    Network Captures
                  </SelectItem>
                  <SelectItem value="other">Other Digital Evidence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Evidence Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the evidence and its relevance to the case"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] border-forensic-200"
              />
            </div>

            {/* Source and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceSource">Source Device/System</Label>
                <Input
                  id="deviceSource"
                  placeholder="E.g., Suspect's laptop, Server ID: SRV-001"
                  value={deviceSource}
                  onChange={(e) => setDeviceSource(e.target.value)}
                  className="border-forensic-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Collection Location</Label>
                <Input
                  id="location"
                  placeholder="E.g., Suspect's home office, 123 Main St."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-forensic-200"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="fileUpload">Evidence Files</Label>

              {/* Hidden file input */}
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />

              {/* Drop zone */}
              <div
                onClick={browseFiles}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  "border-forensic-300 hover:border-forensic-accent",
                  files.length > 0 ? "bg-forensic-50" : "bg-white"
                )}
              >
                <div className="flex flex-col items-center space-y-2">
                  <FileDigit className="h-10 w-10 text-forensic-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-forensic-800">
                      Drag & drop files or click to browse
                    </p>
                    <p className="text-xs text-forensic-500">
                      Supports any file type. Maximum 1GB per file.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      browseFiles();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="font-medium text-sm text-forensic-700">
                    {files.length} file(s) selected
                  </div>
                  <div className="max-h-40 overflow-y-auto border rounded-md bg-forensic-50">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b border-forensic-200 last:border-b-0"
                      >
                        <div className="flex items-center space-x-2">
                          <FileCheck className="h-4 w-4 text-forensic-accent" />
                          <div className="text-sm">
                            <div className="font-medium text-forensic-800">
                              {file.name}
                            </div>
                            <div className="text-xs text-forensic-500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 text-forensic-500 hover:text-forensic-danger"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" disabled={isUploading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isUploading || files.length === 0}
            className={cn(
              "bg-forensic-accent hover:bg-forensic-accent/90",
              isUploading && "opacity-80"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span>Submit Evidence</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EvidenceUpload;

import React, { useState, useRef } from "react";
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
import { useEvidenceManager } from "@/hooks/useEvidenceManager";
import {
  UploadCloud,
  FolderKanban,
  Loader2,
  FileDigit,
  Save,
  Paperclip,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Mock case data - would be fetched from API
const cases = [
  { id: "FF-2023-104", title: "Network Intrusion at TechCorp" },
  { id: "FF-2023-092", title: "Mobile Device Analysis - Rodriguez Case" },
  { id: "FF-2023-089", title: "Email Fraud Investigation - Acme Corp" },
];

interface FileWithProgress extends File {
  progress?: number;
}

const EvidenceUpload = () => {
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [evidenceType, setEvidenceType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deviceSource, setDeviceSource] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { uploadFiles, isUploading, validateFiles, clearUploadProgress } =
    useEvidenceManager();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((f) =>
        Object.assign(f, { progress: 0 })
      );
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files).map((f) =>
        Object.assign(f, { progress: 0 })
      );
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCase) {
      toast({
        title: "Case Not Selected",
        description: "Please associate this evidence with a case.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files to Upload",
        description: "Please select at least one evidence file.",
        variant: "destructive",
      });
      return;
    }

    const { valid, invalid } = validateFiles(files);

    if (invalid.length > 0) {
      toast({
        title: "Invalid Files Detected",
        description: `${invalid.length} file(s) failed validation. Please check file types and sizes.`,
        variant: "destructive",
      });
      setFiles(valid); // Keep only valid files
      return;
    }

    // Simulate upload progress for UI demonstration
    const uploadWithProgress = async () => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, progress: 0 } : f))
        );
        await new Promise((resolve) => setTimeout(resolve, 100)); // short delay

        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.name === file.name) {
                const newProgress = (f.progress || 0) + 10;
                if (newProgress >= 100) {
                  clearInterval(progressInterval);
                  return { ...f, progress: 100 };
                }
                return { ...f, progress: newProgress };
              }
              return f;
            })
          );
        }, 100);
      }
      await uploadFiles(valid, selectedCase);
    };

    try {
      await uploadWithProgress();

      toast({
        title: "Upload Successful",
        description: `${files.length} evidence file(s) have been securely submitted.`,
        variant: "success",
      });

      // Reset form
      setFiles([]);
      setDescription("");
      setEvidenceType("");
      setDeviceSource("");
      setLocation("");
      setSelectedCase("");
      clearUploadProgress();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Secure Evidence Upload
        </h1>
        <p className="text-muted-foreground">
          Submit digital evidence files to the immutable blockchain ledger.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-primary" />
              Case & Evidence Details
            </CardTitle>
            <CardDescription>
              Provide all necessary metadata for the evidence being submitted. This
              information is critical for the chain of custody.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case Selection */}
              <div className="space-y-2">
                <Label htmlFor="caseId">Associate with Case</Label>
                <Select value={selectedCase} onValueChange={setSelectedCase}>
                  <SelectTrigger id="caseId">
                    <SelectValue placeholder="Select a case file..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((caseItem) => (
                      <SelectItem key={caseItem.id} value={caseItem.id}>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
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
                <Label htmlFor="evidenceType">Type of Evidence</Label>
                <Select value={evidenceType} onValueChange={setEvidenceType}>
                  <SelectTrigger id="evidenceType">
                    <SelectValue placeholder="Select evidence category..." />
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
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Evidence Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the evidence, its condition, and its relevance to the case. Be as detailed as possible."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Device/System */}
              <div className="space-y-2">
                <Label htmlFor="deviceSource">Source Device/System</Label>
                <Input
                  id="deviceSource"
                  placeholder="e.g., Suspect's laptop (MacBook Pro 16-inch)"
                  value={deviceSource}
                  onChange={(e) => setDeviceSource(e.target.value)}
                />
              </div>
              {/* Collection Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Collection Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, Anytown, USA, Home Office"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label htmlFor="fileUpload">Evidence Files</Label>
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragEnter} // Reuse onDragEnter logic
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300",
                  isDragOver
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                )}
              >
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground">
                  Drag & drop files here
                </p>
                <p className="text-muted-foreground">or</p>
                <Button type="button" variant="outline" className="mt-2">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Max file size: 1GB. All uploads are hashed and recorded.
                </p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-medium text-foreground">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative bg-muted/50 p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <FileDigit className="h-6 w-6 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {isUploading && file.progress !== undefined && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-right text-muted-foreground mt-1">
                            {file.progress === 100
                              ? "Processing..."
                              : `${file.progress}%`}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => setFiles([])}
            >
              Clear Selection
            </Button>
            <Button
              type="submit"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit {files.length}{" "}
                  {files.length === 1 ? "File" : "Files"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EvidenceUpload;

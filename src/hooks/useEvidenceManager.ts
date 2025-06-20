/**
 * Evidence Manager Hook
 * Handles evidence upload, verification, and blockchain interaction
 */

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { config } from "@/config";
import { logError, logAudit, logPerformance } from "@/utils/logger";
import { useAuth } from "@/contexts/AuthContext";
import { mockDataService } from "@/services/mockDataService";

// Type definitions
export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  caseId: string;
  submittedBy: string;
  submittedDate: string;
  size: number;
  verified: boolean;
  hash?: string;
  ipfsHash?: string;
  blockchainTxHash?: string;
  chainOfCustody: ChainOfCustodyEntry[];
  metadata?: EvidenceMetadata;
  status: "pending" | "processing" | "verified" | "rejected";
}

export interface ChainOfCustodyEntry {
  id: string;
  action: "created" | "accessed" | "modified" | "transferred" | "verified";
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  details: string;
  transactionHash?: string;
}

export interface EvidenceMetadata {
  originalHash: string;
  fileType: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  location?: { latitude: number; longitude: number };
  deviceInfo?: string;
  checksums: {
    md5: string;
    sha256: string;
    sha512: string;
  };
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status:
    | "preparing"
    | "uploading"
    | "processing"
    | "completing"
    | "completed"
    | "error";
  error?: string;
}

interface UseEvidenceManagerOptions {
  caseId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useEvidenceManager = (options: UseEvidenceManagerOptions = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const {
    caseId,
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  // Query for evidence list
  const {
    data: evidence = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["evidence", caseId],
    queryFn: () => fetchEvidence(caseId),
    enabled: !!user,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      files,
      caseId: targetCaseId,
    }: {
      files: File[];
      caseId: string;
    }) => {
      return uploadEvidenceFiles(files, targetCaseId, setUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast({
        title: "Upload Successful",
        description: "Evidence has been uploaded and is being processed",
      });
    },
    onError: (error) => {
      logError(
        "Evidence upload failed",
        { caseId },
        error instanceof Error ? error : new Error(String(error))
      );
      toast({
        title: "Upload Failed",
        description: "Failed to upload evidence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Verification mutation
  const verifyMutation = useMutation({
    mutationFn: async (evidenceId: string) => {
      return verifyEvidence(evidenceId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      logAudit("Evidence verified", {
        evidenceId: data.id,
        verifiedBy: user?.id,
      });
      toast({
        title: "Verification Complete",
        description: "Evidence has been successfully verified",
      });
    },
    onError: (error) => {
      logError(
        "Evidence verification failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      toast({
        title: "Verification Failed",
        description: "Failed to verify evidence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (evidenceId: string) => {
      return deleteEvidence(evidenceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      toast({
        title: "Evidence Deleted",
        description: "Evidence has been removed from the system",
      });
    },
    onError: (error) => {
      logError(
        "Evidence deletion failed",
        {},
        error instanceof Error ? error : new Error(String(error))
      );
      toast({
        title: "Deletion Failed",
        description: "Failed to delete evidence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // File validation
  const validateFiles = useCallback(
    (
      files: File[]
    ): { valid: File[]; invalid: { file: File; reason: string }[] } => {
      const valid: File[] = [];
      const invalid: { file: File; reason: string }[] = [];

      files.forEach((file) => {
        // Check file size
        if (file.size > config.files.maxSize) {
          invalid.push({
            file,
            reason: `File size exceeds ${(
              config.files.maxSize /
              (1024 * 1024)
            ).toFixed(1)}MB limit`,
          });
          return;
        }

        // Check file type
        const isValidType = config.files.supportedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.replace("/*", "/"));
          }
          return file.type === type;
        });

        if (!isValidType) {
          invalid.push({
            file,
            reason: "File type not supported",
          });
          return;
        }

        // Check filename length
        if (file.name.length > config.fileConstraints.MAX_FILENAME_LENGTH) {
          invalid.push({
            file,
            reason: "Filename too long",
          });
          return;
        }

        valid.push(file);
      });

      return { valid, invalid };
    },
    []
  );

  // Upload files
  const uploadFiles = useCallback(
    async (files: File[], targetCaseId: string) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload evidence",
          variant: "destructive",
        });
        return;
      }

      const { valid, invalid } = validateFiles(files);

      if (invalid.length > 0) {
        invalid.forEach(({ file, reason }) => {
          toast({
            title: "File Validation Failed",
            description: `${file.name}: ${reason}`,
            variant: "destructive",
          });
        });
      }

      if (valid.length > 0) {
        uploadMutation.mutate({ files: valid, caseId: targetCaseId });
      }
    },
    [user, validateFiles, uploadMutation]
  );

  // Get evidence statistics
  const statistics = useMemo(() => {
    return {
      total: evidence.length,
      verified: evidence.filter((e) => e.verified).length,
      pending: evidence.filter((e) => e.status === "pending").length,
      processing: evidence.filter((e) => e.status === "processing").length,
      rejected: evidence.filter((e) => e.status === "rejected").length,
      totalSize: evidence.reduce((sum, e) => sum + e.size, 0),
    };
  }, [evidence]);

  // Get evidence by type
  const evidenceByType = useMemo(() => {
    const byType: Record<string, EvidenceItem[]> = {};
    evidence.forEach((item) => {
      const type = item.type || "other";
      if (!byType[type]) byType[type] = [];
      byType[type].push(item);
    });
    return byType;
  }, [evidence]);

  return {
    // Data
    evidence,
    statistics,
    evidenceByType,
    uploadProgress,

    // Loading states
    isLoading,
    isUploading: uploadMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    error,
    uploadError: uploadMutation.error,
    verifyError: verifyMutation.error,
    deleteError: deleteMutation.error,

    // Actions
    uploadFiles,
    verifyEvidence: verifyMutation.mutate,
    deleteEvidence: deleteMutation.mutate,
    refetch,
    validateFiles,

    // Utilities
    clearUploadProgress: () => setUploadProgress([]),
  };
};

// Helper functions (these would typically interact with actual services)

async function fetchEvidence(caseId?: string): Promise<EvidenceItem[]> {
  try {
    const response = await fetch(
      `${config.api.baseUrl}/evidence${caseId ? `?caseId=${caseId}` : ""}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch evidence: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Fallback to mock data for development
    if (config.features.mockAuth) {
      return mockDataService.getEvidenceForCase(caseId || "");
    }
    throw error;
  }
}

async function uploadEvidenceFiles(
  files: File[],
  caseId: string,
  setProgress: React.Dispatch<React.SetStateAction<UploadProgress[]>>
): Promise<EvidenceItem[]> {
  const startTime = Date.now();
  const results: EvidenceItem[] = [];

  try {
    // Initialize progress
    const initialProgress: UploadProgress[] = files.map((file) => ({
      fileId: `${Date.now()}-${file.name}`,
      fileName: file.name,
      progress: 0,
      status: "preparing" as const,
    }));
    setProgress(initialProgress);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = initialProgress[i].fileId;

      try {
        // Update progress
        setProgress((prev) =>
          prev.map((p) =>
            p.fileId === fileId
              ? { ...p, status: "uploading" as const, progress: 25 }
              : p
          )
        );

        // Upload file to IPFS (or simulate in development)
        let ipfsHash = "";
        let txHash = "";

        if (config.features.mockBlockchain) {
          // Simulate upload and blockchain transaction
          ipfsHash = `QmMockHash${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

          // Simulate processing time
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          // Actual IPFS upload would go here
          // const ipfsService = await import('@/services/ipfsService');
          // ipfsHash = await ipfsService.uploadFile(file);

          // Update progress
          setProgress((prev) =>
            prev.map((p) =>
              p.fileId === fileId
                ? { ...p, status: "processing" as const, progress: 50 }
                : p
            )
          );

          // Actual blockchain transaction would go here
          // const web3Service = await import('@/services/web3Service');
          // txHash = await web3Service.addEvidence(ipfsHash, file.name, caseId);
        }

        // Update progress
        setProgress((prev) =>
          prev.map((p) =>
            p.fileId === fileId
              ? { ...p, status: "processing" as const, progress: 75 }
              : p
          )
        );

        // Create evidence item
        const evidenceItem: EvidenceItem = {
          id: `EV-${Date.now()}-${i}`,
          name: file.name,
          type: file.type.split("/")[0],
          mimeType: file.type,
          caseId,
          submittedBy: "current-user", // Would come from auth context
          submittedDate: new Date().toISOString(),
          size: file.size,
          verified: false,
          status: "pending",
          ipfsHash,
          blockchainTxHash: txHash,
          chainOfCustody: [
            {
              id: `COC-${Date.now()}`,
              action: "created",
              timestamp: new Date().toISOString(),
              userId: "current-user",
              userName: "Current User",
              userRole: "Officer",
              details: "Evidence uploaded to system",
            },
          ],
        };

        results.push(evidenceItem);

        // Complete progress
        setProgress((prev) =>
          prev.map((p) =>
            p.fileId === fileId
              ? { ...p, status: "completed" as const, progress: 100 }
              : p
          )
        );
      } catch (error) {
        // Error progress
        setProgress((prev) =>
          prev.map((p) =>
            p.fileId === fileId
              ? {
                  ...p,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : String(error),
                }
              : p
          )
        );
        throw error;
      }
    }

    logPerformance("Upload evidence files", Date.now() - startTime, {
      fileCount: files.length,
      caseId,
    });

    return results;
  } catch (error) {
    logError(
      "Evidence upload failed",
      { caseId, fileCount: files.length },
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

async function verifyEvidence(evidenceId: string): Promise<EvidenceItem> {
  try {
    logAudit("Evidence verification initiated", { evidenceId });

    if (config.features.mockBlockchain) {
      // Mock verification process - create a properly structured evidence item
      const verifiedEvidence: EvidenceItem = {
        id: evidenceId,
        name: "Verified Evidence",
        type: "document",
        mimeType: "application/pdf",
        caseId: "FF-2023-001",
        submittedBy: "current-user",
        submittedDate: new Date().toISOString(),
        size: 1024,
        verified: true,
        status: "verified" as const,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        ipfsHash: `Qm${Math.random().toString(36).substr(2, 44)}`,
        blockchainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        chainOfCustody: [
          {
            id: `COC-${Date.now()}`,
            action: "verified" as const,
            timestamp: new Date().toISOString(),
            userId: "current-user",
            userName: "Current User",
            userRole: "Forensic Expert",
            details: "Evidence verified through blockchain",
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          },
        ],
      };

      return verifiedEvidence;
    } else {
      // Real verification would involve:
      // 1. Fetch evidence from blockchain
      // 2. Verify IPFS hash integrity
      // 3. Check chain of custody
      // 4. Update verification status on blockchain

      const response = await fetch(
        `${config.api.baseUrl}/evidence/${evidenceId}/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      return await response.json();
    }
  } catch (error) {
    logError(
      "Evidence verification failed",
      { evidenceId },
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

async function deleteEvidence(evidenceId: string): Promise<void> {
  try {
    logAudit("Evidence deletion requested", { evidenceId });

    if (config.features.mockBlockchain) {
      // Mock deletion - in reality, evidence should be marked as deleted
      // rather than actually removed from immutable storage
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    } else {
      const response = await fetch(
        `${config.api.baseUrl}/evidence/${evidenceId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Deletion failed: ${response.statusText}`);
      }
    }
  } catch (error) {
    logError(
      "Evidence deletion failed",
      { evidenceId },
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

export default useEvidenceManager;

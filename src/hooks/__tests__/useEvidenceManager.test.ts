// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useEvidenceManager } from "../useEvidenceManager";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import ipfsService from "@/services/ipfsService";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/services/ipfsService", () => ({
  default: {
    uploadFile: vi.fn(),
  },
}));

describe("useEvidenceManager", () => {
  const mockFrom = vi.mocked(supabase.from);
  const mockToast = vi.mocked(toast);
  const mockUploadFile = vi.mocked(ipfsService.uploadFile);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Evidence Fetching", () => {
    it("should fetch and transform evidence successfully on mount", async () => {
      const mockData = [
        {
          evidence_id: "EV-001",
          original_filename: "test.pdf",
          container_id: "CASE-123",
          created_at: "2023-01-01T00:00:00.000Z",
          hash_original: "0x123hash",
          cid: "QmTestCID",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      mockFrom.mockReturnValue(mockQuery as unknown as ReturnType<typeof supabase.from>);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFrom).toHaveBeenCalledWith("evidence1");
      expect(mockQuery.select).toHaveBeenCalledWith("*");
      expect(result.current.evidence).toEqual([
        {
          id: "EV-001",
          name: "test.pdf",
          type: "application",
          caseId: "CASE-123",
          submittedBy: "Unknown User",
          submittedDate: "2023-01-01T00:00:00.000Z",
          verified: false,
          hash: "0x123hash",
          cidEncrypted: "QmTestCID",
        },
      ]);
    });

    it("should filter by caseId when caseId is provided", async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockQuery = {
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      };
      mockFrom.mockReturnValue(mockQuery as unknown as ReturnType<typeof supabase.from>);

      renderHook(() => useEvidenceManager("CASE-123"));

      await waitFor(() => {
        expect(mockEq).toHaveBeenCalledWith("container_id", "CASE-123");
      });
    });

    it("should handle error when evidence fetch fails and show toast notification", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const fetchError = new Error("Database query failed");

      const mockQuery = {
        select: vi.fn().mockResolvedValue({ data: null, error: fetchError }),
      };
      mockFrom.mockReturnValue(mockQuery as unknown as ReturnType<typeof supabase.from>);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch evidence:", fetchError);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to fetch evidence data",
        variant: "destructive",
      });
      expect(result.current.evidence).toEqual([]);
    });

    it("should handle thrown exception during fetch and show toast notification", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const unexpectedError = new Error("Unexpected network failure");

      const mockQuery = {
        select: vi.fn().mockRejectedValue(unexpectedError),
      };
      mockFrom.mockReturnValue(mockQuery as unknown as ReturnType<typeof supabase.from>);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch evidence:", unexpectedError);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to fetch evidence data",
        variant: "destructive",
      });
    });
  });

  describe("Evidence Upload", () => {
    it("should successfully upload evidence", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "evidence1") {
          return {
            ...mockSelectQuery,
            ...mockInsertQuery,
          } as unknown as ReturnType<typeof supabase.from>;
        }
        return {} as unknown as ReturnType<typeof supabase.from>;
      });

      mockUploadFile.mockResolvedValue({
        cid: "QmUploadedCID",
        hash: "0xUploadedHash",
      });

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const file = new File(["test content"], "doc.pdf", { type: "application/pdf" });

      let uploadRes: { evidenceId: string; cid: string; hash: string } | null = null;
      await act(async () => {
        uploadRes = await result.current.uploadEvidence(file, "CASE-999", "pdf");
      });

      expect(uploadRes).not.toBeNull();
      expect(uploadRes?.cid).toBe("QmUploadedCID");
      expect(uploadRes?.hash).toBe("0xUploadedHash");
      expect(mockToast).toHaveBeenCalledWith({
        title: "Evidence Uploaded",
        description: "doc.pdf has been uploaded successfully",
      });
    });

    it("should handle error during upload evidence", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockFrom.mockReturnValue(mockSelectQuery as unknown as ReturnType<typeof supabase.from>);
      mockUploadFile.mockRejectedValue(new Error("IPFS upload failed"));

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const file = new File(["test"], "failed.pdf", { type: "application/pdf" });

      let uploadRes: unknown = undefined;
      await act(async () => {
        uploadRes = await result.current.uploadEvidence(file, "CASE-999", "pdf");
      });

      expect(uploadRes).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Upload Failed",
        description: "Failed to upload evidence file",
        variant: "destructive",
      });
    });
  });

  describe("Evidence Verification", () => {
    it("should verify evidence successfully when status is valid", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockSelectQuery as unknown as ReturnType<typeof supabase.from>);

      const mockGetSession = vi.mocked(supabase.auth.getSession);
      mockGetSession.mockResolvedValue({
        data: { session: { access_token: "mock-token" } as unknown as { access_token: string; [key: string]: unknown } },
        error: null,
      });

      const globalFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          details: [
            {
              evidence_id: "EV-100",
              status: "valid",
            },
          ],
        }),
      } as Response);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let verifyRes: boolean = false;
      await act(async () => {
        verifyRes = await result.current.verifyEvidence("EV-100");
      });

      expect(verifyRes).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Evidence Verified",
        description: "Evidence EV-100 is valid and untampered",
      });

      globalFetchSpy.mockRestore();
    });

    it("should fail verification when evidence status is invalid", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockSelectQuery as unknown as ReturnType<typeof supabase.from>);

      const globalFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({
          details: [
            {
              evidence_id: "EV-100",
              status: "hash_mismatch",
            },
          ],
        }),
      } as Response);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let verifyRes: boolean = true;
      await act(async () => {
        verifyRes = await result.current.verifyEvidence("EV-100");
      });

      expect(verifyRes).toBe(false);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Evidence Verification Failed",
        description: "Status: hash_mismatch",
        variant: "destructive",
      });

      globalFetchSpy.mockRestore();
    });

    it("should handle error when sync API fails", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockQuerySelect(mockSelectQuery));

      const globalFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
      } as Response);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let verifyRes: boolean = true;
      await act(async () => {
        verifyRes = await result.current.verifyEvidence("EV-100");
      });

      expect(verifyRes).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Verification Failed",
        description: "Failed to sync evidence with blockchain",
        variant: "destructive",
      });

      globalFetchSpy.mockRestore();
    });
  });

  describe("Evidence Download and View", () => {
    it("should download evidence successfully", async () => {
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockQuerySelect(mockSelectQuery));

      const mockBlob = new Blob(["file bytes"], { type: "application/pdf" });
      const globalFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        blob: async () => mockBlob,
      } as Response);

      const mockCreateObjectURL = vi.fn().mockReturnValue("blob:http://localhost/123");
      const mockRevokeObjectURL = vi.fn();
      vi.stubGlobal("URL", {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      });

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const item = {
        id: "EV-001",
        name: "file.pdf",
        type: "application",
        caseId: "CASE-001",
        submittedBy: "User",
        submittedDate: "2023-01-01",
        verified: true,
      };

      let downloadRes: boolean = false;
      await act(async () => {
        downloadRes = await result.current.downloadEvidence(item);
      });

      expect(downloadRes).toBe(true);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Evidence Downloaded",
        description: "file.pdf downloaded successfully",
      });

      globalFetchSpy.mockRestore();
      vi.unstubAllGlobals();
    });

    it("should handle error during download failure", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockSelectQuery = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockFrom.mockReturnValue(mockQuerySelect(mockSelectQuery));

      const globalFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        text: async () => "File not found",
      } as Response);

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const item = {
        id: "EV-001",
        name: "file.pdf",
        type: "application",
        caseId: "CASE-001",
        submittedBy: "User",
        submittedDate: "2023-01-01",
        verified: true,
      };

      let downloadRes: boolean = true;
      await act(async () => {
        downloadRes = await result.current.downloadEvidence(item);
      });

      expect(downloadRes).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Download Failed",
        description: "File not found",
        variant: "destructive",
      });

      globalFetchSpy.mockRestore();
    });

    it("should track view activity and return evidence item when viewEvidence is called", async () => {
      const mockData = [
        {
          evidence_id: "EV-001",
          original_filename: "test.pdf",
          container_id: "CASE-123",
          created_at: "2023-01-01T00:00:00.000Z",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      mockFrom.mockReturnValue(mockQuerySelect(mockQuery));

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let foundItem: unknown = null;
      act(() => {
        foundItem = result.current.viewEvidence("EV-001");
      });

      expect(foundItem).not.toBeNull();
      expect(result.current.recentActivity.length).toBeGreaterThan(0);
      expect(result.current.recentActivity[0].action).toBe("view");
      expect(result.current.recentActivity[0].evidenceId).toBe("EV-001");
    });
  });
});

function mockQuerySelect(mockSelectQuery: Record<string, unknown>): ReturnType<typeof supabase.from> {
  return mockSelectQuery as unknown as ReturnType<typeof supabase.from>;
}

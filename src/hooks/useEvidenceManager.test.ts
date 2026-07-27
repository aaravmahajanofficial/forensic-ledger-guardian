import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useEvidenceManager } from "./useEvidenceManager";
import { toast } from "@/hooks/use-toast";
import ipfsService from "@/services/ipfsService";

// Mock supabase client
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("useEvidenceManager", () => {
  let mockSupabase: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase = (await import("@/lib/supabaseClient")).supabase;
    // reset localStorage
    localStorage.clear();
  });

  describe("fetchEvidence", () => {
    it("should successfully fetch and format evidence", async () => {
      const mockData = [
        {
          evidence_id: "EV-123",
          original_filename: "test.pdf",
          container_id: "CASE-1",
          created_at: "2023-01-01T00:00:00Z",
          hash_original: "hash123",
          cid: "cid123",
        },
      ];

      const mockSelect = vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(Promise.resolve({
            data: mockData,
            error: null
          })) // for the filter case
        })
      });

      // Default mock for no caseId
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.evidence).toHaveLength(1);
      expect(result.current.evidence[0]).toEqual({
        id: "EV-123",
        name: "test.pdf",
        type: "application",
        caseId: "CASE-1",
        submittedBy: "Unknown User",
        submittedDate: "2023-01-01T00:00:00Z",
        verified: false,
        hash: "hash123",
        cidEncrypted: "cid123",
      });
    });

    it("should handle error during fetch", async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: null,
        error: new Error("Database connection error"),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.evidence).toEqual([]);
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to fetch evidence data",
        variant: "destructive",
      });
    });
  });

  describe("uploadEvidence", () => {
    it("should handle error during upload", async () => {
      // Mock initial fetch to succeed so it doesn't log a fetch error
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
        insert: vi.fn().mockResolvedValue({
          error: new Error("Insert failed"),
        }),
      });

      const { result } = renderHook(() => useEvidenceManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Override the from mock to now handle the insert call
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        insert: vi.fn().mockResolvedValue({
          error: new Error("Insert failed"),
        }),
      });

      // Mock IPFS upload
      (ipfsService.uploadFile as any).mockResolvedValue({
        cid: "mock-cid",
        hash: "mock-hash"
      });

      const file = new File(["dummy content"], "test.txt", { type: "text/plain" });

      let uploadResult;
      await act(async () => {
        uploadResult = await result.current.uploadEvidence(file, "CASE-1", "application");
      });

      expect(uploadResult).toBeNull();
      expect(toast).toHaveBeenCalledWith({
        title: "Upload Failed",
        description: "Failed to upload evidence file",
        variant: "destructive",
      });
      expect(result.current.loading).toBe(false);
    });
  });
});

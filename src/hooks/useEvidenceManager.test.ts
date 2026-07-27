// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useEvidenceManager } from "./useEvidenceManager";

// Mock supabase client
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      then: vi.fn(),
    })),
  },
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Mock ipfsService to avoid network calls
vi.mock("@/services/ipfsService", () => ({
  default: {
    uploadFile: vi.fn(),
  },
}));

import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

describe("useEvidenceManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches evidence successfully (happy path)", async () => {
    // Setup supabase mock to return success data
    const mockData = [
      {
        evidence_id: "EV-123-001",
        original_filename: "test-file.txt",
        container_id: "case-123",
        created_at: "2023-01-01T00:00:00.000Z",
        hash_original: "mock-hash",
        cid: "mock-cid",
      },
    ];

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    });

    const { result } = renderHook(() => useEvidenceManager("case-123"));

    // Verify initial loading state
    expect(result.current.loading).toBe(true);

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if evidence was properly transformed and set
    expect(result.current.evidence).toHaveLength(1);
    expect(result.current.evidence[0]).toEqual(
      expect.objectContaining({
        id: "EV-123-001",
        name: "test-file.txt",
        caseId: "case-123",
        hash: "mock-hash",
        cidEncrypted: "mock-cid",
      })
    );

    // Ensure toast was not called with an error
    expect(toast).not.toHaveBeenCalled();
  });

  it("handles error during fetchEvidence (error path)", async () => {
    // Setup supabase mock to return an error
    const mockError = new Error("Database connection failed");
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      }),
    });

    const { result } = renderHook(() => useEvidenceManager("case-123"));

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if toast was called with error details
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: "Failed to fetch evidence data",
        variant: "destructive",
      })
    );

    // Check if evidence remains empty
    expect(result.current.evidence).toEqual([]);
  });
});

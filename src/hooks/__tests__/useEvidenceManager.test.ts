// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEvidenceManager } from "../useEvidenceManager";
import { toast } from "@/hooks/use-toast";
import ipfsService from "@/services/ipfsService";
import { supabase } from "@/lib/supabaseClient";

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/services/ipfsService", () => ({
  default: {
    uploadFile: vi.fn(),
  },
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
    },
  },
}));

describe("useEvidenceManager - uploadEvidence error paths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle IPFS upload failure gracefully", async () => {
    vi.mocked(ipfsService.uploadFile).mockRejectedValue(
      new Error("IPFS upload network failure"),
    );

    // Mock initial fetch query to return empty data
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as ReturnType<typeof supabase.from>);

    const { result } = renderHook(() => useEvidenceManager("CASE-123"));

    const testFile = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    let uploadResult: unknown;
    await act(async () => {
      uploadResult = await result.current.uploadEvidence(
        testFile,
        "CASE-123",
        "doc",
      );
    });

    expect(uploadResult).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Failed to upload evidence:",
      expect.any(Error),
    );
    expect(toast).toHaveBeenCalledWith({
      title: "Upload Failed",
      description: "Failed to upload evidence file",
      variant: "destructive",
    });
  });

  it("should handle Supabase insertion error gracefully", async () => {
    vi.mocked(ipfsService.uploadFile).mockResolvedValue({
      cid: "QmTestCid123",
      hash: "0xTestHash123",
    });

    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("Supabase insert database failure"),
    });

    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === "evidence1") {
        return {
          select: mockSelect,
          insert: mockInsert,
        } as ReturnType<typeof supabase.from>;
      }
      return {} as ReturnType<typeof supabase.from>;
    });

    const { result } = renderHook(() => useEvidenceManager("CASE-123"));

    const testFile = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    let uploadResult: unknown;
    await act(async () => {
      uploadResult = await result.current.uploadEvidence(
        testFile,
        "CASE-123",
        "doc",
      );
    });

    expect(uploadResult).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      "Failed to upload evidence:",
      expect.any(Error),
    );
    expect(toast).toHaveBeenCalledWith({
      title: "Upload Failed",
      description: "Failed to upload evidence file",
      variant: "destructive",
    });
  });
});

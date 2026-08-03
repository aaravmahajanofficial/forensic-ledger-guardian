import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import web3Service from "../web3Service";
import { toast } from "@/hooks/use-toast";

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("Web3Service - reopenCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false and call toast on transaction failure", async () => {
    const caseId = "case-123";
    const errorMessage = "Transaction failed";

    // Mock console.error to prevent it from cluttering test output
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Provide a mock contract instance to the service
    // We cast to any to bypass the private modifier
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service: any = web3Service;

    // Create a mock contract where reopenCase throws an error
    const mockContract = {
      reopenCase: vi.fn().mockRejectedValue(new Error(errorMessage))
    };

    service.contract = mockContract;

    const result = await web3Service.reopenCase(caseId);

    expect(result).toBe(false);
    expect(mockContract.reopenCase).toHaveBeenCalledWith(caseId);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error reopening case ${caseId}:`,
      expect.any(Error)
    );
    expect(toast).toHaveBeenCalledWith({
      title: "Transaction Failed",
      description: "Failed to reopen case. Please try again.",
      variant: "destructive",
    });
  });
});

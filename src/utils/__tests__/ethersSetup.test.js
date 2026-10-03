import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("ethersSetup contract address configuration", () => {
  const originalEnv = process.env.VITE_CONTRACT_ADDRESS;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.VITE_CONTRACT_ADDRESS = originalEnv;
    } else {
      delete process.env.VITE_CONTRACT_ADDRESS;
    }
    vi.resetModules();
  });

  it("should use process.env.VITE_CONTRACT_ADDRESS when set", async () => {
    process.env.VITE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
    const { getContract } = await import("../ethersSetup.js");
    const contract = await getContract(false);
    expect(contract.target).toBe("0x1234567890123456789012345678901234567890");
  });

  it("should use default fallback address when process.env.VITE_CONTRACT_ADDRESS is not set", async () => {
    delete process.env.VITE_CONTRACT_ADDRESS;
    const { getContract } = await import("../ethersSetup.js");
    const contract = await getContract(false);
    expect(contract.target).toBe("0x195304e4c900e52543ace755dd02cfa6272cb79d");
  });
});

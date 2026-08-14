import { describe, it, expect } from "vitest";
import { shortenAddress } from "./fileUtils";

describe("shortenAddress", () => {
  it("should shorten a standard blockchain address correctly", () => {
    // 42 character Ethereum address: 0x + 40 hex chars
    const address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    const result = shortenAddress(address);
    // 0x71C7 + ... + 976F -> 13 chars total
    expect(result).toBe("0x71C7...976F");
  });

  it("should return an empty string if given an empty string", () => {
    expect(shortenAddress("")).toBe("");
  });

  it("should handle short strings (less than 10 chars) gracefully", () => {
    const result = shortenAddress("0x123");
    expect(result).toBe("0x123...x123");
  });

  it("should handle undefined or null by returning empty string if it passes TS checks", () => {
    // @ts-expect-error - testing invalid JS inputs
    expect(shortenAddress(null)).toBe("");
    // @ts-expect-error - testing invalid JS inputs
    expect(shortenAddress(undefined)).toBe("");
  });
});

import { describe, it, expect } from "vitest";
import { shortenAddress } from "./fileUtils";

describe("shortenAddress", () => {
  it("returns an empty string if input is empty", () => {
    expect(shortenAddress("")).toBe("");
  });

  it("returns an empty string if input is undefined or null (falsy)", () => {
    // @ts-expect-error testing invalid input
    expect(shortenAddress(undefined)).toBe("");
    // @ts-expect-error testing invalid input
    expect(shortenAddress(null)).toBe("");
  });

  it("shortens a valid Ethereum address correctly", () => {
    const address = "0x1234567890123456789012345678901234567890";
    expect(shortenAddress(address)).toBe("0x1234...7890");
  });

  it("shortens shorter strings appropriately without crashing", () => {
    const shortAddress = "0x1234";
    // address.substring(0, 6) -> "0x1234"
    // address.length - 4 = 2, address.substring(2) -> "1234"
    // "0x1234...1234"
    expect(shortenAddress(shortAddress)).toBe("0x1234...1234");
  });
});

import { describe, it, expect } from "vitest";
import { shortenAddress } from "./fileUtils";

describe("shortenAddress", () => {
  it("should return an empty string for null, undefined, or empty string", () => {
    expect(shortenAddress("")).toBe("");
    // @ts-expect-error - testing runtime handling of null
    expect(shortenAddress(null as unknown as string)).toBe("");
    // @ts-expect-error - testing runtime handling of undefined
    expect(shortenAddress(undefined as unknown as string)).toBe("");
  });

  it("should return the original string if its length is 10 or less", () => {
    expect(shortenAddress("0x123")).toBe("0x123");
    expect(shortenAddress("0123456789")).toBe("0123456789");
  });

  it("should shorten a standard blockchain address", () => {
    const address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    const expected = "0x71C7...976F";
    expect(shortenAddress(address)).toBe(expected);
  });

  it("should shorten an 11-character string properly", () => {
    const address = "01234567890";
    const expected = "012345...7890";
    expect(shortenAddress(address)).toBe(expected);
  });
});

import { describe, it, expect } from "vitest";
import { cn, handleAuthError } from "../utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes and falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("should resolve tailwind class conflicts", () => {
    expect(cn("px-2 py-1", "p-4")).toBe("p-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("should handle array and object inputs", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});

describe("handleAuthError utility", () => {
  it("should identify refresh token errors", () => {
    const error = new Error("Invalid Refresh Token");
    const result = handleAuthError(error);

    expect(result).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });
  });

  it("should identify session errors", () => {
    const error = new Error("session expired");
    const result = handleAuthError(error);

    expect(result).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });
  });

  it("should handle general Error instances", () => {
    const error = new Error("Network request failed");
    const result = handleAuthError(error);

    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Network request failed",
    });
  });

  it("should handle string error messages", () => {
    const result = handleAuthError("Custom error message");

    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Custom error message",
    });
  });

  it("should handle unknown error types", () => {
    const result = handleAuthError(12345);

    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });
  });
});

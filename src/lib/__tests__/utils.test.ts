import { describe, it, expect } from "vitest";
import { handleAuthError, cn } from "../utils";

describe("cn utility function", () => {
  it("combines class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional class names and tailwind merge", () => {
    const isHidden = false;
    expect(cn("px-2 py-1", isHidden && "bg-blue-500", "px-4")).toBe("py-1 px-4");
  });
});

describe("handleAuthError utility function", () => {
  it("handles Error instances with token/session error messages", () => {
    const error1 = new Error("Invalid Refresh Token provided");
    const result1 = handleAuthError(error1);
    expect(result1).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });

    const error2 = new Error("User session has expired");
    const result2 = handleAuthError(error2);
    expect(result2).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });

    const error3 = new Error("Error code: invalid_jwt");
    const result3 = handleAuthError(error3);
    expect(result3).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });
  });

  it("handles string error inputs with token/session error messages", () => {
    const result1 = handleAuthError("refresh_token missing");
    expect(result1).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });

    const result2 = handleAuthError("Session expired");
    expect(result2).toEqual({
      isTokenError: true,
      shouldClearSession: true,
      message: "Your session has expired. Please sign in again.",
    });
  });

  it("handles non-token Error instances", () => {
    const error = new Error("Network request failed");
    const result = handleAuthError(error);
    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Network request failed",
    });
  });

  it("handles non-token string errors", () => {
    const result = handleAuthError("Database connection timeout");
    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Database connection timeout",
    });
  });

  it("handles non-Error non-string inputs (unknown type)", () => {
    expect(handleAuthError(null)).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });

    expect(handleAuthError(undefined)).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });

    expect(handleAuthError(404)).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });

    expect(handleAuthError({ code: 500, detail: "Server error" })).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });
  });
});

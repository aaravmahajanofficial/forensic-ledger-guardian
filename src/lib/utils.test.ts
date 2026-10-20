import { describe, it, expect } from 'vitest';
import { handleAuthError } from './utils';

describe('handleAuthError', () => {
  it('should handle string error input', () => {
    const error = "Custom string error";
    const result = handleAuthError(error);
    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Custom string error",
    });
  });

  it('should handle Error object input', () => {
    const error = new Error("Standard error message");
    const result = handleAuthError(error);
    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Standard error message",
    });
  });

  it('should handle unknown error input (e.g. number or null)', () => {
    const resultNum = handleAuthError(42);
    expect(resultNum).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });

    const resultNull = handleAuthError(null);
    expect(resultNull).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Unknown error",
    });
  });

  it('should detect refresh token errors and flag them correctly', () => {
    const refreshErrors = [
      "Error: Refresh Token is missing",
      "invalid refresh_token",
      new Error("Invalid Refresh Token provided"),
    ];

    refreshErrors.forEach((err) => {
      const result = handleAuthError(err);
      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: "Your session has expired. Please sign in again.",
      });
    });
  });

  it('should detect session errors and flag them correctly', () => {
    const sessionErrors = [
      "no session found",
      "token expired",
      new Error("invalid_jwt detected"),
    ];

    sessionErrors.forEach((err) => {
      const result = handleAuthError(err);
      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: "Your session has expired. Please sign in again.",
      });
    });
  });

  it('should handle regular errors without clearing session', () => {
    const result = handleAuthError(new Error("Network connection lost"));
    expect(result).toEqual({
      isTokenError: false,
      shouldClearSession: false,
      message: "Network connection lost",
    });
  });
});

import { describe, it, expect } from 'vitest';
import { handleAuthError } from './utils';

describe('handleAuthError', () => {
  it('should handle Error instances', () => {
    const error = new Error('Some random error');
    const result = handleAuthError(error);
    expect(result.message).toBe('Some random error');
    expect(result.isTokenError).toBe(false);
    expect(result.shouldClearSession).toBe(false);
  });

  it('should handle string errors', () => {
    const error = 'Some string error';
    const result = handleAuthError(error);
    expect(result.message).toBe('Some string error');
    expect(result.isTokenError).toBe(false);
    expect(result.shouldClearSession).toBe(false);
  });

  it('should handle unknown error types (edge case)', () => {
    const testCases = [null, undefined, 123, { code: 500 }];

    testCases.forEach(error => {
      const result = handleAuthError(error);
      expect(result.message).toBe('Unknown error');
      expect(result.isTokenError).toBe(false);
      expect(result.shouldClearSession).toBe(false);
    });
  });

  describe('token error detection', () => {
    const tokenErrorMessages = [
      'Refresh Token is invalid',
      'invalid refresh_token',
      'Invalid Refresh Token provided',
      'session expired',
      'invalid_jwt token',
    ];

    tokenErrorMessages.forEach(msg => {
      it(`should detect token error for: "${msg}"`, () => {
        const result = handleAuthError(new Error(msg));
        expect(result.isTokenError).toBe(true);
        expect(result.shouldClearSession).toBe(true);
        expect(result.message).toBe('Your session has expired. Please sign in again.');
      });
    });
  });
});

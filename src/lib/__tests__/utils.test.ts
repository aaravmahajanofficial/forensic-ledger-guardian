import { describe, it, expect } from 'vitest';
import { cn, handleAuthError } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('px-2 py-1', 'bg-blue-500');
      expect(result).toBe('px-2 py-1 bg-blue-500');
    });

    it('handles conditional class names and falsy values', () => {
      const isHidden = false;
      const result = cn('base-class', isHidden && 'hidden', null, undefined, 'active');
      expect(result).toBe('base-class active');
    });

    it('resolves conflicting tailwind classes', () => {
      const result = cn('px-2 px-4', 'bg-red-500 bg-blue-500');
      expect(result).toBe('px-4 bg-blue-500');
    });
  });

  describe('handleAuthError', () => {
    describe('Error instance parsing', () => {
      it('handles Error instance with refresh token error', () => {
        const error = new Error('Invalid Refresh Token provided');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles Error instance with lower-case refresh_token error', () => {
        const error = new Error('error: refresh_token not found');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles Error instance with session keyword error', () => {
        const error = new Error('User session is invalid');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles Error instance with expired keyword error', () => {
        const error = new Error('Token has expired');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles Error instance with invalid_jwt keyword error', () => {
        const error = new Error('JWT error: invalid_jwt format');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles Error instance with non-auth error message', () => {
        const error = new Error('Network timeout');
        const result = handleAuthError(error);

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Network timeout',
        });
      });
    });

    describe('string error handling', () => {
      it('handles string input matching token error keywords', () => {
        const result = handleAuthError('Refresh Token expired');

        expect(result).toEqual({
          isTokenError: true,
          shouldClearSession: true,
          message: 'Your session has expired. Please sign in again.',
        });
      });

      it('handles string input with non-auth error', () => {
        const result = handleAuthError('Database query failed');

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Database query failed',
        });
      });
    });

    describe('unknown/non-standard error inputs', () => {
      it('handles object error input', () => {
        const result = handleAuthError({ code: 500, detail: 'Internal Error' });

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Unknown error',
        });
      });

      it('handles null error input', () => {
        const result = handleAuthError(null);

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Unknown error',
        });
      });

      it('handles undefined error input', () => {
        const result = handleAuthError(undefined);

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Unknown error',
        });
      });

      it('handles numeric error input', () => {
        const result = handleAuthError(404);

        expect(result).toEqual({
          isTokenError: false,
          shouldClearSession: false,
          message: 'Unknown error',
        });
      });
    });
  });
});

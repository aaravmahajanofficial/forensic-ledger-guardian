import { describe, it, expect } from 'vitest';
import { handleAuthError } from '../utils';

describe('handleAuthError', () => {
  describe('when error contains token/session keywords', () => {
    it('handles "Refresh Token" in Error object', () => {
      const error = new Error('Invalid Refresh Token provided');
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });

    it('handles "refresh_token" in string error', () => {
      const error = 'error: refresh_token expired';
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });

    it('handles "session" keyword', () => {
      const error = new Error('User session not found');
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });

    it('handles "expired" keyword', () => {
      const error = 'The token is expired';
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });

    it('handles "invalid_jwt" keyword', () => {
      const error = new Error('Auth failed: invalid_jwt');
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });
  });

  describe('when error is a general error', () => {
    it('handles standard Error object', () => {
      const error = new Error('Network timeout');
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Network timeout',
      });
    });

    it('handles standard string error', () => {
      const error = 'Internal server error';
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Internal server error',
      });
    });
  });

  describe('when error is of unknown type', () => {
    it('handles arbitrary objects', () => {
      const error = { code: 500, details: 'Server crashed' };
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Unknown error',
      });
    });

    it('handles null', () => {
      const error = null;
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Unknown error',
      });
    });

    it('handles undefined', () => {
      const error = undefined;
      const result = handleAuthError(error);

      expect(result).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Unknown error',
      });
    });
  });
});

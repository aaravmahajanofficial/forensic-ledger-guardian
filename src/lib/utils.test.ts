import { describe, it, expect } from 'vitest';
import { cn, handleAuthError } from './utils';

describe('cn', () => {
  it('should merge classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', { 'bg-blue-500': true, 'bg-green-500': false })).toBe('text-red-500 bg-blue-500');
  });
});

describe('handleAuthError', () => {
  describe('error parsing', () => {
    it('should parse Error instances', () => {
      const error = new Error('Custom error message');
      const result = handleAuthError(error);
      expect(result.message).toBe('Custom error message');
      expect(result.isTokenError).toBe(false);
      expect(result.shouldClearSession).toBe(false);
    });

    it('should parse string errors', () => {
      const result = handleAuthError('String error message');
      expect(result.message).toBe('String error message');
      expect(result.isTokenError).toBe(false);
      expect(result.shouldClearSession).toBe(false);
    });

    it('should handle unknown errors', () => {
      const result = handleAuthError({ some: 'object' });
      expect(result.message).toBe('Unknown error');
      expect(result.isTokenError).toBe(false);
      expect(result.shouldClearSession).toBe(false);
    });
  });

  describe('token and session error detection', () => {
    const tokenErrorMessages = [
      'Refresh Token',
      'refresh_token',
      'Invalid Refresh Token',
      'session',
      'expired',
      'invalid_jwt',
      'The session has expired.'
    ];

    tokenErrorMessages.forEach((msg) => {
      it(`should detect token error for message containing: "${msg}"`, () => {
        const result = handleAuthError(new Error(msg));
        expect(result.isTokenError).toBe(true);
        expect(result.shouldClearSession).toBe(true);
        expect(result.message).toBe('Your session has expired. Please sign in again.');
      });
    });

    it('should return correct standard message for token errors', () => {
      const result = handleAuthError(new Error('invalid_jwt'));
      expect(result.message).toBe('Your session has expired. Please sign in again.');
    });
  });
});

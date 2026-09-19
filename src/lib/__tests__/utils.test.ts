import { describe, it, expect } from 'vitest';
import { cn, handleAuthError } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    const isHidden = false;

    it.each([
      {
        inputs: ['px-2 py-1', 'bg-blue-500'],
        expected: 'px-2 py-1 bg-blue-500',
        desc: 'merges class names correctly',
      },
      {
        inputs: ['base-class', isHidden && 'hidden', null, undefined, 'active'],
        expected: 'base-class active',
        desc: 'handles conditional class names and falsy values',
      },
      {
        inputs: ['px-2 px-4', 'bg-red-500 bg-blue-500'],
        expected: 'px-4 bg-blue-500',
        desc: 'resolves conflicting tailwind classes',
      },
    ])('$desc', ({ inputs, expected }) => {
      expect(cn(...inputs)).toBe(expected);
    });
  });

  describe('handleAuthError', () => {
    describe('Token / session error cases', () => {
      it.each([
        ['Error instance with Refresh Token', new Error('Invalid Refresh Token provided')],
        ['Error instance with refresh_token', new Error('error: refresh_token not found')],
        ['Error instance with session', new Error('User session is invalid')],
        ['Error instance with expired keyword', new Error('Token has expired')],
        ['Error instance with invalid_jwt', new Error('JWT error: invalid_jwt format')],
        ['Raw string with token keyword', 'Refresh Token expired'],
      ])('identifies session expiry for %s', (_, input) => {
        const res = handleAuthError(input);
        expect(res.isTokenError).toBe(true);
        expect(res.shouldClearSession).toBe(true);
        expect(res.message).toMatch(/session has expired/i);
      });
    });

    describe('Non-token error cases', () => {
      it.each([
        ['Error instance with network timeout', new Error('Network timeout'), 'Network timeout'],
        ['Raw string error message', 'Database query failed', 'Database query failed'],
        ['Generic object error', { code: 500, detail: 'Internal Error' }, 'Unknown error'],
        ['null input', null, 'Unknown error'],
        ['undefined input', undefined, 'Unknown error'],
        ['Numeric error code', 404, 'Unknown error'],
      ])('handles non-auth input: %s', (_, input, expectedMessage) => {
        const res = handleAuthError(input);
        expect(res.isTokenError).toBe(false);
        expect(res.shouldClearSession).toBe(false);
        expect(res.message).toBe(expectedMessage);
      });
    });
  });
});

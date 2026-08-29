import { describe, it, expect } from 'vitest';
import { handleAuthError } from '../utils';

describe('handleAuthError', () => {
  describe('when error contains token/session keywords', () => {
    it.each([
      ['"Refresh Token" in Error object', new Error('Invalid Refresh Token provided')],
      ['"refresh_token" in string error', 'error: refresh_token expired'],
      ['"session" keyword', new Error('User session not found')],
      ['"expired" keyword', 'The token is expired'],
      ['"invalid_jwt" keyword', new Error('Auth failed: invalid_jwt')],
    ])('handles %s', (_, error) => {
      expect(handleAuthError(error)).toEqual({
        isTokenError: true,
        shouldClearSession: true,
        message: 'Your session has expired. Please sign in again.',
      });
    });
  });

  describe('when error is a general error', () => {
    it.each([
      ['standard Error object', new Error('Network timeout'), 'Network timeout'],
      ['standard string error', 'Internal server error', 'Internal server error'],
    ])('handles %s', (_, error, expectedMessage) => {
      expect(handleAuthError(error)).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: expectedMessage,
      });
    });
  });

  describe('when error is of unknown type', () => {
    it.each([
      ['arbitrary objects', { code: 500, details: 'Server crashed' }],
      ['null', null],
      ['undefined', undefined],
    ])('handles %s', (_, error) => {
      expect(handleAuthError(error)).toEqual({
        isTokenError: false,
        shouldClearSession: false,
        message: 'Unknown error',
      });
    });
  });
});

import { describe, it, expect } from 'vitest';
import { isDevUser } from './authUtils';

describe('isDevUser', () => {
  it('should return true for the exact dev address "0xdev"', () => {
    expect(isDevUser('0xdev')).toBe(true);
  });

  it('should return true for uppercase dev address "0xDEV"', () => {
    expect(isDevUser('0xDEV')).toBe(true);
  });

  it('should return true for mixed case dev address "0xDeV"', () => {
    expect(isDevUser('0xDeV')).toBe(true);
  });

  it('should return false for a regular user address', () => {
    expect(isDevUser('0x123abc456def')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isDevUser('')).toBe(false);
  });

  it('should return false for a similar but incorrect address', () => {
    expect(isDevUser('0xdevel')).toBe(false);
  });
});

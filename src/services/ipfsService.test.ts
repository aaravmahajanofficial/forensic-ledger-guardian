// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import ipfsService from './ipfsService';

describe('ipfsService - generateFileHash', () => {
  it('should generate hash correctly for valid file', async () => {
    const fileContent = 'hello world';
    const file = new File([fileContent], 'test.txt', { type: 'text/plain' });
    const hash = await ipfsService.generateFileHash(file);

    // Hash of 'hello world' is 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('should reject when file reading fails', async () => {
    class MockFileReader {
      onerror: (() => void) | null = null;
      onload: (() => void) | null = null;
      error = new Error('Read error');
      readAsArrayBuffer() {
        if (this.onerror) {
          this.onerror();
        }
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File([''], 'test.txt');
    await expect(ipfsService.generateFileHash(file)).rejects.toThrow('Read error');

    vi.unstubAllGlobals();
  });

  it('should reject when crypto.subtle.digest fails', async () => {
    // Mock crypto to fail
    const originalCrypto = window.crypto;
    Object.defineProperty(window, 'crypto', {
      value: {
        ...originalCrypto,
        subtle: {
          digest: vi.fn().mockRejectedValue(new Error('Crypto error'))
        }
      },
      configurable: true
    });

    const file = new File(['test'], 'test.txt');

    // Silence console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(ipfsService.generateFileHash(file)).rejects.toThrow('Crypto error');

    consoleSpy.mockRestore();

    // Restore crypto
    Object.defineProperty(window, 'crypto', {
      value: originalCrypto,
      configurable: true
    });
  });

  it('should reject when e.target.result is missing', async () => {
    class MockFileReader {
      onerror: (() => void) | null = null;
      onload: ((event: { target: { result: null } }) => void) | null = null;
      readAsArrayBuffer() {
        if (this.onload) {
          this.onload({ target: { result: null } });
        }
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File([''], 'test.txt');
    await expect(ipfsService.generateFileHash(file)).rejects.toEqual('Failed to read file');

    vi.unstubAllGlobals();
  });
});

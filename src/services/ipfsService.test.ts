import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IPFSService } from './ipfsService';

// Mock the ipfs-http-client module
vi.mock('ipfs-http-client', () => ({
  create: vi.fn(),
}));

import { create } from 'ipfs-http-client';

// Mock the console.error to prevent it from cluttering the test output
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('IPFSService Initialization Error Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should catch and log error when create() throws an error', () => {
    // Mock the create method to throw an error
    const mockError = new Error('Mock IPFS init error');
    vi.mocked(create).mockImplementation(() => {
      throw mockError;
    });

    // Instantiate the service, which should trigger the constructor
    const service = new IPFSService();

    // Verify that create was called
    expect(create).toHaveBeenCalled();

    // Verify that console.error was called with the correct error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create IPFS client:', mockError);

    // Verify that client is null (which we can check by trying to upload a file which throws if client is not initialized)
    expect(service['client']).toBeNull();
  });
});

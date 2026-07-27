import { jest } from '@jest/globals';

const mockAxiosGet = jest.fn();

jest.unstable_mockModule('axios', () => ({
  default: {
    get: mockAxiosGet,
    post: jest.fn(),
  }
}));

// We must import the module AFTER the mock is set up.
const { getPinnedFilenameFromPinata, filenameCache } = await import('./backendfinal.js');

describe('getPinnedFilenameFromPinata', () => {
  let consoleWarnSpy;

  beforeEach(() => {
    // Clear the cache before each test
    filenameCache.clear();

    // Spy on console.warn
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.warn
    consoleWarnSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should catch error and log a warning when axios request fails', async () => {
    // Arrange
    const errorMessage = 'Network error';
    mockAxiosGet.mockRejectedValue(new Error(errorMessage));
    const cid = 'testcid';

    // Act
    const result = await getPinnedFilenameFromPinata(cid);

    // Assert
    expect(result).toBeNull();
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith("Pinata metadata lookup failed:", errorMessage);
  });
});

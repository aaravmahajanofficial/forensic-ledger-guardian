// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Web3Service } from '../web3Service';
import { ethers } from 'ethers';

vi.mock('ethers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ethers')>();

  const mockGetAddress = vi.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678');
  const mockGetSigner = vi.fn().mockResolvedValue({ getAddress: mockGetAddress });

  return {
    ...actual,
    ethers: {
      ...actual.ethers,
      BrowserProvider: vi.fn().mockImplementation(function() {
        return {
          getSigner: mockGetSigner
        };
      }),
      Contract: vi.fn().mockImplementation(function() {
        return {};
      }),
    }
  };
});

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('Web3Service', () => {
  let web3Service: Web3Service;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as unknown as { ethereum?: unknown }).ethereum;
  });

  describe('setupProvider', () => {
    it('should setup provider successfully when window.ethereum is available', async () => {
      const mockEthOn = vi.fn();

      (window as unknown as { ethereum?: unknown }).ethereum = {
        on: mockEthOn,
        request: vi.fn()
      };

      web3Service = new Web3Service();

      expect(ethers.BrowserProvider).toHaveBeenCalled();
      expect(mockEthOn).toHaveBeenCalledWith('accountsChanged', expect.any(Function));
    });
  });

  describe('connectWallet / initWeb3', () => {
    it('should connect wallet and return account successfully', async () => {
      const mockAccount = '0x1234567890abcdef1234567890abcdef12345678';

      // Mock window.ethereum
      const mockEthRequest = vi.fn().mockResolvedValue([mockAccount]);
      const mockEthOn = vi.fn();

      (window as unknown as { ethereum?: unknown }).ethereum = {
        request: mockEthRequest,
        on: mockEthOn,
      };

      web3Service = new Web3Service();
      const account = await web3Service.connectWallet();

      expect(mockEthRequest).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
      expect(ethers.BrowserProvider).toHaveBeenCalled();
      expect(account).toBe(mockAccount);
      expect(ethers.Contract).toHaveBeenCalled();
    });

    it('should handle user rejection when connecting', async () => {
      // Mock window.ethereum to reject
      const mockEthRequest = vi.fn().mockRejectedValue(new Error('User rejected'));

      (window as unknown as { ethereum?: unknown }).ethereum = {
        request: mockEthRequest,
        on: vi.fn(),
      };

      web3Service = new Web3Service();
      const account = await web3Service.connectWallet();

      expect(mockEthRequest).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
      expect(account).toBeNull();
    });

    it('should handle missing ethereum provider', async () => {
      web3Service = new Web3Service();
      const account = await web3Service.connectWallet();
      expect(account).toBeNull();
    });
  });
});

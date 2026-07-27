import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import MetaMaskStatus from '../MetaMaskStatus';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from '@/hooks/use-toast';

// Mock the useWeb3 hook
vi.mock('@/hooks/useWeb3', () => ({
  useWeb3: vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('MetaMaskStatus', () => {
  let originalEthereum ;
  let originalWindowOpen ;

  beforeEach(() => {
    originalEthereum = window.ethereum;
    originalWindowOpen = window.open;
    window.open = vi.fn();

    vi.mocked(useWeb3).mockReturnValue({
      isConnected: false,
      chainId: null,
      networkName: '',
      isCorrectNetwork: false,
      switchNetwork: vi.fn(),
    }  );
  });

  afterEach(() => {
    window.ethereum = originalEthereum;
    window.open = originalWindowOpen;
    vi.clearAllMocks();
  });

  it('handles window.ethereum missing (MetaMask not installed)', async () => {
    window.ethereum = undefined;
    render(<MetaMaskStatus showDetails={true} />);

    await waitFor(() => {
      expect(screen.getByText('Not Installed')).toBeInTheDocument();
    });

    // Test the Install button
    const installButton = screen.getByText('Install');
    fireEvent.click(installButton);
    expect(window.open).toHaveBeenCalledWith('https://metamask.io/download/', '_blank');
  });

  it('handles window.ethereum connection failure (MetaMask is locked/returns error)', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('User rejected the request.'));
    window.ethereum = { request: mockRequest };

    render(<MetaMaskStatus showDetails={true} />);

    // Installation check passes because window.ethereum is defined
    expect(screen.getByText('MetaMask Installation')).toBeInTheDocument();

    // Wait for the state to update
    await waitFor(() => {
      // The wallet should be marked as "Locked" since the request rejected
      expect(screen.getByText('Locked')).toBeInTheDocument();
    });

    // Help text should appear
    expect(screen.getByText('Please unlock your MetaMask wallet to continue.')).toBeInTheDocument();
  });

  it('handles window.ethereum connection success (MetaMask is unlocked)', async () => {
    const mockRequest = vi.fn().mockResolvedValue(['0x123...']);
    window.ethereum = { request: mockRequest };

    render(<MetaMaskStatus showDetails={true} />);

    await waitFor(() => {
      expect(screen.getByText('Unlocked')).toBeInTheDocument();
    });

    // Ensure request was called with eth_accounts
    expect(mockRequest).toHaveBeenCalledWith({ method: 'eth_accounts' });
  });

  it('handles network switching successfully', async () => {
    const mockSwitchNetwork = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useWeb3).mockReturnValue({
      isConnected: true,
      chainId: '0x1',
      networkName: 'Mainnet',
      isCorrectNetwork: false,
      switchNetwork: mockSwitchNetwork,
    }  );

    const mockRequest = vi.fn().mockResolvedValue(['0x123...']);
    window.ethereum = { request: mockRequest };

    render(<MetaMaskStatus showDetails={true} />);

    await waitFor(() => {
      expect(screen.getByText('Wrong Network')).toBeInTheDocument();
    });

    const switchButton = screen.getAllByText('Switch')[0];
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(mockSwitchNetwork).toHaveBeenCalledWith('0xaa36a7');
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Network Switched',
        description: 'Successfully switched to Sepolia testnet.'
      }));
    });
  });

  it('handles network switching failures', async () => {
    const error = new Error('User rejected network switch');
    const mockSwitchNetwork = vi.fn().mockRejectedValue(error);
    vi.mocked(useWeb3).mockReturnValue({
      isConnected: true,
      chainId: '0x1',
      networkName: 'Mainnet',
      isCorrectNetwork: false,
      switchNetwork: mockSwitchNetwork,
    }  );

    const mockRequest = vi.fn().mockResolvedValue(['0x123...']);
    window.ethereum = { request: mockRequest };

    // Mock console.error to avoid test output noise
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(<MetaMaskStatus showDetails={true} />);

    await waitFor(() => {
      expect(screen.getByText('Wrong Network')).toBeInTheDocument();
    });

    const switchButton = screen.getAllByText('Switch')[0];
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(mockSwitchNetwork).toHaveBeenCalledWith('0xaa36a7');
      expect(console.error).toHaveBeenCalledWith('Failed to switch network:', error);
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Network Switch Failed',
        description: 'Could not switch to Sepolia testnet.',
        variant: 'destructive'
      }));
    });

    console.error = originalConsoleError;
  });
});

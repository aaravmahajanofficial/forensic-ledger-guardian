import { vi } from 'vitest';

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/services/ipfsService', () => ({
  default: {
    uploadFile: vi.fn(),
  },
}));

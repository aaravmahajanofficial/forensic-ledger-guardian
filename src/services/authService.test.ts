import { describe, it, expect } from 'vitest';
import { AuthService } from './authService';

describe('AuthService Singleton', () => {
  it('should return the exact same instance every time getInstance() is called', () => {
    const instance1 = AuthService.getInstance();
    const instance2 = AuthService.getInstance();

    expect(instance1).toBe(instance2);
  });
});

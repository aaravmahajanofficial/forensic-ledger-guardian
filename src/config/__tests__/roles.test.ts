import { describe, it, expect } from 'vitest';
import { getRoleConfig, ROLE_CONFIGS } from '../roles';
import { Role } from '@/services/web3Service';

describe('getRoleConfig', () => {
  it('returns the correct config for Role.Court', () => {
    const config = getRoleConfig(Role.Court);
    expect(config).toBe(ROLE_CONFIGS[Role.Court]);
    expect(config.id).toBe(Role.Court);
    expect(config.name).toBe('Court');
  });

  it('returns the correct config for Role.Officer', () => {
    const config = getRoleConfig(Role.Officer);
    expect(config).toBe(ROLE_CONFIGS[Role.Officer]);
    expect(config.id).toBe(Role.Officer);
  });

  it('returns the correct config for Role.Forensic', () => {
    const config = getRoleConfig(Role.Forensic);
    expect(config).toBe(ROLE_CONFIGS[Role.Forensic]);
    expect(config.id).toBe(Role.Forensic);
  });

  it('returns the correct config for Role.Lawyer', () => {
    const config = getRoleConfig(Role.Lawyer);
    expect(config).toBe(ROLE_CONFIGS[Role.Lawyer]);
    expect(config.id).toBe(Role.Lawyer);
  });

  it('returns the correct config for Role.None', () => {
    const config = getRoleConfig(Role.None);
    expect(config).toBe(ROLE_CONFIGS[Role.None]);
    expect(config.id).toBe(Role.None);
  });

  it('returns the default Role.None config for an invalid role', () => {
    // @ts-expect-error - Testing invalid role input
    const config = getRoleConfig(999 as Role);
    expect(config).toBe(ROLE_CONFIGS[Role.None]);
    expect(config.id).toBe(Role.None);
  });

  it('returns the default Role.None config for undefined', () => {
    // @ts-expect-error - Testing invalid role input
    const config = getRoleConfig(undefined as unknown as Role);
    expect(config).toBe(ROLE_CONFIGS[Role.None]);
    expect(config.id).toBe(Role.None);
  });
});

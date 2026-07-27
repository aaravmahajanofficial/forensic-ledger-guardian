import { jest } from '@jest/globals';
import request from 'supertest';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MASTER_PASSWORD = 'test_password_for_tests_that_is_long_enough';

// 1. Mock ethers
jest.unstable_mockModule('ethers', () => {
  return {
    ethers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
      Wallet: jest.fn().mockImplementation(() => ({
        address: '0xMockedWalletAddress'
      })),
      Contract: jest.fn().mockImplementation(() => {
        return {
          fileFIR: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({})
          }),
          submitFIREvidence: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({})
          }),
          createCaseFromFIR: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({})
          }),
          submitCaseEvidence: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({})
          }),
          confirmEvidence: jest.fn().mockResolvedValue({
            wait: jest.fn().mockResolvedValue({})
          }),
          getEvidenceById: jest.fn().mockResolvedValue({
            cid: 'QmMockCID',
            hashOriginal: 'mockhash'
          }),
          evidenceCount: jest.fn().mockResolvedValue({
            toString: () => '1'
          })
        };
      })
    }
  };
});

// 2. Mock supabase
const mockSupabaseQuery = {
  upsert: jest.fn().mockResolvedValue({ error: null }),
  insert: jest.fn().mockResolvedValue({ error: null }),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({ error: null }),
  select: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { filed_by: '0x123' }, error: null })
};

jest.unstable_mockModule('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn().mockImplementation(() => {
      return {
        from: jest.fn().mockReturnValue(mockSupabaseQuery)
      };
    })
  };
});


describe('POST /fir', () => {
  let app;

  beforeAll(async () => {
    // Dynamic import to ensure mocks are applied before module loading
    const module = await import('./backendfinal.js');
    app = module.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if firId, description, or location is missing', async () => {
    const res = await request(app)
      .post('/fir')
      .send({
        // missing firId, description, location
        incident: { title: 'Theft', type: 'Theft', description: 'Stolen laptop' },
        complainant: { name: 'John Doe', contactNumber: '1234567890' }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('firId, description, and location are required');
  });

  it('should return 400 if incident details are missing', async () => {
    const res = await request(app)
      .post('/fir')
      .send({
        firId: 'FIR-001',
        description: 'Test FIR',
        location: 'Test Location',
        // missing incident
        complainant: { name: 'John Doe', contactNumber: '1234567890' }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Incident details (title, type, description) are required');
  });

  it('should return 400 if incident title is missing', async () => {
    const res = await request(app)
      .post('/fir')
      .send({
        firId: 'FIR-001',
        description: 'Test FIR',
        location: 'Test Location',
        incident: { type: 'Theft', description: 'Stolen laptop' },
        complainant: { name: 'John Doe', contactNumber: '1234567890' }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Incident details (title, type, description) are required');
  });

  it('should return 400 if complainant details are missing', async () => {
    const res = await request(app)
      .post('/fir')
      .send({
        firId: 'FIR-001',
        description: 'Test FIR',
        location: 'Test Location',
        incident: { title: 'Theft', type: 'Theft', description: 'Stolen laptop' }
        // missing complainant
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Complainant name and contact number are required');
  });

  it('should successfully register FIR with valid data', async () => {
    const validData = {
      firId: 'FIR-001',
      description: 'A test description',
      location: 'Test City',
      incident: {
        title: 'Test Incident',
        type: 'Cybercrime',
        description: 'Detailed incident desc',
        date: '2023-01-01',
        time: '12:00',
        location: 'Test City'
      },
      complainant: {
        name: 'Jane Doe',
        contactNumber: '0987654321',
        organization: 'Test Org',
        email: 'jane@example.com'
      },
      suspect: {
        name: 'John Smith',
        type: 'Individual',
        additionalInfo: 'Wore a hat'
      },
      witnesses: [
        { name: 'Witness A', contact_info: '111-222', statement: 'I saw it' },
        { name: '', contact_info: '', statement: '' } // should be filtered out
      ]
    };

    const res = await request(app).post('/fir').send(validData);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('FIR filed successfully');
    expect(res.body.firId).toBe('FIR-001');
    expect(res.body.storedData.fir).toBe(true);
    expect(res.body.storedData.complainant).toBe(true);
    expect(res.body.storedData.suspect).toBe(true);
    expect(res.body.storedData.witnesses).toBe(1); // One valid witness

    // Verify Supabase calls
    expect(mockSupabaseQuery.upsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fir_id: 'FIR-001',
          title: 'Test Incident',
          status: 'pending'
        })
      ]),
      expect.objectContaining({ onConflict: ['fir_id'] })
    );

    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fir_id: 'FIR-001',
          name: 'Jane Doe'
        })
      ])
    );

    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fir_id: 'FIR-001',
          name: 'John Smith'
        })
      ]),
      expect.objectContaining({ onConflict: ['fir_id'] })
    );

    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fir_id: 'FIR-001',
          name: 'Witness A'
        })
      ])
    );
  });
});

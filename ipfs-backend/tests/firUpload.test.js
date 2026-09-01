
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock a lot of stuff because the route has many side effects.

// Mock crypto methods used inside the handler
vi.mock("crypto", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      randomBytes: vi.fn(() => Buffer.from("0123456789abcdef0123456789abcdef")),
      randomUUID: vi.fn(() => "mock-uuid-1234"),
      createCipheriv: vi.fn(() => ({
        update: vi.fn((buf) => buf),
        final: vi.fn(() => Buffer.from("")),
      })),
      createHash: vi.fn(() => ({
        update: vi.fn(() => ({
          digest: vi.fn(() => "mock-hash")
        }))
      })),
      pbkdf2Sync: vi.fn(() => Buffer.from("0123456789abcdef0123456789abcdef"))
    }
  }
});

// Mock external services
vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn().mockResolvedValue({ data: { IpfsHash: "mock-cid-456" } }),
      get: vi.fn()
    }
  }
});

let submitFIREvidenceMock = vi.fn().mockResolvedValue({
  wait: vi.fn().mockResolvedValue(true)
});

// We need to mock ethers and supabase which are imported and instantiated at the top level of backendfinal.js.
// Since backendfinal.js runs immediately, we have to mock the modules themselves.
vi.mock("ethers", () => {
  class MockJsonRpcProvider {}
  class MockWallet { address = "0x123" }
  class MockContract {
    submitFIREvidence = (...args) => submitFIREvidenceMock(...args);
  }

  return {
    ethers: {
      JsonRpcProvider: MockJsonRpcProvider,
      Wallet: MockWallet,
      Contract: MockContract
    }
  }
});

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }
});

import app from "../backendfinal.js";

describe("POST /fir/:firId/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    submitFIREvidenceMock = vi.fn().mockResolvedValue({
      wait: vi.fn().mockResolvedValue(true)
    });
  });

  it("should fail if no evidenceType is provided", async () => {
    const res = await request(app)
      .post("/fir/FIR-123/upload")
      .attach("file", Buffer.from("test file"), "test.jpg");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid evidenceType" });
  });

  it("should fail if missing file", async () => {
    const res = await request(app)
      .post("/fir/FIR-123/upload")
      .field("evidenceType", "Image");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing required data" });
  });

  it("should upload and submit evidence successfully", async () => {
    const res = await request(app)
      .post("/fir/FIR-123/upload")
      .field("evidenceType", "Image")
      .attach("file", Buffer.from("dummy image content"), {
        filename: "test.jpg",
        contentType: "image/jpeg"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: "FIR evidence uploaded and recorded on-chain",
      cid: "mock-cid-456",
      filename: "test.jpg"
    }));
  });

  it("should handle error in 500 block during execution", async () => {
    submitFIREvidenceMock = vi.fn().mockRejectedValue(new Error("Blockchain reverted"));
    const res = await request(app)
      .post("/fir/FIR-123/upload")
      .field("evidenceType", "Image")
      .attach("file", Buffer.from("dummy image content"), {
        filename: "test.jpg",
        contentType: "image/jpeg"
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Blockchain reverted" });
  });
});

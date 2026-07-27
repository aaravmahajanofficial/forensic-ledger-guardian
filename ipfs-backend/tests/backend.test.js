import request from "supertest";
import app from "../backendfinal.js";

import { jest } from '@jest/globals';

describe("Express Error Handling & Validation Tests", () => {
  // Test global error handling
  it("should return a 500 error when an unhandled exception occurs", async () => {
    // We expect the console.error to fire, so we can mock it to keep test output clean
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app).get("/test-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Something broke!" });

    consoleSpy.mockRestore();
  });

  // Test FIR creation validation failures
  it("should return 400 when required fields are missing on POST /fir", async () => {
    const payload = {
      // Intentionally missing firId, description, and location
      incident: {
        title: "Test Incident",
        type: "Theft",
        description: "Test description"
      },
      complainant: {
        name: "John Doe",
        contactNumber: "1234567890"
      }
    };

    const response = await request(app).post("/fir").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "firId, description, and location are required"
    });
  });

  it("should return 400 when incident details are missing on POST /fir", async () => {
    const payload = {
      firId: "FIR123",
      description: "A test FIR",
      location: { lat: 10, lng: 20 },
      // Intentionally missing incident details
      complainant: {
        name: "John Doe",
        contactNumber: "1234567890"
      }
    };

    const response = await request(app).post("/fir").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Incident details (title, type, description) are required"
    });
  });

  it("should return 400 when complainant details are missing on POST /fir", async () => {
    const payload = {
      firId: "FIR123",
      description: "A test FIR",
      location: { lat: 10, lng: 20 },
      incident: {
        title: "Test Incident",
        type: "Theft",
        description: "Test description"
      }
      // Intentionally missing complainant details
    };

    const response = await request(app).post("/fir").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Complainant name and contact number are required"
    });
  });
});

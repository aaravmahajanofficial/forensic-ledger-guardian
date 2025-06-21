/**
 * Mock Data Service
 * Provides mock data for development and testing
 * This file should not be included in production builds
 */

import { config } from "@/config";
import { ROLES } from "@/constants";
import { User } from "@/types";

// Development-only mock users
export const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "court@example.com",
    password: "court123",
    name: "Judge Smith",
    role: ROLES.COURT,
    roleTitle: "Court Judge",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    status: "active",
    added: "2023-04-10T08:00:00Z",
    caseCount: 2,
  },
  {
    id: "2",
    email: "officer@example.com",
    password: "officer123",
    name: "Officer Johnson",
    role: ROLES.OFFICER,
    roleTitle: "Police Officer",
    address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    status: "active",
    added: "2023-04-10T08:05:00Z",
    caseCount: 2,
  },
  {
    id: "3",
    email: "forensic@example.com",
    password: "forensic123",
    name: "Dr. Anderson",
    role: ROLES.FORENSIC,
    roleTitle: "Forensic Investigator",
    address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    status: "active",
    added: "2023-04-10T08:10:00Z",
    caseCount: 1,
  },
  {
    id: "4",
    email: "lawyer@example.com",
    password: "lawyer123",
    name: "Attorney Davis",
    role: ROLES.LAWYER,
    roleTitle: "Defense Attorney",
    address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    status: "active",
    added: "2023-04-10T08:15:00Z",
    caseCount: 0,
  },
];

// Mock evidence data
export const mockEvidence = [
  {
    id: "EV-2023-001",
    name: "security_footage.mp4",
    type: "video",
    mimeType: "video/mp4",
    caseId: "FF-2023-089",
    submittedBy: "officer@example.com",
    submittedDate: "2023-04-15T10:30:00Z",
    size: 25600000,
    verified: true,
    status: "verified" as const,
    hash: "0x1234567890abcdef",
    ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    blockchainTxHash:
      "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    chainOfCustody: [
      {
        id: "COC-001",
        action: "created" as const,
        timestamp: "2023-04-15T10:30:00Z",
        userId: "officer@example.com",
        userName: "Officer Johnson",
        userRole: "Police Officer",
        details: "Evidence uploaded to system",
      },
    ],
  },
  {
    id: "EV-2023-002",
    name: "fingerprint_analysis.pdf",
    type: "document",
    mimeType: "application/pdf",
    caseId: "FF-2023-089",
    submittedBy: "forensic@example.com",
    submittedDate: "2023-04-16T14:20:00Z",
    size: 1024000,
    verified: true,
    status: "verified" as const,
    hash: "0xabcdef1234567890",
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    blockchainTxHash:
      "0xdef4567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    chainOfCustody: [
      {
        id: "COC-002",
        action: "created" as const,
        timestamp: "2023-04-16T14:20:00Z",
        userId: "forensic@example.com",
        userName: "Dr. Anderson",
        userRole: "Forensic Investigator",
        details: "Forensic analysis document uploaded",
      },
    ],
  },
];

// Mock cases data
export const mockCases = [
  {
    id: "FF-2023-089",
    title: "Tech Corp Data Breach Investigation",
    description: "Investigation into unauthorized access to corporate database",
    status: "active",
    priority: "high",
    createdAt: "2023-04-10T09:00:00Z",
    createdBy: "court@example.com",
    assignedTo: ["officer@example.com", "forensic@example.com"],
    evidenceCount: 2,
  },
  {
    id: "FF-2023-090",
    title: "Financial Fraud Case",
    description: "Investigation of suspected financial fraud activities",
    status: "pending",
    priority: "medium",
    createdAt: "2023-04-12T11:30:00Z",
    createdBy: "court@example.com",
    assignedTo: ["officer@example.com"],
    evidenceCount: 0,
  },
];

// Mock activity logs
export const mockActivityLogs = [
  {
    id: "1",
    action: "User Login",
    description: "User officer@example.com logged in successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    userId: "2",
    userName: "Officer Johnson",
    severity: "info",
    category: "authentication",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    action: "Evidence Upload",
    description: "New evidence uploaded for case FF-2023-089",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: "3",
    userName: "Dr. Anderson",
    severity: "info",
    category: "evidence",
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    action: "Failed Login Attempt",
    description:
      "Failed login attempt for account emily.chen@forensics.gov from 203.45.67.89",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    userId: null,
    userName: "Unknown",
    severity: "warning",
    category: "security",
    ipAddress: "203.45.67.89",
  },
];

// Guard function to prevent loading in production
export function ensureMockDataAllowed(): void {
  if (!config.features.mockAuth && !config.app.debugMode) {
    throw new Error("Mock data is not allowed in production environment");
  }
}

// Mock authentication service
export class MockAuthService {
  static async authenticate(
    email: string,
    password: string
  ): Promise<User | null> {
    ensureMockDataAllowed();

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return null;

    // Remove password from returned user object
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async validateSession(token: string): Promise<User | null> {
    ensureMockDataAllowed();

    // Simple token validation for development
    // In production, this would validate JWT tokens
    try {
      const payload = JSON.parse(atob(token));
      return mockUsers.find((u) => u.id === payload.userId) || null;
    } catch {
      return null;
    }
  }

  static generateMockToken(userId: string): string {
    ensureMockDataAllowed();

    const payload = {
      userId,
      exp: Date.now() + config.security.sessionTimeout,
    };

    // Simple base64 encoding for development
    // In production, use proper JWT signing
    return btoa(JSON.stringify(payload));
  }
}

// Warning message for development
if (config.app.debugMode) {
  console.warn(
    "🚨 Mock data service is active. This should not be used in production!"
  );
}

export const mockDataService = {
  getEvidenceForCase: (caseId: string) => {
    return mockEvidence.filter(
      (evidence) => !caseId || evidence.caseId === caseId
    );
  },

  getAllEvidence: () => mockEvidence,

  getCaseById: (caseId: string) => {
    return mockCases.find((c) => c.id === caseId);
  },

  getAllCases: () => mockCases,

  getActivityLogs: () => mockActivityLogs,

  getUserById: (userId: string) => {
    return mockUsers.find((u) => u.id === userId);
  },

  getAllUsers: () => mockUsers,
};

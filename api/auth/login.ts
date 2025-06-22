import { VercelRequest, VercelResponse } from "@vercel/node";

// Mock users data (same as your existing mock data)
const mockUsers = [
  {
    id: "1",
    email: "court@example.com",
    password: "court123",
    name: "Judge Smith",
    role: "court",
    roleTitle: "Court Administrator",
    address: "0x742d35Cc6634C0532925a3b8D87C96EFCC6c2B67",
    status: "active",
    added: "2023-04-10T08:00:00Z",
    caseCount: 3,
    permissions: ["read_cases", "write_cases", "manage_users", "court_access"],
  },
  {
    id: "2",
    email: "officer@example.com",
    password: "officer123",
    name: "Officer Johnson",
    role: "officer",
    roleTitle: "Police Officer",
    address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    status: "active",
    added: "2023-04-10T08:05:00Z",
    caseCount: 2,
    permissions: ["read_cases", "write_evidence", "officer_access"],
  },
  {
    id: "3",
    email: "forensic@example.com",
    password: "forensic123",
    name: "Dr. Anderson",
    role: "forensic",
    roleTitle: "Forensic Investigator",
    address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    status: "active",
    added: "2023-04-10T08:10:00Z",
    caseCount: 1,
    permissions: [
      "read_cases",
      "write_evidence",
      "forensic_analysis",
      "forensic_access",
    ],
  },
  {
    id: "4",
    email: "lawyer@example.com",
    password: "lawyer123",
    name: "Attorney Davis",
    role: "lawyer",
    roleTitle: "Defense Attorney",
    address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    status: "active",
    added: "2023-04-10T08:15:00Z",
    caseCount: 2,
    permissions: ["read_cases", "read_evidence", "lawyer_access"],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate a simple token (in production, use proper JWT)
    const token = `token_${user.id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      user: {
        ...userWithoutPassword,
        createdAt: new Date(user.added),
        lastLoginAt: new Date(),
      },
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

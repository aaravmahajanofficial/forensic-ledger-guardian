/**
 * ABI for the Role Manager Smart Contract
 *
 * This would normally be generated from the actual smart contract compilation
 *
 * @module Services/Contracts/RoleManagerABI
 */

const ROLE_MANAGER_ABI = [
  // Role Management
  {
    inputs: [
      { name: "_address", type: "address" },
      { name: "_role", type: "uint8" },
    ],
    name: "assignRole",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_address", type: "address" }],
    name: "getUserRole",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_address", type: "address" },
      { name: "_requiredRole", type: "uint8" },
    ],
    name: "hasRole",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_address", type: "address" }],
    name: "revokeRole",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Case Access Control
  {
    inputs: [
      { name: "_caseId", type: "string" },
      { name: "_address", type: "address" },
    ],
    name: "grantCaseAccess",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_caseId", type: "string" },
      { name: "_address", type: "address" },
    ],
    name: "revokeCaseAccess",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_caseId", type: "string" },
      { name: "_address", type: "address" },
    ],
    name: "hasCaseAccess",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: true, name: "role", type: "uint8" },
      { indexed: false, name: "assignedBy", type: "address" },
    ],
    name: "RoleAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "revokedBy", type: "address" },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "caseId", type: "string" },
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "grantedBy", type: "address" },
    ],
    name: "CaseAccessGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "caseId", type: "string" },
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "revokedBy", type: "address" },
    ],
    name: "CaseAccessRevoked",
    type: "event",
  },
];

export default ROLE_MANAGER_ABI;

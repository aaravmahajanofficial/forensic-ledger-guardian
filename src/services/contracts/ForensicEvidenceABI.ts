/**
 * ABI for the Forensic Evidence Smart Contract
 *
 * This would normally be generated from the actual smart contract compilation
 *
 * @module Services/Contracts/ForensicEvidenceABI
 */

const CONTRACT_ABI = [
  // Evidence Management
  {
    inputs: [
      { name: "_cid", type: "string" },
      { name: "_hash", type: "string" },
      { name: "_description", type: "string" },
      { name: "_caseId", type: "string" },
    ],
    name: "uploadEvidence",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_evidenceId", type: "uint256" }],
    name: "getEvidence",
    outputs: [
      { name: "cid", type: "string" },
      { name: "hash", type: "string" },
      { name: "description", type: "string" },
      { name: "caseId", type: "string" },
      { name: "uploader", type: "address" },
      { name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // FIR Management
  {
    inputs: [
      { name: "_firNumber", type: "string" },
      { name: "_description", type: "string" },
      { name: "_location", type: "string" },
    ],
    name: "fileFIR",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Case Management
  {
    inputs: [
      { name: "_caseNumber", type: "string" },
      { name: "_description", type: "string" },
      { name: "_investigator", type: "address" },
    ],
    name: "createCase",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_caseId", type: "string" }],
    name: "getCaseDetails",
    outputs: [
      { name: "caseNumber", type: "string" },
      { name: "description", type: "string" },
      { name: "investigator", type: "address" },
      { name: "createdAt", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Chain of Custody
  {
    inputs: [
      { name: "_evidenceId", type: "uint256" },
      { name: "_recipient", type: "address" },
      { name: "_notes", type: "string" },
    ],
    name: "transferCustody",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_evidenceId", type: "uint256" }],
    name: "getCustodyHistory",
    outputs: [
      { name: "custodians", type: "address[]" },
      { name: "timestamps", type: "uint256[]" },
      { name: "notes", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "evidenceId", type: "uint256" },
      { indexed: true, name: "uploader", type: "address" },
      { indexed: false, name: "cid", type: "string" },
    ],
    name: "EvidenceUploaded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "caseId", type: "string" },
      { indexed: true, name: "creator", type: "address" },
    ],
    name: "CaseCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "evidenceId", type: "uint256" },
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
    ],
    name: "CustodyTransferred",
    type: "event",
  },
];

export default CONTRACT_ABI;

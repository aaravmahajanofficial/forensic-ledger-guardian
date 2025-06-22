import { CaseData } from "@/types/case";

export const caseData: CaseData = {
  id: "FF-2023-123",
  title: "State vs. John Doe",
  status: "active",
  dateCreated: "2023-04-15T10:00:00Z",
  courtDate: "2023-10-10T09:00:00Z",
  filingOfficer: "Officer James Wilson",
  assignedJudge: "Hon. Sarah Mitchell",
  description:
    "Case involving alleged theft of digital assets worth approximately $75,000 from a cryptocurrency exchange.",
  parties: [
    { name: "John Doe", role: "Defendant" },
    { name: "State", role: "Prosecutor" },
  ],
  evidenceItems: [
    {
      id: "EV-2023-001",
      name: "Transaction Log",
      type: "Digital",
      status: "verified",
      dateAdded: "2023-04-15T11:30:00Z",
      fileHash: "0xabc123...",
      ipfsHash: "QmXyz789...",
    },
    {
      id: "EV-2023-002",
      name: "Access Records",
      type: "Digital",
      status: "verified",
      dateAdded: "2023-04-16T14:00:00Z",
      fileHash: "0xdef456...",
      ipfsHash: "QmAbc456...",
    },
    {
      id: "EV-2023-003",
      name: "Email Correspondence",
      type: "Document",
      status: "pending",
      dateAdded: "2023-04-17T09:15:00Z",
      fileHash: "0xghi789...",
      ipfsHash: "QmDef789...",
    },
  ],
  timeline: [
    {
      date: "2023-04-12T09:00:00Z",
      event: "Case Filed",
      actor: "Officer James Wilson",
    },
    {
      date: "2023-04-15T11:35:00Z",
      event: "Evidence Added",
      actor: "Forensic Tech Sarah Johnson",
    },
    {
      date: "2023-04-20T16:00:00Z",
      event: "Evidence Verified",
      actor: "Blockchain System",
    },
    {
      date: "2023-05-05T10:00:00Z",
      event: "Hearing Scheduled",
      actor: "Court Admin",
    },
  ],
  tags: ["digital theft", "cryptocurrency", "fraud"],
};

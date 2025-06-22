export type CaseStatus = "active" | "closed" | "pending";
export type EvidenceStatus = "verified" | "pending" | "rejected";

export interface Party {
  name: string;
  role: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  status: EvidenceStatus;
  dateAdded: string;
  fileHash: string;
  ipfsHash: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  actor: string;
}

export interface CaseData {
  id: string;
  title: string;
  status: CaseStatus;
  dateCreated: string;
  courtDate?: string;
  filingOfficer: string;
  assignedJudge?: string;
  description: string;
  parties: Party[];
  evidenceItems: EvidenceItem[];
  timeline: TimelineEvent[];
  tags?: string[];
}

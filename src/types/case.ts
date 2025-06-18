export interface Party {
  name: string;
  role: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  actor: string;
}

export interface CaseData {
  id: string;
  title: string;
  status: string;
  dateCreated: string;
  courtDate: string;
  filingOfficer: string;
  assignedJudge: string;
  description: string;
  evidenceCount: number;
  parties: Party[];
  evidenceItems: EvidenceItem[];
  timeline: TimelineEvent[];
}

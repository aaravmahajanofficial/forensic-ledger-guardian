import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import {
  ChecklistItem,
  EvidenceItem,
  DocumentItem,
} from "./CourtPreparationActions";

// Mock case data
export const caseData = {
  id: "FF-2023-076",
  title: "Tech Corp Data Breach",
  status: "active",
  courtDate: "2025-05-15T10:00:00Z",
  client: "Marcus Turner",
  venue: "District Court, Cybercrime Division",
  judge: "Hon. Elizabeth Wright",
  opposing: "State Prosecutor Davis",
};

// Mock evidence items
export const initialEvidenceItems: EvidenceItem[] = [
  {
    id: "EV-2023-380",
    name: "Email Thread Export",
    type: "email",
    status: "verified",
    added: "2025-04-01T08:15:00Z",
    prepared: true,
  },
  {
    id: "EV-2023-381",
    name: "Server Access Logs",
    type: "log",
    status: "verified",
    added: "2025-04-02T14:30:00Z",
    prepared: true,
  },
  {
    id: "EV-2023-382",
    name: "Digital Forensic Report",
    type: "report",
    status: "verified",
    added: "2025-04-03T11:45:00Z",
    prepared: true,
  },
  {
    id: "EV-2023-383",
    name: "Security Camera Footage",
    type: "video",
    status: "verified",
    added: "2025-04-05T09:20:00Z",
    prepared: false,
  },
];

// Mock prepared documents
export const initialDocuments: DocumentItem[] = [
  {
    id: "DOC-001",
    title: "Defense Strategy Brief",
    type: "brief",
    created: "2025-04-08T11:30:00Z",
    status: "completed",
  },
  {
    id: "DOC-002",
    title: "Evidence Examination Report",
    type: "report",
    created: "2025-04-07T16:45:00Z",
    status: "completed",
  },
  {
    id: "DOC-004",
    title: "Motion to Suppress Evidence",
    type: "motion",
    created: "2025-04-04T15:00:00Z",
    status: "filed",
  },
  {
    id: "DOC-006",
    title: "Opening Statement Draft",
    type: "statement",
    created: "2025-04-09T13:15:00Z",
    status: "draft",
  },
];

// Mock checklist items
export const initialChecklistItems: ChecklistItem[] = [
  {
    id: "CL-001",
    task: "Review all case evidence",
    completed: true,
    dueDate: "2025-04-10T17:00:00Z",
  },
  {
    id: "CL-002",
    task: "Prepare client for testimony",
    completed: false,
    dueDate: "2025-05-01T17:00:00Z",
  },
  {
    id: "CL-003",
    task: "File motion to suppress evidence",
    completed: true,
    dueDate: "2025-04-08T17:00:00Z",
  },
  {
    id: "CL-004",
    task: "Interview witness John Smith",
    completed: false,
    dueDate: "2025-04-18T15:30:00Z",
  },
  {
    id: "CL-005",
    task: "Prepare cross-examination questions",
    completed: false,
    dueDate: "2025-04-25T17:00:00Z",
  },
  {
    id: "CL-006",
    task: "Finalize opening statement",
    completed: false,
    dueDate: "2025-05-10T17:00:00Z",
  },
];

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-forensic-success/20 text-forensic-success">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    case "draft":
      return (
        <Badge className="bg-forensic-400/20 text-forensic-600">Draft</Badge>
      );
    case "completed":
      return (
        <Badge className="bg-forensic-accent/20 text-forensic-accent">
          Completed
        </Badge>
      );
    case "filed":
      return (
        <Badge className="bg-forensic-court/20 text-forensic-court">
          Filed
        </Badge>
      );
    default:
      return (
        <Badge className="bg-forensic-300 text-forensic-600">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
};

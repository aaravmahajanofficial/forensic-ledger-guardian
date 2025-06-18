import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gavel } from "lucide-react";

// Import the new component parts
import CourtPreparationOverview from "@/components/lawyer/CourtPreparationOverview";
import CourtPreparationChecklist, {
  type ChecklistItem,
} from "@/components/lawyer/CourtPreparationChecklist";
import CourtPreparationEvidence, {
  type EvidenceItem,
} from "@/components/lawyer/CourtPreparationEvidence";
import CourtPreparationDocuments, {
  type DocumentItem,
} from "@/components/lawyer/CourtPreparationDocuments";

// Mock data - would normally come from props or API
const caseData = {
  id: "FF-2023-089",
  title: "Tech Corp Data Breach Investigation",
  status: "Preparation",
  hearingDate: "2024-02-15",
  judge: "Hon. Sarah Mitchell",
  courtroom: "Court Room 3A",
  prepProgress: 75,
};

const initialChecklistItems: ChecklistItem[] = [
  {
    id: "1",
    task: "Review all digital evidence files",
    completed: true,
    dueDate: "2024-01-10",
    priority: "high",
  },
  {
    id: "2",
    task: "Prepare witness statements",
    completed: false,
    dueDate: "2024-01-15",
    priority: "high",
  },
  {
    id: "3",
    task: "Draft opening arguments",
    completed: true,
    priority: "medium",
  },
  {
    id: "4",
    task: "Organize chain of custody documentation",
    completed: false,
    dueDate: "2024-01-12",
    priority: "high",
  },
];

const initialEvidenceItems: EvidenceItem[] = [
  {
    id: "ev1",
    name: "Server Access Logs",
    type: "Digital",
    status: "verified",
    hash: "0xa1b2c3...",
    timestamp: "2024-01-05 14:30",
    size: "2.3 MB",
    relevance: "high",
  },
  {
    id: "ev2",
    name: "Email Communications",
    type: "Digital",
    status: "verified",
    hash: "0xd4e5f6...",
    timestamp: "2024-01-06 09:15",
    size: "1.8 MB",
    relevance: "high",
  },
  {
    id: "ev3",
    name: "Network Traffic Analysis",
    type: "Digital",
    status: "pending",
    hash: "0xg7h8i9...",
    timestamp: "2024-01-07 11:45",
    size: "5.2 MB",
    relevance: "medium",
  },
];

const initialDocuments: DocumentItem[] = [
  {
    id: "doc1",
    name: "Case Brief - Tech Corp Breach",
    type: "Brief",
    status: "review",
    lastModified: "2024-01-08",
    size: "450 KB",
    author: "Sarah Johnson",
  },
  {
    id: "doc2",
    name: "Motion to Admit Digital Evidence",
    type: "Motion",
    status: "draft",
    lastModified: "2024-01-09",
    size: "320 KB",
    author: "Sarah Johnson",
  },
  {
    id: "doc3",
    name: "Expert Witness Report",
    type: "Exhibit",
    status: "final",
    lastModified: "2024-01-07",
    size: "1.2 MB",
    author: "Dr. Michael Chen",
  },
];

const CourtPreparation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialChecklistItems
  );

  const daysUntilCourt = Math.ceil(
    (new Date(caseData.hearingDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-forensic-800 mb-1">
            Court Preparation
          </h1>
          <p className="text-sm text-forensic-600">
            Prepare case materials and evidence for court proceedings
          </p>
        </div>
        <Badge className="text-lg px-3 py-2 bg-forensic-court text-white">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{daysUntilCourt} Days Until Court</span>
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            Checklist
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            Evidence
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CourtPreparationOverview caseData={caseData} />
        </TabsContent>

        <TabsContent value="checklist">
          <CourtPreparationChecklist
            checklist={checklist}
            onUpdateChecklist={setChecklist}
          />
        </TabsContent>

        <TabsContent value="evidence">
          <CourtPreparationEvidence evidence={initialEvidenceItems} />
        </TabsContent>

        <TabsContent value="documents">
          <CourtPreparationDocuments documents={initialDocuments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourtPreparation;

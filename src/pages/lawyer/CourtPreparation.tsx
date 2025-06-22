import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gavel, ClipboardList, ShieldCheck, FileText } from "lucide-react";
import CourtPreparationOverview from "@/components/lawyer/CourtPreparationOverview";
import CourtPreparationChecklist, { type ChecklistItem } from "@/components/lawyer/CourtPreparationChecklist";
import CourtPreparationEvidence, { type EvidenceItem } from "@/components/lawyer/CourtPreparationEvidence";
import CourtPreparationDocuments, { type DocumentItem } from "@/components/lawyer/CourtPreparationDocuments";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - would normally come from props or API
const caseData = {
  caseNumber: "FF-2023-089",
  title: "Tech Corp Data Breach Investigation",
  status: "In Progress" as "In Progress" | "Ready" | "Pending",
  hearingDate: "2024-02-15",
  judge: "Hon. Sarah Mitchell",
  courtroom: "Court Room 3A",
  prepProgress: 75,
  stats: {
    readyItems: 2,
    pendingItems: 2,
    witnesses: 1,
    documents: 3,
  },
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
    hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    timestamp: "2024-01-05 14:30",
    size: "2.3 MB",
    relevance: "high",
  },
  {
    id: "ev2",
    name: "Email Communications",
    type: "Digital",
    status: "verified",
    hash: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
    timestamp: "2024-01-06 09:15",
    size: "1.8 MB",
    relevance: "high",
  },
  {
    id: "ev3",
    name: "Network Traffic Analysis",
    type: "Digital",
    status: "pending",
    hash: "0xg7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8",
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
    author: { name: "Sarah Johnson", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  },
  {
    id: "doc2",
    name: "Motion to Admit Digital Evidence",
    type: "Motion",
    status: "draft",
    lastModified: "2024-01-09",
    size: "320 KB",
    author: { name: "Sarah Johnson", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  },
  {
    id: "doc3",
    name: "Expert Witness Report",
    type: "Exhibit",
    status: "final",
    lastModified: "2024-01-07",
    size: "1.2 MB",
    author: { name: "Dr. Michael Chen", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
  },
];

const CourtPreparation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistItems);

  const daysUntilCourt = Math.ceil(
    (new Date(caseData.hearingDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-foreground font-sans">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Court Preparation
          </h1>
          <p className="text-muted-foreground mt-1">
            Case {caseData.caseNumber}: {caseData.title}
          </p>
        </div>
        <Badge variant="default" className="text-sm font-medium mt-4 sm:mt-0 self-start">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{daysUntilCourt} Days Until Court</span>
        </Badge>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-lg p-1 bg-muted mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gavel className="h-5 w-5" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ClipboardList className="h-5 w-5" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
            <span className="hidden sm:inline">Evidence</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-5 w-5" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        <Card className="bg-card border-border/40 shadow-sm">
          <CardContent className="p-0">
            <TabsContent value="overview" className="animate-fade-in p-4 sm:p-6">
              <CourtPreparationOverview caseData={caseData} />
            </TabsContent>

            <TabsContent value="checklist" className="animate-fade-in p-4 sm:p-6">
              <CourtPreparationChecklist
                checklist={checklist}
                onUpdateChecklist={setChecklist}
              />
            </TabsContent>

            <TabsContent value="evidence" className="animate-fade-in p-4 sm:p-6">
              <CourtPreparationEvidence evidence={initialEvidenceItems} />
            </TabsContent>

            <TabsContent value="documents" className="animate-fade-in p-4 sm:p-6">
              <CourtPreparationDocuments documents={initialDocuments} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CourtPreparation;

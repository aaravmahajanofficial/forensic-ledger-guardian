import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Gavel,
  FileCheck,
  ListChecks,
  Calendar,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  Download,
  Presentation,
  FileDigit,
  Play,
  UploadCloud,
  Copy,
  CheckSquare,
  Square,
  Plus,
  CalendarIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCourtPreparationActions,
  ChecklistItem,
  EvidenceItem,
  DocumentItem,
} from "@/components/court/CourtPreparationActions";

// Mock case data
const caseData = {
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
const initialEvidenceItems: EvidenceItem[] = [
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
const initialDocuments: DocumentItem[] = [
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
const initialChecklistItems: ChecklistItem[] = [
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

const getStatusBadge = (status: string) => {
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

const CourtPreparation = () => {
  const { user } = useAuth();
  const actions = useCourtPreparationActions();

  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialChecklistItems
  );
  const [evidenceItems, setEvidenceItems] =
    useState<EvidenceItem[]>(initialEvidenceItems);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);

  // Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  // Calculate preparation progress
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((item) => item.completed).length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  const daysUntilCourt = Math.ceil(
    (new Date(caseData.courtDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleAddTask = () => {
    if (!newTask.trim() || !taskDueDate) return;

    actions.addChecklistItem(
      checklist,
      setChecklist,
      newTask,
      new Date(taskDueDate).toISOString()
    );

    // Reset form and close dialog
    setNewTask("");
    setTaskDueDate("");
    setTaskDialogOpen(false);
  };

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

      {/* Case Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Gavel className="h-5 w-5 mr-2 text-forensic-court" />
                Case {caseData.id}: {caseData.title}
              </CardTitle>
              <CardDescription>
                Court Date: {new Date(caseData.courtDate).toLocaleDateString()}{" "}
                at{" "}
                {new Date(caseData.courtDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </div>
            <Badge className="bg-forensic-accent px-3 py-1">
              {caseData.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Client:</span>
                <span className="font-medium">{caseData.client}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Court Venue:</span>
                <span className="font-medium">{caseData.venue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Judge:</span>
                <span className="font-medium">{caseData.judge}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Opposing Counsel:</span>
                <span className="font-medium">{caseData.opposing}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Evidence Items:</span>
                <span className="font-medium">
                  {evidenceItems.length} items
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-forensic-500">Preparation Progress:</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Case preparation progress</span>
              <span>
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Gavel className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <FileDigit className="h-4 w-4" />
            <span>Evidence</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span>Checklist</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileDigit className="h-5 w-5 mr-2 text-forensic-accent" />
                  Evidence Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-forensic-500">
                        Total Evidence Items
                      </p>
                      <p className="text-2xl font-bold text-forensic-800">
                        {evidenceItems.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">
                        Prepared for Court
                      </p>
                      <p className="text-2xl font-bold text-forensic-success">
                        {evidenceItems.filter((e) => e.prepared).length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Court preparation</span>
                      <span>
                        {evidenceItems.filter((e) => e.prepared).length} of{" "}
                        {evidenceItems.length} ready
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (evidenceItems.filter((e) => e.prepared).length /
                          evidenceItems.length) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-accent hover:bg-forensic-accent/90"
                  onClick={() => setActiveTab("evidence")}
                >
                  Manage Evidence
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-forensic-court" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-forensic-500">
                        Total Documents
                      </p>
                      <p className="text-2xl font-bold text-forensic-800">
                        {documents.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Completed</p>
                      <p className="text-2xl font-bold text-forensic-success">
                        {
                          documents.filter(
                            (d) =>
                              d.status === "completed" || d.status === "filed"
                          ).length
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Document completion</span>
                      <span>
                        {
                          documents.filter(
                            (d) =>
                              d.status === "completed" || d.status === "filed"
                          ).length
                        }{" "}
                        of {documents.length} completed
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (documents.filter(
                          (d) =>
                            d.status === "completed" || d.status === "filed"
                        ).length /
                          documents.length) *
                          100
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-court hover:bg-forensic-court/90"
                  onClick={() => setActiveTab("documents")}
                >
                  Manage Documents
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-forensic-warning" />
                  Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-forensic-500">Total Tasks</p>
                      <p className="text-2xl font-bold text-forensic-800">
                        {checklist.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-forensic-500">Completed</p>
                      <p className="text-2xl font-bold text-forensic-success">
                        {checklist.filter((i) => i.completed).length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Checklist progress</span>
                      <span>
                        {completedTasks} of {totalTasks} completed
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                  onClick={() => setActiveTab("checklist")}
                >
                  View Checklist
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-forensic-court" />
                Upcoming Court Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-forensic-200 pl-6 py-2 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-success"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Motion Filing Deadline</h4>
                      <Badge className="bg-forensic-success text-white">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-forensic-600 mb-1">
                      April 10, 2025
                    </p>
                    <p className="text-sm">
                      All pretrial motions have been filed with the court.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-warning"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        Evidence Submission Deadline
                      </h4>
                      <Badge className="bg-forensic-warning text-forensic-900">
                        Upcoming
                      </Badge>
                    </div>
                    <p className="text-sm text-forensic-600 mb-1">
                      April 25, 2025
                    </p>
                    <p className="text-sm">
                      All evidence must be submitted to the court and shared
                      with opposing counsel.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-400"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Pre-Trial Conference</h4>
                    </div>
                    <p className="text-sm text-forensic-600 mb-1">
                      May 5, 2025
                    </p>
                    <p className="text-sm">
                      Final pre-trial meeting with judge and opposing counsel.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-court"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Court Date</h4>
                      <Badge className="bg-forensic-court text-white">
                        Trial
                      </Badge>
                    </div>
                    <p className="text-sm text-forensic-600 mb-1">
                      May 15, 2025
                    </p>
                    <p className="text-sm">
                      District Court, Cybercrime Division - 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Preparation</CardTitle>
              <CardDescription>
                Prepare and organize verified evidence for court presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evidence ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added Date</TableHead>
                    <TableHead>Court Ready</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceItems.map((evidence) => (
                    <TableRow key={evidence.id}>
                      <TableCell className="font-medium">
                        {evidence.id}
                      </TableCell>
                      <TableCell>{evidence.name}</TableCell>
                      <TableCell>
                        {evidence.type === "log" && (
                          <Badge className="bg-forensic-accent/20 text-forensic-accent">
                            Log
                          </Badge>
                        )}
                        {evidence.type === "email" && (
                          <Badge className="bg-forensic-evidence/20 text-forensic-evidence">
                            Email
                          </Badge>
                        )}
                        {evidence.type === "video" && (
                          <Badge className="bg-forensic-warning/20 text-forensic-warning">
                            Video
                          </Badge>
                        )}
                        {evidence.type === "report" && (
                          <Badge className="bg-forensic-court/20 text-forensic-court">
                            Report
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(evidence.status)}</TableCell>
                      <TableCell className="text-sm text-forensic-600">
                        {new Date(evidence.added).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {evidence.prepared ? (
                          <Badge className="bg-forensic-success/20 text-forensic-success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <Badge className="bg-forensic-400/20 text-forensic-600">
                            Not Ready
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => actions.previewEvidence(evidence)}
                          >
                            <Play className="h-3 w-3" />
                            <span>Preview</span>
                          </Button>
                          {evidence.prepared ? (
                            <Button
                              size="sm"
                              className="bg-forensic-accent hover:bg-forensic-accent/90"
                              onClick={() => actions.downloadEvidence(evidence)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                              onClick={() =>
                                actions.prepareEvidence(
                                  evidenceItems,
                                  setEvidenceItems,
                                  evidence.id
                                )
                              }
                            >
                              Prepare
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-forensic-50 border-t border-forensic-100 flex justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => actions.navigateTo("/evidence")}
              >
                <UploadCloud className="h-4 w-4" />
                <span>Add Evidence</span>
              </Button>
              <Button
                className="bg-forensic-accent hover:bg-forensic-accent/90 flex items-center gap-2"
                onClick={() => actions.preparePresentation()}
              >
                <Presentation className="h-4 w-4" />
                <span>Prepare Presentation</span>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-forensic-accent" />
                  Chain of Custody
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {evidenceItems.map((evidence) => (
                    <AccordionItem key={evidence.id} value={evidence.id}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <span className="font-medium">
                            {evidence.id}: {evidence.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(evidence.status)}
                            {evidence.prepared && (
                              <Badge className="bg-forensic-success/20 text-forensic-success">
                                Court Ready
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 py-2">
                          <p className="text-sm text-forensic-600">
                            This evidence has a complete and verified chain of
                            custody with
                            {evidence.id === "EV-2023-380" ? " 5" : " 3"}{" "}
                            recorded transfers.
                          </p>
                          <Button
                            variant="outline"
                            className="w-full text-forensic-accent"
                            onClick={() =>
                              actions.navigateTo(
                                `/verify/custody?evidenceId=${evidence.id}`
                              )
                            }
                          >
                            View Complete Chain
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-evidence hover:bg-forensic-evidence/90"
                  onClick={() => actions.generateChainOfCustodyReport()}
                >
                  Generate Chain of Custody Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Presentation className="h-5 w-5 mr-2 text-forensic-court" />
                  Evidence Presentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-forensic-600">
                  Create courtroom presentation materials for effective evidence
                  display
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                    <span className="text-sm">
                      Evidence chronology timeline
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                    <span className="text-sm">Technical evidence summary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-forensic-success" />
                    <span className="text-sm">
                      Chain of custody verification
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-forensic-warning" />
                    <span className="text-sm">
                      Video evidence highlight reel
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-forensic-warning" />
                    <span className="text-sm">Key evidence visual aids</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-court hover:bg-forensic-court/90"
                  onClick={() => actions.preparePresentation()}
                >
                  Create Presentation
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legal Documents</CardTitle>
              <CardDescription>
                Court filings and case documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="font-medium">{document.title}</div>
                        <div className="text-xs text-forensic-500">
                          {document.id}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(document.type)}</TableCell>
                      <TableCell className="text-sm text-forensic-600">
                        {new Date(document.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(document.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => actions.editDocument(document)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            className="bg-forensic-court hover:bg-forensic-court/90"
                            onClick={() => actions.downloadDocument(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-forensic-50 border-t border-forensic-100 flex justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => actions.navigateTo("/legal/documentation")}
              >
                <FileText className="h-4 w-4" />
                <span>Add Document</span>
              </Button>
              <Button
                className="bg-forensic-court hover:bg-forensic-court/90 flex items-center gap-2"
                onClick={() => actions.createDocument("Template")}
              >
                <Copy className="h-4 w-4" />
                <span>Create from Template</span>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-forensic-court" />
                  Witness Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Client Testimony Preparation
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Testimony preparation session</span>
                          <Badge className="bg-forensic-warning text-forensic-900">
                            Scheduled
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm gap-2">
                          <Calendar className="h-4 w-4 text-forensic-500" />
                          <span>April 25, 2025 - 2:00 PM</span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => actions.viewPreparationNotes()}
                        >
                          View Preparation Notes
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Expert Witness Documentation
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Technical Expert Testimony</span>
                          <Badge className="bg-forensic-success text-white">
                            Confirmed
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm gap-2">
                          <Users className="h-4 w-4 text-forensic-500" />
                          <span>
                            Dr. Michael Reynolds - Cybersecurity Expert
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => actions.viewExpertReport()}
                        >
                          View Expert Report
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Character Witness Statements
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Character Witness Collection</span>
                          <Badge className="bg-forensic-400/20 text-forensic-600">
                            In Progress
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm gap-2">
                          <Clock className="h-4 w-4 text-forensic-500" />
                          <span>2 of 4 statements collected</span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => actions.viewWitnessStatements()}
                        >
                          View Collected Statements
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-court hover:bg-forensic-court/90"
                  onClick={() => actions.scheduleWitnessMeeting()}
                >
                  Schedule Witness Preparation
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Gavel className="h-5 w-5 mr-2 text-forensic-court" />
                  Court Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-forensic-200 rounded-md bg-forensic-50">
                  <h4 className="font-medium mb-2">Key Defense Points</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                      <span>
                        Lack of proper procedure in evidence collection
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                      <span>Inconsistent timestamps in digital evidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                      <span>
                        Missing chain of custody for critical evidence
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-forensic-court"></div>
                      <span>
                        Physical access limitations disprove allegations
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Case Strategy Documents</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() =>
                        actions.viewStrategyDocument("Opening Statement Draft")
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Opening Statement Draft</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() =>
                        actions.viewStrategyDocument(
                          "Cross-Examination Strategy"
                        )
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Cross-Examination Strategy</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() =>
                        actions.viewStrategyDocument(
                          "Closing Arguments Outline"
                        )
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Closing Arguments Outline</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-court hover:bg-forensic-court/90"
                  onClick={() => actions.updateStrategyBrief()}
                >
                  Update Strategy Brief
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-forensic-warning" />
                Court Preparation Checklist
              </CardTitle>
              <CardDescription>
                Track preparation tasks for the upcoming court date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-md border ${
                      item.completed
                        ? "border-forensic-success/30 bg-forensic-success/5"
                        : "border-forensic-200"
                    }`}
                  >
                    <button
                      className="mt-0.5"
                      onClick={() =>
                        actions.toggleChecklistItem(
                          checklist,
                          setChecklist,
                          item.id
                        )
                      }
                    >
                      {item.completed ? (
                        <CheckSquare className="h-5 w-5 text-forensic-success" />
                      ) : (
                        <Square className="h-5 w-5 text-forensic-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={
                          item.completed
                            ? "line-through text-forensic-500"
                            : "text-forensic-800"
                        }
                      >
                        {item.task}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-forensic-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      {new Date(item.dueDate) < new Date() &&
                      !item.completed ? (
                        <Badge className="bg-forensic-danger text-white">
                          Overdue
                        </Badge>
                      ) : item.completed ? (
                        <Badge className="bg-forensic-success text-white">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-forensic-warning text-forensic-900">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-forensic-100 justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-forensic-success mr-2"></div>
                <span className="text-sm text-forensic-600">
                  {completedTasks} of {totalTasks} tasks completed (
                  {progressPercentage}%)
                </span>
              </div>
              <Button
                className="bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                onClick={() => setTaskDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-forensic-court" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-forensic-100">
                    <div className="space-y-1">
                      <p className="font-medium">Motion Filing Deadline</p>
                      <p className="text-sm text-forensic-500">
                        April 10, 2025
                      </p>
                    </div>
                    <Badge className="bg-forensic-success text-white">
                      Completed
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-forensic-100">
                    <div className="space-y-1">
                      <p className="font-medium">Client Preparation Session</p>
                      <p className="text-sm text-forensic-500">
                        April 25, 2025
                      </p>
                    </div>
                    <Badge className="bg-forensic-warning text-forensic-900">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-forensic-100">
                    <div className="space-y-1">
                      <p className="font-medium">
                        Evidence Submission Deadline
                      </p>
                      <p className="text-sm text-forensic-500">
                        April 30, 2025
                      </p>
                    </div>
                    <Badge className="bg-forensic-warning text-forensic-900">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pb-2">
                    <div className="space-y-1">
                      <p className="font-medium">Court Date</p>
                      <p className="text-sm text-forensic-500">May 15, 2025</p>
                    </div>
                    <Badge className="bg-forensic-court text-white">
                      Trial
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => actions.navigateTo("/calendar")}
                >
                  View Full Calendar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-forensic-success" />
                  Completion Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="h-12 w-12 rounded-full border-4 border-forensic-success flex items-center justify-center">
                      <span className="text-xl font-bold text-forensic-success">
                        {progressPercentage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Overall Completion</h4>
                    <p className="text-sm text-forensic-600 mt-1">
                      {progressPercentage >= 75
                        ? "Good progress! Most critical tasks are complete."
                        : progressPercentage >= 50
                        ? "Making progress, but still have important tasks to complete."
                        : "Many important tasks still need to be completed before the court date."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <h4 className="font-medium">Category Completion</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Evidence Preparation</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Documentation</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Witness Preparation</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Court Strategy</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-forensic-100">
                <Button
                  className="w-full bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
                  onClick={() => actions.generateProgressReport()}
                >
                  Generate Progress Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="task" className="text-sm font-medium">
                Task Description
              </label>
              <Input
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <div className="flex items-center">
                <Input
                  id="dueDate"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-forensic-warning hover:bg-forensic-warning/90 text-forensic-900"
              onClick={handleAddTask}
              disabled={!newTask.trim() || !taskDueDate}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourtPreparation;

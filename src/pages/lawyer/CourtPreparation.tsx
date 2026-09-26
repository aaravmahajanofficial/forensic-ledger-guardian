import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gavel,
  ListChecks,
  Calendar,
  FileText,
  FileDigit,
} from "lucide-react";
import {
  useCourtPreparationActions,
  ChecklistItem,
  EvidenceItem,
  DocumentItem,
} from "@/components/court/CourtPreparationActions";
import {
  caseData,
  initialEvidenceItems,
  initialDocuments,
  initialChecklistItems,
} from "@/components/court/courtPreparationData";
import { CourtPreparationOverviewTab } from "@/components/court/CourtPreparationOverviewTab";
import { CourtPreparationEvidenceTab } from "@/components/court/CourtPreparationEvidenceTab";
import { CourtPreparationDocumentsTab } from "@/components/court/CourtPreparationDocumentsTab";
import { CourtPreparationChecklistTab } from "@/components/court/CourtPreparationChecklistTab";
import { AddTaskDialog } from "@/components/court/AddTaskDialog";

const CourtPreparation = () => {
  const actions = useCourtPreparationActions();

  const [activeTab, setActiveTab] = useState("overview");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialChecklistItems,
  );
  const [evidenceItems, setEvidenceItems] =
    useState<EvidenceItem[]>(initialEvidenceItems);
  const [documents] = useState<DocumentItem[]>(initialDocuments);

  // Task dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  // Calculate preparation progress
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((item) => item.completed).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const daysUntilCourt = Math.ceil(
    (new Date(caseData.courtDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const handleAddTask = () => {
    if (!newTask.trim() || !taskDueDate) return;

    actions.addChecklistItem(
      checklist,
      setChecklist,
      newTask,
      new Date(taskDueDate).toISOString(),
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
          <CourtPreparationOverviewTab
            evidenceItems={evidenceItems}
            documents={documents}
            checklist={checklist}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            progressPercentage={progressPercentage}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <CourtPreparationEvidenceTab
            evidenceItems={evidenceItems}
            setEvidenceItems={setEvidenceItems}
            actions={actions}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <CourtPreparationDocumentsTab
            documents={documents}
            actions={actions}
          />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <CourtPreparationChecklistTab
            checklist={checklist}
            setChecklist={setChecklist}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            progressPercentage={progressPercentage}
            setTaskDialogOpen={setTaskDialogOpen}
            actions={actions}
          />
        </TabsContent>
      </Tabs>

      {/* Task dialog */}
      <AddTaskDialog
        taskDialogOpen={taskDialogOpen}
        setTaskDialogOpen={setTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        handleAddTask={handleAddTask}
      />
    </div>
  );
};

export default CourtPreparation;

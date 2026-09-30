import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  ListChecks,
  FileText,
  FileDigit,
} from "lucide-react";
import {
  ChecklistItem,
  EvidenceItem,
  DocumentItem,
} from "./CourtPreparationActions";

interface CourtPreparationOverviewTabProps {
  evidenceItems: EvidenceItem[];
  documents: DocumentItem[];
  checklist: ChecklistItem[];
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  setActiveTab: (tab: string) => void;
}

export const CourtPreparationOverviewTab: React.FC<
  CourtPreparationOverviewTabProps
> = ({
  evidenceItems,
  documents,
  checklist,
  completedTasks,
  totalTasks,
  progressPercentage,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6">
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
                  value={
                    evidenceItems.length > 0
                      ? Math.round(
                          (evidenceItems.filter((e) => e.prepared).length /
                            evidenceItems.length) *
                            100,
                        )
                      : 0
                  }
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
                          d.status === "completed" || d.status === "filed",
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
                          d.status === "completed" || d.status === "filed",
                      ).length
                    }{" "}
                    of {documents.length} completed
                  </span>
                </div>
                <Progress
                  value={
                    documents.length > 0
                      ? Math.round(
                          (documents.filter(
                            (d) =>
                              d.status === "completed" || d.status === "filed",
                          ).length /
                            documents.length) *
                            100,
                        )
                      : 0
                  }
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
                  All evidence must be submitted to the court and shared with
                  opposing counsel.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] mt-1 h-4 w-4 rounded-full bg-forensic-400"></div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Pre-Trial Conference</h4>
                </div>
                <p className="text-sm text-forensic-600 mb-1">May 5, 2025</p>
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
                  <Badge className="bg-forensic-court text-white">Trial</Badge>
                </div>
                <p className="text-sm text-forensic-600 mb-1">May 15, 2025</p>
                <p className="text-sm">
                  District Court, Cybercrime Division - 10:00 AM
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

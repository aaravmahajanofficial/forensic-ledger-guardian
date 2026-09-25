import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ListChecks,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Square,
  Plus,
} from "lucide-react";
import { ChecklistItem, useCourtPreparationActions } from "./CourtPreparationActions";

interface CourtPreparationChecklistTabProps {
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
  setTaskDialogOpen: (open: boolean) => void;
  actions: ReturnType<typeof useCourtPreparationActions>;
}

export const CourtPreparationChecklistTab: React.FC<
  CourtPreparationChecklistTabProps
> = ({
  checklist,
  setChecklist,
  completedTasks,
  totalTasks,
  progressPercentage,
  setTaskDialogOpen,
  actions,
}) => {
  return (
    <div className="space-y-6">
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
                      item.id,
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
    </div>
  );
};

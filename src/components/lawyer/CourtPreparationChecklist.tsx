import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Plus, Calendar } from "lucide-react";

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string;
  priority: "high" | "medium" | "low";
}

interface CourtPreparationChecklistProps {
  checklist: ChecklistItem[];
  onUpdateChecklist: (checklist: ChecklistItem[]) => void;
}

const CourtPreparationChecklist: React.FC<CourtPreparationChecklistProps> = ({
  checklist,
  onUpdateChecklist,
}) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const toggleTask = (id: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateChecklist(updatedChecklist);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newChecklistItem: ChecklistItem = {
        id: Date.now().toString(),
        task: newTask,
        completed: false,
        dueDate: taskDueDate || undefined,
        priority: "medium",
      };
      onUpdateChecklist([...checklist, newChecklistItem]);
      setNewTask("");
      setTaskDueDate("");
      setTaskDialogOpen(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-forensic-accident" />
                Court Preparation Checklist
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {completedTasks} of {totalTasks} tasks completed (
                {Math.round(completionPercentage)}%)
              </p>
            </div>
            <Button onClick={() => setTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                item.completed ? "bg-gray-50 opacity-60" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleTask(item.id)}
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.task}
                  </p>
                  {item.dueDate && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.dueDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>
                {item.completed && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Description</label>
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Due Date (Optional)</label>
              <Input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourtPreparationChecklist;

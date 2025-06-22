import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Plus, Calendar, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">(
    "medium"
  );

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
        priority: taskPriority,
      };
      onUpdateChecklist([...checklist, newChecklistItem]);
      setNewTask("");
      setTaskDueDate("");
      setTaskPriority("medium");
      setTaskDialogOpen(false);
    }
  };

  const getPriorityBadgeVariant = (
    priority: "high" | "medium" | "low"
  ): "destructive" | "warning" | "success" => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
    }
  };

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            Court Preparation Checklist
          </CardTitle>
          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a new task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task" className="text-right">
                    Task
                  </Label>
                  <Input
                    id="task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., File motion to compel"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="due-date" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    onValueChange={(
                      value: "high" | "medium" | "low"
                    ) => setTaskPriority(value)}
                    defaultValue={taskPriority}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTaskDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={addTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-1">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
        <div className="space-y-3 pt-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                item.completed
                  ? "bg-muted/50 border-dashed"
                  : "bg-background hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  id={`task-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => toggleTask(item.id)}
                />
                <label
                  htmlFor={`task-${item.id}`}
                  className={cn(
                    "font-medium",
                    item.completed ? "line-through text-muted-foreground" : ""
                  )}
                >
                  {item.task}
                </label>
              </div>
              <div className="flex items-center gap-4">
                {item.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{item.dueDate}</span>
                  </div>
                )}
                <Badge
                  variant={getPriorityBadgeVariant(item.priority)}
                  className="flex items-center gap-1"
                >
                  <Flag className="h-3 w-3" />
                  {item.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center">
        Stay organized and ensure all preparations are complete before the court date.
      </CardFooter>
    </Card>
  );
};

export default CourtPreparationChecklist;

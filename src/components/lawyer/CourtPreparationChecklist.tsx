import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DialogDescription,
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
import { CheckCircle2, Plus, Calendar, ListTodo } from "lucide-react";
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
      onUpdateChecklist([newChecklistItem, ...checklist]);
      setNewTask("");
      setTaskDueDate("");
      setTaskPriority("medium");
      setTaskDialogOpen(false);
    }
  };

  const getPriorityBadgeVariant = (
    priority: "high" | "medium" | "low"
  ): "destructive" | "warning" | "default" => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
    }
  };

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="w-full border-border/40 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
            <ListTodo className="h-6 w-6" />
            Preparation Checklist
          </CardTitle>
          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add a new preparation task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new item to the checklist.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
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
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        <div className="space-y-3 pt-4 border-t border-border/40">
          {checklist.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks yet. Add a task to get started.</p>
            </div>
          )}
          {checklist.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border border-border/40 transition-all",
                item.completed
                  ? "bg-muted/50"
                  : "bg-background hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  id={`task-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => toggleTask(item.id)}
                  aria-label={`Mark task as ${item.completed ? 'incomplete' : 'complete'}`}
                />
                <label
                  htmlFor={`task-${item.id}`}
                  className={cn(
                    "font-medium text-sm",
                    item.completed ? "line-through text-muted-foreground" : "text-foreground"
                  )}
                >
                  {item.task}
                </label>
              </div>
              <div className="flex items-center gap-4">
                {item.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
                <Badge
                  variant={getPriorityBadgeVariant(item.priority)}
                  className="capitalize text-xs px-2 py-0.5 rounded-md"
                >
                  {item.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtPreparationChecklist;

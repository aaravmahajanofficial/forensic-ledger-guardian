import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTaskDialogProps {
  taskDialogOpen: boolean;
  setTaskDialogOpen: (open: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  taskDueDate: string;
  setTaskDueDate: (date: string) => void;
  handleAddTask: () => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  taskDialogOpen,
  setTaskDialogOpen,
  newTask,
  setNewTask,
  taskDueDate,
  setTaskDueDate,
  handleAddTask,
}) => {
  return (
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
  );
};

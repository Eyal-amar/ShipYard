import { KanbanStatus, TaskPriority } from "./types";

export const STORAGE_KEY = "project-mgmt-state";

export const COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: "todo", label: "TODO" },
  { id: "in_progress", label: "IN PROGRESS" },
  { id: "complete", label: "COMPLETE" },
];

export const DEFAULT_PRIORITY: TaskPriority = "medium";

export const PRIORITIES: TaskPriority[] = ["critical", "high", "medium", "low"];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; order: number }> = {
  critical: { label: "Critical", color: "#ef4444", order: 0 },
  high: { label: "High", color: "#f59e0b", order: 1 },
  medium: { label: "Medium", color: "#22d3ee", order: 2 },
  low: { label: "Low", color: "#5550a0", order: 3 },
};

export const DEFAULT_STATE = {
  tasks: [],
  todos: [],
  notes: [],
  quickTasks: [],
};

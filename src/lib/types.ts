export type KanbanStatus = "todo" | "in_progress" | "complete";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: TaskPriority;
  order: number;
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  order: number;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface QuickTask {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface AppState {
  tasks: Task[];
  todos: TodoItem[];
  notes: Note[];
  quickTasks: QuickTask[];
}

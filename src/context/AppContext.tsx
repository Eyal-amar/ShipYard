"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
} from "react";
import { AppState, Task, TodoItem, Note, QuickTask, KanbanStatus, TaskPriority } from "@/lib/types";
import { load, save } from "@/lib/storage";
import { DEFAULT_STATE, DEFAULT_PRIORITY } from "@/lib/constants";

// Actions
type Action =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "ADD_TASK"; payload: { title: string; description: string; priority?: TaskPriority } }
  | { type: "MOVE_TASK"; payload: { taskId: string; status: KanbanStatus; order: number } }
  | { type: "REORDER_TASKS"; payload: { status: KanbanStatus; orderedIds: string[] } }
  | { type: "UPDATE_TASK_PRIORITY"; payload: { taskId: string; priority: TaskPriority } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "ADD_NOTE"; payload: string }
  | { type: "UPDATE_NOTE"; payload: { id: string; content: string } }
  | { type: "UPDATE_NOTE_TITLE"; payload: { id: string; title: string } }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "ADD_QUICK_TASK"; payload: string }
  | { type: "TOGGLE_QUICK_TASK"; payload: string }
  | { type: "DELETE_QUICK_TASK"; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_TASK": {
      const tasksInTodo = state.tasks.filter((t) => t.status === "todo");
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        description: action.payload.description,
        status: "todo",
        priority: action.payload.priority || DEFAULT_PRIORITY,
        order: tasksInTodo.length,
        createdAt: Date.now(),
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case "MOVE_TASK": {
      const { taskId, status, order } = action.payload;
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, order } : t
      );
      return { ...state, tasks };
    }

    case "REORDER_TASKS": {
      const { status, orderedIds } = action.payload;
      const tasks = state.tasks.map((t) => {
        if (t.status === status) {
          const idx = orderedIds.indexOf(t.id);
          return idx !== -1 ? { ...t, order: idx } : t;
        }
        return t;
      });
      return { ...state, tasks };
    }

    case "UPDATE_TASK_PRIORITY": {
      const { taskId, priority } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, priority } : t
        ),
      };
    }

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    case "ADD_TODO": {
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        text: action.payload,
        done: false,
        order: state.todos.length,
        createdAt: Date.now(),
      };
      return { ...state, todos: [...state.todos, newTodo] };
    }

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };

    case "DELETE_TODO":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.payload) };

    case "ADD_NOTE": {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: action.payload || "Untitled",
        content: "",
        createdAt: Date.now(),
      };
      return { ...state, notes: [...state.notes, newNote] };
    }

    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? { ...n, content: action.payload.content } : n
        ),
      };

    case "UPDATE_NOTE_TITLE":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? { ...n, title: action.payload.title } : n
        ),
      };

    case "DELETE_NOTE":
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };

    case "ADD_QUICK_TASK": {
      const newQuickTask: QuickTask = {
        id: crypto.randomUUID(),
        text: action.payload,
        done: false,
        createdAt: Date.now(),
      };
      return { ...state, quickTasks: [...state.quickTasks, newQuickTask] };
    }

    case "TOGGLE_QUICK_TASK":
      return {
        ...state,
        quickTasks: state.quickTasks.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };

    case "DELETE_QUICK_TASK":
      return { ...state, quickTasks: state.quickTasks.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
}>({ state: DEFAULT_STATE, dispatch: () => {} });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    // Migrate old state format
    const migrated = {
      ...DEFAULT_STATE,
      ...saved,
      notes: Array.isArray(saved.notes) ? saved.notes : [],
      quickTasks: saved.quickTasks || [],
      // Migrate tasks to include priority if missing
      tasks: (saved.tasks || []).map((task: Task) => ({
        ...task,
        priority: task.priority || DEFAULT_PRIORITY,
      })),
    };
    dispatch({ type: "HYDRATE", payload: migrated });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  if (!hydrated) return null;

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}

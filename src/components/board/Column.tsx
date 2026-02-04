"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, KanbanStatus } from "@/lib/types";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";

interface ColumnProps {
  id: KanbanStatus;
  label: string;
  tasks: Task[];
}

const statusConfig: Record<KanbanStatus, { accent: string; glow: string }> = {
  todo: {
    accent: "var(--color-violet-500)",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  in_progress: {
    accent: "var(--color-fuchsia-500)",
    glow: "rgba(217, 70, 239, 0.3)",
  },
  complete: {
    accent: "var(--color-success)",
    glow: "rgba(16, 185, 129, 0.3)",
  },
};

function StatusIcon({ status }: { status: KanbanStatus }) {
  if (status === "todo") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  if (status === "in_progress") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function Column({ id, label, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = statusConfig[id];

  return (
    <div className="flex flex-1 flex-col min-w-[280px] max-w-[360px]">
      {/* Column Header */}
      <div className="relative mb-4">
        <div
          className="relative flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, var(--color-void-700), var(--color-void-800))`,
            borderTop: `2px solid ${config.accent}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{
              background: `${config.accent}20`,
              color: config.accent,
            }}
          >
            <StatusIcon status={id} />
          </div>

          {/* Label */}
          <h2
            className="text-sm font-semibold uppercase tracking-[0.1em]"
            style={{
              color: config.accent,
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
            }}
          >
            {label}
          </h2>

          {/* Count badge */}
          <div
            className="ml-auto flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold"
            style={{
              background: `${config.accent}15`,
              color: config.accent,
              border: `1px solid ${config.accent}30`,
            }}
          >
            {tasks.length}
          </div>
        </div>
      </div>

      {/* Task Container */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-1 flex-col gap-3 rounded-xl p-3 min-h-[300px]
          transition-all duration-200
        `}
        style={{
          background: isOver
            ? `linear-gradient(180deg, ${config.accent}10, var(--color-void-800)/50)`
            : 'var(--color-void-800)/30',
          border: `1px solid ${isOver ? config.accent : 'var(--color-void-700)'}`,
          boxShadow: isOver
            ? `0 0 30px ${config.glow}, inset 0 0 30px ${config.accent}05`
            : `inset 0 2px 4px rgba(0,0,0,0.1)`,
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                animation: 'cargoLoad 0.3s ease-out forwards',
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              <TaskCard task={task} />
            </div>
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center opacity-40">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="mx-auto mb-2 text-[var(--color-void-500)]"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                <path d="M12 8v8M8 12h8" strokeDasharray="2 2" />
              </svg>
              <p className="text-xs text-[var(--color-void-500)] italic">
                Drop tasks here
              </p>
            </div>
          </div>
        )}

        {id === "todo" && <NewTaskForm />}
      </div>
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskPriority } from "@/lib/types";
import { useAppState } from "@/context/AppContext";
import { PRIORITIES, PRIORITY_CONFIG } from "@/lib/constants";
import PriorityIcon from "./PriorityIcon";

export default function TaskCard({ task }: { task: Task }) {
  const { dispatch } = useAppState();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const accentColor = task.status === 'complete'
    ? 'var(--color-success)'
    : task.status === 'in_progress'
    ? 'var(--color-fuchsia-500)'
    : 'var(--color-violet-500)';

  function cyclePriority(e: React.MouseEvent) {
    e.stopPropagation();
    const currentIndex = PRIORITIES.indexOf(task.priority);
    const nextIndex = (currentIndex + 1) % PRIORITIES.length;
    const nextPriority: TaskPriority = PRIORITIES[nextIndex];
    dispatch({ type: "UPDATE_TASK_PRIORITY", payload: { taskId: task.id, priority: nextPriority } });
  }

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative rounded-xl cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-60 scale-[1.02] z-50' : 'hover:translate-y-[-2px]'}
      `}
    >
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(135deg, var(--color-void-700) 0%, var(--color-void-800) 100%)`,
          border: `1px solid var(--color-void-600)`,
          boxShadow: isDragging
            ? `0 12px 24px rgba(0,0,0,0.5), 0 0 0 2px ${accentColor}`
            : `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Status accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ background: accentColor }}
        />

        {/* Content */}
        <div className="relative p-4 pl-5">
          <div className="flex items-start justify-between gap-3">
            <p
              className="text-sm font-medium leading-snug"
              style={{
                color: 'var(--color-text-100)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.02em',
              }}
            >
              {task.title}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "DELETE_TASK", payload: task.id });
              }}
              className="
                shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                hover:bg-[var(--color-danger)]/20
              "
              style={{ color: 'var(--color-void-400)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2L10 10M10 2L2 10" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {task.description && (
            <p
              className="mt-2 text-xs leading-relaxed line-clamp-2"
              style={{
                color: 'var(--color-text-300)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md"
              style={{
                background: 'var(--color-void-600)/50',
                color: 'var(--color-text-300)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              #{task.id.slice(0, 6)}
            </div>

            {/* Priority badge - click to cycle */}
            <button
              onClick={cyclePriority}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer"
              style={{
                background: `${priorityConfig.color}20`,
                border: `1px solid ${priorityConfig.color}40`,
                color: priorityConfig.color,
                fontFamily: 'var(--font-mono)',
              }}
              title={`Priority: ${priorityConfig.label} (click to change)`}
            >
              <PriorityIcon priority={task.priority} size={10} />
              <span>{priorityConfig.label}</span>
            </button>

            <div className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ color: 'var(--color-void-400)' }}>
                <circle cx="3" cy="3" r="1" />
                <circle cx="9" cy="3" r="1" />
                <circle cx="3" cy="6" r="1" />
                <circle cx="9" cy="6" r="1" />
                <circle cx="3" cy="9" r="1" />
                <circle cx="9" cy="9" r="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

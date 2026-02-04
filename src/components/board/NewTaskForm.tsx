"use client";

import { useState, KeyboardEvent } from "react";
import { useAppState } from "@/context/AppContext";
import { TaskPriority } from "@/lib/types";
import { PRIORITIES, PRIORITY_CONFIG, DEFAULT_PRIORITY } from "@/lib/constants";
import PriorityIcon from "./PriorityIcon";

export default function NewTaskForm() {
  const { dispatch } = useAppState();
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>(DEFAULT_PRIORITY);

  function addTask() {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_TASK", payload: { title: trimmed, description: "", priority } });
    setTitle("");
    setPriority(DEFAULT_PRIORITY);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  }

  return (
    <div className="mt-auto pt-4">
      {/* Dashed border container */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: isFocused
            ? 'linear-gradient(145deg, var(--color-void-700), var(--color-void-800))'
            : 'transparent',
          border: `2px dashed ${isFocused ? 'var(--color-violet-400)' : 'var(--color-violet-600)'}`,
          boxShadow: isFocused
            ? '0 0 25px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'none',
        }}
      >
        {/* Subtle glow overlay when focused */}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            }}
          />
        )}

        <div className="relative flex flex-col gap-2 p-3">
          <div className="flex items-center gap-3">
            {/* Plus icon */}
            <div
              className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                color: isFocused ? 'var(--color-violet-400)' : 'var(--color-violet-500)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 1v12M1 7h12" strokeLinecap="round" />
              </svg>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Add new task..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{
                color: 'var(--color-text-100)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.02em',
              }}
            />

            {/* Add button - appears when typing */}
            {title.trim() && (
              <button
                type="button"
                onClick={addTask}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--color-violet-600), var(--color-fuchsia-500))',
                  color: 'white',
                  boxShadow: '0 2px 10px rgba(139, 92, 246, 0.4)',
                }}
              >
                Add
              </button>
            )}
          </div>

          {/* Priority quick-select buttons - appears when typing */}
          {title.trim() && (
            <div className="flex items-center gap-2 pl-9">
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--color-text-300)' }}
              >
                Priority:
              </span>
              {PRIORITIES.map((p) => {
                const config = PRIORITY_CONFIG[p];
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer"
                    style={{
                      background: isSelected ? `${config.color}30` : 'transparent',
                      border: `1px solid ${isSelected ? config.color : 'var(--color-void-500)'}`,
                      color: isSelected ? config.color : 'var(--color-text-300)',
                      fontFamily: 'var(--font-mono)',
                    }}
                    title={config.label}
                  >
                    <PriorityIcon priority={p} size={10} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Helper text */}
      <p
        className="mt-2 text-[10px] text-center uppercase tracking-wider"
        style={{ color: 'var(--color-violet-500)', opacity: 0.6 }}
      >
        Press Enter to add
      </p>
    </div>
  );
}

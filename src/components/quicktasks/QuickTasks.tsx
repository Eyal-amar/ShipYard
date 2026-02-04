"use client";

import { useState, KeyboardEvent } from "react";
import { useAppState } from "@/context/AppContext";
import { QuickTask } from "@/lib/types";

function QuickTaskItem({ task }: { task: QuickTask }) {
  const { dispatch } = useAppState();

  return (
    <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-[var(--color-void-700)]/50">
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_QUICK_TASK", payload: task.id })}
        className="shrink-0 w-3.5 h-3.5 rounded-sm border transition-all duration-200 flex items-center justify-center cursor-pointer"
        style={{
          background: task.done
            ? 'var(--color-success)'
            : 'transparent',
          borderColor: task.done ? 'var(--color-success)' : 'var(--color-void-400)',
          borderWidth: '1.5px',
        }}
      >
        {task.done && (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Task text */}
      <span
        className={`flex-1 text-sm transition-all duration-200 ${task.done ? 'line-through' : ''}`}
        style={{
          color: task.done ? 'var(--color-void-400)' : 'var(--color-text-200)',
          fontFamily: 'var(--font-sans)',
          opacity: task.done ? 0.5 : 1,
        }}
      >
        {task.text}
      </span>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => dispatch({ type: "DELETE_QUICK_TASK", payload: task.id })}
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--color-danger)]/20 cursor-pointer"
        style={{ color: 'var(--color-void-400)' }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 2L10 10M10 2L2 10" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function QuickTasks() {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const sorted = [...state.quickTasks].sort((a, b) => b.createdAt - a.createdAt);
  const pending = sorted.filter((t) => !t.done);
  const completed = sorted.filter((t) => t.done);

  function addTask() {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_QUICK_TASK", payload: trimmed });
    setText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-violet-600), var(--color-fuchsia-500))',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2
            className="text-sm font-bold uppercase tracking-[0.1em]"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--color-violet-400), var(--color-fuchsia-400))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quick Tasks
          </h2>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-void-400)]">
            Ship fast
          </p>
        </div>
      </div>

      {/* Input */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200 mb-5"
        style={{
          background: isFocused
            ? 'linear-gradient(135deg, var(--color-void-700), var(--color-void-800))'
            : 'var(--color-void-800)',
          border: `1px solid ${isFocused ? 'var(--color-violet-500)' : 'var(--color-void-700)'}`,
          boxShadow: isFocused ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
        }}
      >
        <div className="flex items-center gap-2 p-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke={isFocused ? 'var(--color-violet-400)' : 'var(--color-void-500)'}
            strokeWidth="2"
            className="shrink-0 transition-colors"
          >
            <path d="M7 1v12M1 7h12" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Add quick task..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-[var(--color-void-500)]"
            style={{
              color: 'var(--color-text-100)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
      </div>

      {/* Task lists */}
      <div className="flex-1 overflow-auto -mx-1 px-1">
        {pending.length > 0 && (
          <div className="flex flex-col gap-1">
            {pending.map((task) => (
              <QuickTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {pending.length === 0 && completed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-void-500)"
              strokeWidth="1"
              className="mb-3"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <p className="text-xs italic text-[var(--color-void-500)]">
              Ready to ship
            </p>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[var(--color-void-600)] to-transparent" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-void-500)] flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Shipped ({completed.length})
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-void-600)] via-[var(--color-void-600)] to-transparent" />
            </div>
            <div className="flex flex-col gap-1">
              {completed.map((task) => (
                <QuickTaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div
        className="mt-4 pt-4 flex items-center justify-between text-[10px] uppercase tracking-wider"
        style={{
          borderTop: '1px solid var(--color-void-700)',
          color: 'var(--color-void-500)',
        }}
      >
        <span>{pending.length} pending</span>
        <span>{completed.length} shipped</span>
      </div>
    </div>
  );
}

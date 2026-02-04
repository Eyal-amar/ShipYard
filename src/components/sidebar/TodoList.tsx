"use client";

import { useState, KeyboardEvent } from "react";
import { useAppState } from "@/context/AppContext";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { state, dispatch } = useAppState();
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const sorted = [...state.todos].sort((a, b) => a.order - b.order);
  const pendingCount = sorted.filter((t) => !t.done).length;
  const doneCount = sorted.filter((t) => t.done).length;
  const progress = sorted.length > 0 ? (doneCount / sorted.length) * 100 : 0;

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_TODO", payload: trimmed });
    setText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-fuchsia-500), var(--color-violet-600))',
            boxShadow: '0 4px 12px rgba(217, 70, 239, 0.4)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1">
          <h2
            className="text-sm font-bold uppercase tracking-[0.1em]"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, var(--color-fuchsia-400), var(--color-violet-400))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Checklist
          </h2>
          <p className="text-[10px] uppercase tracking-wider text-[var(--color-void-400)]">
            Stay on track
          </p>
        </div>
        {sorted.length > 0 && (
          <div
            className="text-xs font-mono px-2 py-1 rounded-lg"
            style={{
              background: 'var(--color-void-700)',
              color: progress === 100 ? 'var(--color-success)' : 'var(--color-fuchsia-400)',
            }}
          >
            {Math.round(progress)}%
          </div>
        )}
      </div>

      {/* Progress bar */}
      {sorted.length > 0 && (
        <div className="relative h-2 rounded-full overflow-hidden bg-[var(--color-void-700)]">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500 rounded-full"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(90deg, var(--color-success), #059669)'
                : 'linear-gradient(90deg, var(--color-violet-600), var(--color-fuchsia-500))',
              boxShadow: `0 0 10px ${progress === 100 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(139, 92, 246, 0.5)'}`,
            }}
          />
        </div>
      )}

      {/* Todo items */}
      <div className="flex flex-col gap-1">
        {sorted.map((item, index) => (
          <div
            key={item.id}
            style={{
              animation: 'fadeSlideIn 0.3s ease-out forwards',
              animationDelay: `${index * 0.05}s`,
              opacity: 0,
            }}
          >
            <TodoItem item={item} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 opacity-40">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-void-500)"
            strokeWidth="1"
            className="mb-2"
          >
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-xs italic text-[var(--color-void-500)]">
            All caught up
          </p>
        </div>
      )}

      {/* Add item input */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: isFocused
            ? 'linear-gradient(135deg, var(--color-void-700), var(--color-void-800))'
            : 'var(--color-void-800)',
          border: `1px solid ${isFocused ? 'var(--color-fuchsia-500)' : 'var(--color-void-700)'}`,
          boxShadow: isFocused ? '0 0 20px rgba(217, 70, 239, 0.15)' : 'none',
        }}
      >
        <div className="flex items-center gap-2 p-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke={isFocused ? 'var(--color-fuchsia-400)' : 'var(--color-void-500)'}
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
            placeholder="Add item..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-[var(--color-void-500)]"
            style={{
              color: 'var(--color-text-100)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>
      </div>

      {/* Stats */}
      {sorted.length > 0 && (
        <div
          className="flex items-center justify-between text-[10px] uppercase tracking-wider pt-2"
          style={{
            borderTop: '1px solid var(--color-void-700)',
            color: 'var(--color-void-500)',
          }}
        >
          <span>{pendingCount} remaining</span>
          <span>{doneCount} complete</span>
        </div>
      )}
    </div>
  );
}

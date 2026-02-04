"use client";

import { TodoItem as TodoItemType } from "@/lib/types";
import { useAppState } from "@/context/AppContext";

export default function TodoItem({ item }: { item: TodoItemType }) {
  const { dispatch } = useAppState();

  return (
    <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-[var(--color-void-700)]/50">
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_TODO", payload: item.id })}
        className="shrink-0 w-3.5 h-3.5 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer"
        style={{
          background: item.done
            ? 'var(--color-success)'
            : 'transparent',
          borderColor: item.done ? 'var(--color-success)' : 'var(--color-void-400)',
          borderWidth: '1.5px',
        }}
      >
        {item.done && (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Task text */}
      <span
        className={`flex-1 text-sm transition-all duration-200 ${item.done ? 'line-through' : ''}`}
        style={{
          color: item.done ? 'var(--color-void-400)' : 'var(--color-text-200)',
          fontFamily: 'var(--font-sans)',
          opacity: item.done ? 0.5 : 1,
        }}
      >
        {item.text}
      </span>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => dispatch({ type: "DELETE_TODO", payload: item.id })}
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

"use client";

import { useState, useEffect, useRef } from "react";
import { useAppState } from "@/context/AppContext";
import { Note } from "@/lib/types";

function NoteCard({ note, index }: { note: Note; index: number }) {
  const { dispatch } = useAppState();
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note.content, note.title]);

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setContent(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch({ type: "UPDATE_NOTE", payload: { id: note.id, content: next } });
    }, 300);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setTitle(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch({ type: "UPDATE_NOTE_TITLE", payload: { id: note.id, title: next } });
    }, 300);
  }

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'linear-gradient(135deg, var(--color-void-700), var(--color-void-800))',
        border: `1px solid ${isFocused ? 'var(--color-cyan-500)' : 'var(--color-void-600)'}`,
        boxShadow: isFocused
          ? '0 4px 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        animation: 'cargoLoad 0.3s ease-out forwards',
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{
          background: 'linear-gradient(180deg, var(--color-cyan-500), var(--color-violet-500))',
        }}
      />

      {/* Content */}
      <div className="relative p-4 pl-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-cyan-400)"
              strokeWidth="2"
              className="shrink-0 opacity-60"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-sm font-semibold outline-none"
              style={{
                color: 'var(--color-text-100)',
                fontFamily: 'var(--font-sans)',
              }}
              placeholder="Note title..."
            />
          </div>

          <button
            onClick={() => dispatch({ type: "DELETE_NOTE", payload: note.id })}
            className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--color-danger)]/20"
            style={{ color: 'var(--color-void-400)' }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2L10 10M10 2L2 10" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div
          className="h-[1px]"
          style={{
            background: 'linear-gradient(90deg, var(--color-cyan-500)/30, transparent)',
          }}
        />

        {/* Content textarea */}
        <textarea
          value={content}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Write your notes here..."
          className="min-h-[80px] resize-none bg-transparent text-sm outline-none leading-relaxed"
          style={{
            color: 'var(--color-text-200)',
            fontFamily: 'var(--font-sans)',
          }}
        />
      </div>
    </div>
  );
}

export default function NotesArea() {
  const { state, dispatch } = useAppState();

  const sorted = [...state.notes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-cyan-500), var(--color-violet-600))',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
          <div>
            <h2
              className="text-sm font-bold uppercase tracking-[0.1em]"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--color-cyan-400), var(--color-violet-400))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Notes
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-void-400)]">
              Capture ideas
            </p>
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={() => dispatch({ type: "ADD_NOTE", payload: "" })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-cyan-500)/20, var(--color-violet-500)/10)',
            border: '1px solid var(--color-cyan-500)/40',
            color: 'var(--color-cyan-400)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 1v10M1 6h10" strokeLinecap="round" />
          </svg>
          New
        </button>
      </div>

      {/* Notes list */}
      <div className="flex flex-col gap-3 overflow-auto flex-1">
        {sorted.map((note, index) => (
          <NoteCard key={note.id} note={note} index={index} />
        ))}

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-40">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-void-500)"
              strokeWidth="1"
              className="mb-3"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <path d="M12 11v6M9 14h6" strokeDasharray="2 2" />
            </svg>
            <p className="text-xs italic text-[var(--color-void-500)]">
              No notes yet
            </p>
            <button
              onClick={() => dispatch({ type: "ADD_NOTE", payload: "" })}
              className="mt-3 text-xs text-[var(--color-cyan-400)] hover:underline"
            >
              Create your first note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

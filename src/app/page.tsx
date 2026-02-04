import Board from "@/components/board/Board";
import TodoList from "@/components/sidebar/TodoList";
import NotesArea from "@/components/notes/NotesArea";
import QuickTasks from "@/components/quicktasks/QuickTasks";

export default function Home() {
  return (
    <div className="flex h-screen relative z-10">
      {/* Left Sidebar - Quick Tasks */}
      <aside className="w-72 border-r border-[var(--color-void-700)] bg-gradient-to-b from-[var(--color-void-800)] to-[var(--color-void-900)] p-5 flex flex-col overflow-auto">
        <QuickTasks />
      </aside>

      {/* Main Content - Kanban Board */}
      <main className="flex-1 p-8 overflow-auto bg-[var(--color-void-900)]">
        {/* Header with Logo */}
        <header className="mb-8 flex items-center gap-4">
          {/* Rocket/Ship Icon */}
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-violet-600), var(--color-fuchsia-500))',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
            {/* Glow ring */}
            <div
              className="absolute -inset-1 rounded-xl opacity-30 blur-sm"
              style={{
                background: 'linear-gradient(135deg, var(--color-violet-500), var(--color-fuchsia-500))',
              }}
            />
          </div>

          <div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--color-text-100), var(--color-violet-300))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SHIPYARD
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-[2px] w-16"
                style={{
                  background: 'linear-gradient(90deg, var(--color-violet-500), transparent)',
                }}
              />
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-violet-400)]">
                Vibe Command
              </span>
            </div>
          </div>

          {/* Status indicator */}
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-void-700)]/50 border border-[var(--color-void-600)]">
            <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="text-xs text-[var(--color-text-300)]">Shipping</span>
          </div>
        </header>

        <Board />
      </main>

      {/* Right Sidebar - Checklist & Notes */}
      <aside className="w-80 border-l border-[var(--color-void-700)] bg-gradient-to-b from-[var(--color-void-800)] to-[var(--color-void-900)] p-5 flex flex-col gap-8 overflow-auto">
        <TodoList />
        <NotesArea />
      </aside>
    </div>
  );
}

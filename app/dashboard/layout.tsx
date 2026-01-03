// app/dashboard/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/topics"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Topics
          </Link>
          <Link
            href="/dashboard/writing"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Writing Style
          </Link>
          <Link
            href="/dashboard/integrations"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Integrations
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}


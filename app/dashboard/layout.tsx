// app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const tabs = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/topics', label: 'Topics' },
    { href: '/dashboard/writing', label: 'Writing Style' },
    { href: '/dashboard/integrations', label: 'Integrations' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top-level nav with horizontal tabs */}
      <nav className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'text-white border-b-2 border-pink-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

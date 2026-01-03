// app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  PenTool,
  Share
} from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/topics', label: 'Topics', icon: List },
    { href: '/dashboard/writing', label: 'Writing Style', icon: PenTool },
    { href: '/dashboard/integrations', label: 'Integrations', icon: Share }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Vertical sidebar with icons */}
      <aside className="w-56 border-r border-zinc-800 bg-zinc-950">
        <nav className="py-6">
          <ul className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-zinc-900 text-white border-l-4 border-pink-500'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

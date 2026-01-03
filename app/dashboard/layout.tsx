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
  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/topics', label: 'Topics' },
    { href: '/dashboard/writing', label: 'Writing Style' },
    { href: '/dashboard/integrations', label: 'Integrations' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Vertical sidebar */}
      <aside className="w-56 border-r border-zinc-800 bg-zinc-950">
        <nav className="py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

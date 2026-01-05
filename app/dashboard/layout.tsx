// app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, PenTool, Share } from 'lucide-react';
import { PlanGateProvider } from './PlanGateProvider';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

type PlanRow = { plan: string | null; status: string | null };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // --- PLAN LOADING (client-side) ---
  const supabase = createClient();
  const [plan, setPlan] = useState<string>('basic');
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      try {
        setLoadingPlan(true);

        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
          // If not logged in, default to basic; your middleware/route protection should redirect anyway
          if (mounted) setPlan('basic');
          return;
        }

        // Read plan from customers (switch to users_table if you prefer)
        const { data, error } = await supabase
          .from('customers')
          .select('plan,status')
          .eq('id', user.id)
          .single<PlanRow>();

        if (error) {
          if (mounted) setPlan('basic');
          return;
        }

        // If status is inactive for any reason, still treat as basic in UI
        if (mounted) setPlan((data?.plan ?? 'basic').toLowerCase());
      } finally {
        if (mounted) setLoadingPlan(false);
      }
    }

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/topics', label: 'Topics', icon: List },
    { href: '/dashboard/writing', label: 'Writing Style', icon: PenTool },
    { href: '/dashboard/integrations', label: 'Integrations', icon: Share },
  ];

  return (
    <PlanGateProvider plan={plan}>
      <div className="min-h-screen bg-black text-white flex">
        {/* Vertical sidebar with icons */}
        <aside className="w-56 border-r border-zinc-800 bg-zinc-950">
          <nav className="py-6">
            {/* Plan badge */}
            <div className="px-4 pb-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="text-[11px] text-white/50">Plan</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {loadingPlan ? 'Loading…' : plan?.toUpperCase()}
                  </span>
                  {String(plan).toLowerCase() !== 'pro' ? (
                    <Link
                      href="/pricing"
                      className="text-xs text-pink-400 hover:text-pink-300"
                    >
                      Upgrade
                    </Link>
                  ) : (
                    <span className="text-xs text-emerald-300">Pro</span>
                  )}
                </div>
              </div>
            </div>

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
    </PlanGateProvider>
  );
}

// app/dashboard/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getUserDetails,
  getSubscription,
} from '@/utils/supabase/queries';

// Dynamically import the client-only stats component (no SSR)
const DashboardStatsClient = dynamic(
  () => import('./DashboardStatsClient'),
  { ssr: false },
);

export default async function DashboardPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  // Retrieve user details and plan/status
  const [userDetails] = await Promise.all([
    getUserDetails(supabase),
    getSubscription(supabase),
  ]);

  const { data: userPlanRow } = await (supabase as any)
    .from('users_table')
    .select('plan, status')
    .eq('id', user.id)
    .maybeSingle();

  const planKey = (userPlanRow?.plan ?? 'free').toLowerCase();
  const status = userPlanRow?.status ?? 'inactive';

  // Fetch aggregated stats
  const { data: statsRow } = await supabase
    .from('v_customer_dashboard_stats')
    .select(
      'articles_generated_30d, articles_delivered_30d, active_topics, active_integrations, ai_credits_30d',
    )
    .eq('customer_id', user.id)
    .maybeSingle();

  const stats = {
    articlesGenerated: statsRow?.articles_generated_30d ?? 0,
    articlesDelivered: statsRow?.articles_delivered_30d ?? 0,
    activeTopics: statsRow?.active_topics ?? 0,
    activeIntegrations: statsRow?.active_integrations ?? 0,
    aiCredits: statsRow?.ai_credits_30d ?? 0,
  };

  // Fetch daily data for sparkline charts
  const { data: dailyData } = await supabase
    .from('v_customer_articles_daily')
    .select('day, generated, delivered')
    .eq('customer_id', user.id)
    .gte(
      'day',
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    )
    .order('day', { ascending: true });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-zinc-500">
              Welcome back,{' '}
              <span className="font-medium">
                {userDetails?.full_name ?? user.email}
              </span>
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Dashboard overview
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage workspaces, feeds, and topics. This is where your
              automations will live once they’re wired in.
            </p>
          </div>

          {/* Plan and status badges (optional, adjust to your design) */}
          {/* ... plan/status badge code here ... */}
        </header>

        {/* Stats grid (client-rendered) */}
        <DashboardStatsClient
          stats={stats}
          dailyData={dailyData ?? []}
          userId={user.id}
        />

        {/* Quick actions and other sections (unchanged) */}
        {/* ... your existing quick action cards ... */}
      </div>
    </main>
  );
}

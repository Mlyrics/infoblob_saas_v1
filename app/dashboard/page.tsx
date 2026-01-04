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
const DashboardStatsClient = dynamic(() => import('./DashboardStatsClient'), {
  ssr: false,
});

export default async function DashboardPage() {
  // Cast Supabase client to any to bypass table/view type restrictions
  const supabase: any = createClient();
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

  // Determine plan label and badges
  const planLabel =
    planKey === 'agency'
      ? 'Agency'
      : planKey === 'pro'
      ? 'Pro'
      : planKey === 'basic'
      ? 'Basic'
      : 'Free';

  const hasPaidSubscription =
    ['basic', 'pro', 'agency'].includes(planKey) && status === 'active';

  const PlanBadge = hasPaidSubscription ? (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-100">
      Plan: {planLabel}
    </span>
  ) : (
    <Link
      href="/pricing"
      className="inline-flex items-center rounded-full border border-pink-500/80 bg-zinc-900 px-3 py-1 text-xs font-medium text-pink-200 hover:border-pink-400 hover:text-pink-100 transition"
    >
      Plan: Free · Choose a plan
    </Link>
  );

  const StatusBadge = (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        status === 'active'
          ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-300'
          : 'border-zinc-700 bg-zinc-900 text-zinc-300'
      }`}
    >
      Status: {status}
    </span>
  );

  // Fetch aggregated stats from v_customer_dashboard_stats
  const { data: statsRow } = await (supabase as any)
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

  // Fetch daily data for sparkline charts from v_customer_articles_daily
  const { data: dailyData } = await (supabase as any)
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
          <div className="flex flex-wrap items-center gap-3">
            {PlanBadge}
            {StatusBadge}
            <Link
              href="/account"
              className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-100 hover:bg-zinc-800 transition"
            >
              Manage account &amp; billing
            </Link>
          </div>
        </header>

        {/* Stats grid (client-rendered) */}
        <DashboardStatsClient
          stats={stats}
          dailyData={dailyData ?? []}
          userId={user.id}
        />

        {/* Quick actions */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-sm font-semibold text-zinc-200">
              Quick actions
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Start by managing topics, editing your writing style, and
              connecting integrations.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/topics"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Manage topics
                <p className="mt-1 text-xs text-zinc-400">
                  Activate or deactivate topics and customize feeds.
                </p>
              </Link>
              <Link
                href="/dashboard/writing"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Writing style
                <p className="mt-1 text-xs text-zinc-400">
                  Adjust tone, length, and other preferences.
                </p>
              </Link>
              <Link
                href="/dashboard/integrations"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Integrations
                <p className="mt-1 text-xs text-zinc-400">
                  Connect Ghost or other platforms for publishing.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// app/dashboard/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function DashboardPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  const [userDetails] = await Promise.all([
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  // Read plan/status from your custom users_table
  const { data: userPlanRow } = await (supabase as any)
    .from('users_table')
    .select('plan, status')
    .eq('id', user.id)
    .maybeSingle();

  const rawPlan = userPlanRow?.plan ?? 'free';
  const status = userPlanRow?.status ?? 'inactive';

  // Normalize plan to lowercase for comparisons
  const planKey = rawPlan.toLowerCase();
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

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
        {/* Header row */}
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

        {/* Stats grid */}
        {/* ... keep your stats components here ... */}

        {/* Quick actions */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h2 className="text-sm font-semibold text-zinc-200">
              Quick actions
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Start by managing topics, editing your writing style, and connecting integrations.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href="/dashboard/topics"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Manage topics
                <p className="mt-1 text-xs text-zinc-400">
                  Activate or deactivate topics and customize feeds.
                </p>
              </a>
              <a
                href="/dashboard/writing"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Writing style
                <p className="mt-1 text-xs text-zinc-400">
                  Adjust tone, length, and other preferences.
                </p>
              </a>
              <a
                href="/dashboard/integrations"
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900/70"
              >
                Integrations
                <p className="mt-1 text-xs text-zinc-400">
                  Connect Ghost or other platforms for publishing.
                </p>
              </a>
            </div>
          </div>

          {/* Recommended setup and account billing panels remain unchanged */}
        </section>
      </div>
    </main>
  );
}

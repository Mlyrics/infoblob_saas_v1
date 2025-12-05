import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function Account() {
  const supabase = createClient();

  // 1. Auth user
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  // 2. Profile + subscription
  const [userDetails, subscription] = await Promise.all([
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  // 3. Plan + status from users_table (using `as any` workaround)
  const { data: userPlanRow } = await (supabase as any)
    .from('users_table')
    .select('plan, status')
    .eq('id', user.id)
    .maybeSingle();

  const rawPlan = (userPlanRow?.plan as string | null) ?? 'free';
  const status = (userPlanRow?.status as string | null) ?? 'inactive';

  const normalizedPlan = rawPlan.toLowerCase();
  const displayPlan =
    normalizedPlan === 'free'
      ? 'Free'
      : normalizedPlan.charAt(0).toUpperCase() + normalizedPlan.slice(1);

  const isAgency = normalizedPlan === 'agency';
  const isPro = normalizedPlan === 'pro';
  const isBasic = normalizedPlan === 'basic';
  const isActive = status === 'active' || status === 'trialing';

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {/* Top header */}
        <div className="flex flex-col gap-4 mb-8 sm:items-center sm:justify-between sm:flex-row">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Agency dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Manage your feeds, clients, and automation from a single place. Billing and profile
              live here too.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-200">
              Plan: {displayPlan}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                isActive
                  ? 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                  : 'border border-zinc-700 bg-zinc-900/70 text-zinc-300'
              }`}
            >
              Status: {status}
            </span>
          </div>
        </div>

        {/* Info banner for non-agency plans */}
        {!isAgency && (
          <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-xs text-zinc-300">
            <span className="font-semibold">
              You&apos;re currently on the {displayPlan} plan.
            </span>{' '}
            Some agency features are locked. Upgrade in the billing section to unlock multiple
            client workspaces and unlimited feeds.
          </div>
        )}

        {/* Main grid: left = dashboard, right = billing/profile */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* LEFT COLUMN – Overview & actions */}
          <div className="space-y-6">
            {/* Overview cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-semibold text-zinc-500 mb-1">
                  Client workspaces
                </p>
                <p className="text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {isAgency
                    ? 'Create separate workspaces for each client brand.'
                    : 'Available on Agency. Use this space for your own brand on this plan.'}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-semibold text-zinc-500 mb-1">
                  Connected feeds
                </p>
                <p className="text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {isAgency
                    ? 'Unlimited feeds across all clients.'
                    : isPro
                    ? 'Up to 3 feeds on Pro. Upgrade to Agency for more.'
                    : 'Start with a few core feeds. Upgrade as you grow.'}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-semibold text-zinc-500 mb-1">
                  Topics configured
                </p>
                <p className="text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Define topics like AI, Cloud, Crypto, Macro. Limits depend on your plan.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-semibold text-zinc-500 mb-1">
                  Posts this month
                </p>
                <p className="text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Once automations are live, you&apos;ll see how many roundups were generated and
                  published here.
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-semibold text-white mb-2">
                Quick actions
              </h2>
              <p className="text-xs text-zinc-400 mb-4">
                Start by setting up your first workspace, adding feeds, and defining topics.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-left font-medium hover:bg-zinc-900 transition"
                  type="button"
                >
                  Create first workspace
                  <p className="mt-1 text-[0.7rem] font-normal text-zinc-400">
                    Organize feeds and topics for a specific client or brand.
                  </p>
                </button>
                <button
                  className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-left font-medium hover:bg-zinc-900 transition"
                  type="button"
                >
                  Add RSS feeds
                  <p className="mt-1 text-[0.7rem] font-normal text-zinc-400">
                    Connect tech & finance sources you want InfoBlob to monitor.
                  </p>
                </button>
                <button
                  className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-left font-medium hover:bg-zinc-900 transition"
                  type="button"
                >
                  Define topics & tone
                  <p className="mt-1 text-[0.7rem] font-normal text-zinc-400">
                    Tell InfoBlob what to prioritize and how you want to sound.
                  </p>
                </button>
                <button
                  className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-left font-medium hover:bg-zinc-900 transition"
                  type="button"
                >
                  Configure publishing
                  <p className="mt-1 text-[0.7rem] font-normal text-zinc-400">
                    Choose destinations like Ghost, WordPress, or custom webhooks.
                  </p>
                </button>
              </div>
            </div>

            {/* Activity placeholder */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-semibold text-white mb-2">
                Activity & upcoming posts
              </h2>
              <p className="text-xs text-zinc-400">
                Once your automations are live, you&apos;ll see a timeline of drafted and published
                posts here, per workspace.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN – Subscription & profile */}
          <div className="space-y-6">
            {/* Subscription / Billing card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <h2 className="text-sm font-semibold text-white mb-2">
                Subscription & billing
              </h2>
              <p className="text-xs text-zinc-400 mb-4">
                Manage your plan, invoices, and payment method through Stripe&apos;s customer
                portal.
              </p>
              <CustomerPortalForm subscription={subscription} />
            </div>

            {/* Name / Email forms */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">
                  Profile
                </h2>
                <p className="text-xs text-zinc-400 mb-3">
                  Update your name and login email. Changes to email will require verification.
                </p>
              </div>
              <NameForm userName={userDetails?.full_name ?? ''} />
              <EmailForm userEmail={user.email} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

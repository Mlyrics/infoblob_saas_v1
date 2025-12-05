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

export default async function AccountPage() {
  const supabase = createClient();

  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  const [userDetails, subscription, userPlanRow] = await Promise.all([
    getUserDetails(supabase),
    getSubscription(supabase),
    (async () => {
      const { data } = await (supabase as any)
        .from('users_table')
        .select('plan, status')
        .eq('id', user.id)
        .maybeSingle();
      return data as { plan?: string | null; status?: string | null } | null;
    })()
  ]);

  const rawPlan = (userPlanRow?.plan as string | null) ?? 'free';
  const status = (userPlanRow?.status as string | null) ?? 'inactive';

  const normalizedPlan = rawPlan.toLowerCase();
  const displayPlan =
    normalizedPlan === 'free'
      ? 'Free'
      : normalizedPlan.charAt(0).toUpperCase() + normalizedPlan.slice(1);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Account &amp; billing
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Update your personal details, manage your subscription, and access billing via Stripe.
          </p>
        </div>

        {/* Subscription summary */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-semibold text-white mb-2">
            Subscription
          </h2>
          <p className="text-sm text-zinc-200">
            <span className="font-medium">Current plan:</span> {displayPlan}
          </p>
          <p className="text-sm text-zinc-200">
            <span className="font-medium">Status:</span> {status}
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            You can upgrade, downgrade, or cancel anytime through the customer portal below.
          </p>
        </div>

        {/* Billing portal */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-semibold text-white mb-2">
            Billing portal
          </h2>
          <p className="text-xs text-zinc-400 mb-3">
            Open the Stripe customer portal to manage payment methods, invoices, and plan changes.
          </p>
          <CustomerPortalForm subscription={subscription} />
        </div>

        {/* Profile settings */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">
              Profile
            </h2>
            <p className="text-xs text-zinc-400 mb-3">
              Update your name and login email. Changing your email may require re-verification.
            </p>
          </div>
          <NameForm userName={userDetails?.full_name ?? ''} />
          <EmailForm userEmail={user.email} />
        </div>
      </section>
    </main>
  );
}

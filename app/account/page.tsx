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

  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  const [userDetails, subscription] = await Promise.all([
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  // 🔹 use `as any` here to avoid TS complaining about users_table
  const { data: userPlanRow } = await (supabase as any)
    .from('users_table')
    .select('plan, status')
    .eq('id', user.id)
    .maybeSingle();

  const plan = userPlanRow?.plan ?? 'free';
  const status = userPlanRow?.status ?? 'inactive';

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>

      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8 pb-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-2">
            Subscription
          </h2>
          <p className="text-zinc-200">
            <span className="font-medium">Plan:</span> {plan}
          </p>
          <p className="text-zinc-200">
            <span className="font-medium">Status:</span> {status}
          </p>

          {plan === 'Agency' && (
            <p className="mt-3 text-sm text-emerald-400">
              🔥 Agency plan – all features unlocked.
            </p>
          )}
          {(plan === 'Pro' || plan === 'Agency') && (
            <p className="mt-1 text-sm text-yellow-400">
              ⭐ Pro+ features enabled.
            </p>
          )}
          {plan === 'Basic' && (
            <p className="mt-1 text-sm text-zinc-400">
              🙂 Basic plan – limited topics. Upgrade to unlock more.
            </p>
          )}
          {plan === 'free' && (
            <p className="mt-1 text-sm text-red-400">
              ⚠ No active subscription. Choose a plan to start using InfoBlob.
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}

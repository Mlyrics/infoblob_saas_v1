// app/dashboard/integrations/page.tsx
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const IntegrationListClient = dynamic(() => import('./IntegrationListClient'), {
  ssr: false
});

export default async function IntegrationsPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  const { data: planRow } = await (supabase as any)
    .from('users_table')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();
  const plan = planRow?.plan ?? 'free';

  const { data: integrations } = await (supabase as any)
    .from('customer_integrations')
    .select('channel, is_active, config')
    .eq('customer_id', user.id);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Integrations</h1>
      <IntegrationListClient
        integrations={integrations ?? []}
        plan={plan}
        userId={user.id}
      />
    </div>
  );
}


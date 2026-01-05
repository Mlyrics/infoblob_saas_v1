// app/dashboard/integrations/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getUser } from '@/utils/supabase/queries';

// Client-only IntegrationList component
const IntegrationListClient = dynamic(
  () => import('./IntegrationListClient'),
  { ssr: false },
);

export default async function IntegrationsPage() {
  const supabase: any = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin');
  }

  // Fetch plan
  const { data: planRow } = await supabase
    .from('customers')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();

  const plan = (planRow?.plan ?? 'basic').toLowerCase();

  // Fetch existing integrations for the user
  const { data: integrations } = await supabase
    .from('customer_integrations')
    .select('*')
    .eq('customer_id', user.id);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Integrations</h1>
      <IntegrationListClient
        integrations={integrations ?? []}
        plan={plan}
        userId={user.id}
      />
    </div>
  );
}

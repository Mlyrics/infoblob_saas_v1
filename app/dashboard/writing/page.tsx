// app/dashboard/writing/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getUser } from '@/utils/supabase/queries';

// Lazy load the form for client-side gating (no SSR)
const WritingPrefsForm = dynamic(() => import('./WritingPrefsForm'), {
  ssr: false,
});

export default async function WritingPage() {
  // Cast Supabase client to any to avoid type errors with views
  const supabase: any = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin');
  }

  // Fetch plan from customers
  const { data: planRow } = await supabase
    .from('customers')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();

  const plan = (planRow?.plan ?? 'basic').toLowerCase();

  // Fetch writing preferences and personality preset
  const { data: prefsRow } = await supabase
    .from('users_table')
    .select('writing_prefs, personality_preset')
    .eq('id', user.id)
    .maybeSingle();

  const initialPrefs = prefsRow?.writing_prefs ?? {
    tone: 'neutral',
    format: 'bullets_then_takeaway',
    audience: 'general',
    length: 'short',
    stance: 'strictly_neutral',
    emoji: 'none',
    cta: 'read_more',
  };
  const preset = prefsRow?.personality_preset ?? 'executive_brief';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Writing preferences</h1>
      <WritingPrefsForm
        initialPrefs={initialPrefs}
        initialPreset={preset}
        userId={user.id}
        plan={plan}
      />
    </div>
  );
}

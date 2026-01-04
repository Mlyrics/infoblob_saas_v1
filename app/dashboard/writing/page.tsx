// app/dashboard/writing/page.tsx
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const WritingPrefsForm = dynamic(() => import('./WritingPrefsForm'), {
  ssr: false,
});

export default async function WritingPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  const { data: userRow } = await (supabase as any)
    .from('users_table')
    .select('writing_prefs, personality_preset, plan')
    .eq('id', user.id)
    .maybeSingle();

  const prefs = userRow?.writing_prefs ?? {
    tone: 'neutral',
    format: 'bullets_then_takeaway',
    audience: 'general',
    length: 'short',
    stance: 'strictly_neutral',
    emoji: 'none',
    cta: 'read_more',
  };
  const preset = userRow?.personality_preset ?? 'executive_brief';
  const plan = userRow?.plan ?? 'free';

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Writing preferences</h1>
      <WritingPrefsForm
        initialPrefs={prefs}
        initialPreset={preset}
        userId={user.id}
        plan={plan}
      />
    </div>
  );
}

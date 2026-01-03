// app/dashboard/topics/page.tsx
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const TopicListClient = dynamic(() => import('./TopicListClient'), {
  ssr: false
});

export default async function TopicsPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  // Load plan from users_table
  const { data: planRow } = await (supabase as any)
    .from('users_table')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();
  const plan = planRow?.plan ?? 'free';

  const { data: topics } = await (supabase as any)
    .from('topics')
    .select('code, label')
    .order('label');
  const { data: userTopics } = await (supabase as any)
    .from('customer_topics')
    .select('topic_code, is_active, custom_tags, rss_url')
    .eq('customer_id', user.id);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Topics</h1>
      <TopicListClient
        topics={topics ?? []}
        userTopics={userTopics ?? []}
        plan={plan}
        userId={user.id}
      />
    </div>
  );
}


// app/dashboard/page.tsx
import dynamic from 'next/dynamic';
// ... existing imports for user/plan fetching ...

const DashboardStatsClient = dynamic(
  () => import('./DashboardStatsClient'),
  { ssr: false },
);

export default async function DashboardPage() {
  const supabase = createClient();
  const user = await getUser(supabase);
  if (!user) {
    return redirect('/signin');
  }

  // fetch plan/status as before …

  // Fetch the summary stats
  const { data: statsRow } = await supabase
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

  // Fetch daily trend data
  const { data: dailyData } = await supabase
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
        {/* existing header, plan/status badges, etc. */}

        {/* Stats grid */}
        <DashboardStatsClient
          stats={stats}
          dailyData={dailyData ?? []}
          userId={user.id}
        />

        {/* existing Quick actions & other sections */}
      </div>
    </main>
  );
}

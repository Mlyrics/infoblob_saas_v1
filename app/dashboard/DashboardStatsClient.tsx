// app/dashboard/DashboardStatsClient.tsx
'use client';

import { useState } from 'react';
import Sparkline from './Sparkline';
import StatDetailModal from './StatDetailModal';

interface Props {
  stats: {
    articlesGenerated: number;
    articlesDelivered: number;
    activeTopics: number;
    activeIntegrations: number;
    aiCredits: number;
  };
  dailyData: {
    day: string;
    generated: number;
    delivered: number;
  }[];
  userId: string;
}

/**
 * Renders a grid of five clickable stat cards with sparkline charts,
 * and opens a modal on click.
 */
export default function DashboardStatsClient({
  stats,
  dailyData,
  userId,
}: Props) {
  const generatedTrend = dailyData.map((row) => ({
    date: row.day,
    value: row.generated,
  }));
  const deliveredTrend = dailyData.map((row) => ({
    date: row.day,
    value: row.delivered,
  }));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<
    'generated' | 'delivered' | 'topics' | 'integrations' | 'aiCredits' | null
  >(null);

  const openModal = (stat: any) => {
    setSelectedStat(stat);
    setModalOpen(true);
  };

  return (
    <>
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div
          className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
          onClick={() => openModal('generated')}
        >
          <p className="text-xs text-zinc-400">Articles generated (30d)</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-100">
              {stats.articlesGenerated}
            </span>
            <Sparkline data={generatedTrend} />
          </div>
        </div>
        <div
          className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
          onClick={() => openModal('delivered')}
        >
          <p className="text-xs text-zinc-400">Articles delivered (30d)</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-100">
              {stats.articlesDelivered}
            </span>
            <Sparkline data={deliveredTrend} stroke="#f97316" />
          </div>
        </div>
        <div
          className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
          onClick={() => openModal('topics')}
        >
          <p className="text-xs text-zinc-400">Active topics</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-100">
              {stats.activeTopics}
            </span>
          </div>
        </div>
        <div
          className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
          onClick={() => openModal('integrations')}
        >
          <p className="text-xs text-zinc-400">Integrations connected</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-100">
              {stats.activeIntegrations}
            </span>
          </div>
        </div>
        <div
          className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
          onClick={() => openModal('aiCredits')}
        >
          <p className="text-xs text-zinc-400">AI credits used (30d)</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-100">
              {stats.aiCredits}
            </span>
          </div>
        </div>
      </section>

      {/* Modal */}
      <StatDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        statType={selectedStat}
        userId={userId}
      />
    </>
  );
}

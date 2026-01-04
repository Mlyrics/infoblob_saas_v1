// app/dashboard/StatDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  statType:
    | 'generated'
    | 'delivered'
    | 'topics'
    | 'integrations'
    | 'aiCredits'
    | null;
  userId: string;
}

/**
 * StatDetailModal shows a list of items for a selected stat:
 *  - generated / delivered: counts articles grouped by topic and subtopic.
 *  - topics: lists active topics.
 *  - integrations: lists active integrations.
 *  - aiCredits: reserved for future expansion.
 */
export default function StatDetailModal({
  open,
  onClose,
  statType,
  userId,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<
    Array<{ topic_code?: string; subtopic?: string | null; count?: number; channel?: string; is_active?: boolean; config?: any }>
  >([]);

  useEffect(() => {
    if (!open || !statType) {
      setItems([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      const supabase: any = createClient();

      if (statType === 'generated') {
        // Fetch all articles created in the last 30 days (no distributed filter)
        const { data, error } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic')
          .eq('customer_id', userId)
          .gte(
            'created_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          );
        if (error) {
          console.error(error);
          setItems([]);
        } else if (data) {
          const map: { [key: string]: number } = {};
          data.forEach((row: any) => {
            const key = `${row.topic_code}|${row.subtopic || ''}`;
            map[key] = (map[key] || 0) + 1;
          });
          const grouped = Object.entries(map).map(([key, count]) => {
            const [topic_code, subtopic] = key.split('|');
            return { topic_code, subtopic: subtopic || null, count };
          });
          setItems(grouped);
        }
      } else if (statType === 'delivered') {
        // Fetch only distributed articles created within the last 30 days
        const { data, error } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic')
          .eq('customer_id', userId)
          .eq('distributed', true)
          .gte(
            'distributed_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          );
        if (error) {
          console.error(error);
          setItems([]);
        } else if (data) {
          const map: { [key: string]: number } = {};
          data.forEach((row: any) => {
            const key = `${row.topic_code}|${row.subtopic || ''}`;
            map[key] = (map[key] || 0) + 1;
          });
          const grouped = Object.entries(map).map(([key, count]) => {
            const [topic_code, subtopic] = key.split('|');
            return { topic_code, subtopic: subtopic || null, count };
          });
          setItems(grouped);
        }
      } else if (statType === 'topics') {
        const { data } = await supabase
          .from('customer_topics')
          .select('topic_code, custom_tags, rss_url, is_active')
          .eq('customer_id', userId)
          .eq('is_active', true);
        setItems(data ?? []);
      } else if (statType === 'integrations') {
        const { data } = await supabase
          .from('customer_integrations')
          .select('channel, is_active, config')
          .eq('customer_id', userId)
          .eq('is_active', true);
        setItems(data ?? []);
      } else {
        // aiCredits or unsupported type
        setItems([]);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [open, statType, userId]);

  // Titles for each stat type
  const titleMap: Record<string, string> = {
    generated: 'Articles generated (30d)',
    delivered: 'Articles delivered (30d)',
    topics: 'Active topics',
    integrations: 'Active integrations',
    aiCredits: 'AI credits used (30d)',
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {statType ? titleMap[statType] : ''}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-900"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            {loading && <p className="mt-4 text-center">Loading…</p>}
            {!loading && (
              <div className="mt-4 max-h-80 space-y-2 overflow-y-auto text-sm">
                {items.length === 0 ? (
                  <p>No data available.</p>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b border-zinc-800 pb-1"
                    >
                      <span>
                        {item.topic_code ?? item.channel ?? ''}
                        {item.subtopic ? ` / ${item.subtopic}` : ''}
                      </span>
                      <span className="font-semibold">
                        {item.count ?? item.is_active ? (item.count ?? '✓') : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

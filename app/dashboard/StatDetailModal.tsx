// app/dashboard/StatDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  statType: 'generated' | 'delivered' | 'topics' | 'integrations' | 'aiCredits' | null;
  userId: string;
}

export default function StatDetailModal({
  open,
  onClose,
  statType,
  userId,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !statType) {
      setItems([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      const supabase = createClient();
      if (statType === 'generated') {
        const { data } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic, count:count(*)')
          .eq('customer_id', userId)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .group('topic_code, subtopic');
        setItems(data ?? []);
      } else if (statType === 'delivered') {
        const { data } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic, count:count(*)')
          .eq('customer_id', userId)
          .eq('distributed', true)
          .gte('distributed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .group('topic_code, subtopic');
        setItems(data ?? []);
      } else if (statType === 'topics') {
      // Example: list active topics
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
        setItems([]);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [open, statType, userId]);

  const titleMap: Record<string, string> = {
    generated: 'Articles generated (30d)',
    delivered: 'Articles delivered (30d)',
    topics: 'Active topics',
    integrations: 'Active integrations',
    aiCredits: 'AI credits (30d)',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{statType ? titleMap[statType] : ''}</DialogTitle>
        </DialogHeader>
        {loading && <p className="mt-4 text-center">Loading…</p>}
        {!loading && (
          <div className="mt-4 space-y-2 max-h-80 overflow-y-auto text-sm">
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
                    {item.count ?? item.is_active ? '✓' : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

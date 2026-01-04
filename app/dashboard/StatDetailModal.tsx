// app/dashboard/StatDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
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
      // Cast supabase to any to bypass table-type restrictions
      const supabase: any = createClient();
      if (statType === 'generated') {
        const { data } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic, count:count(*)')
          .eq('customer_id', userId)
          .gte(
            'created_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          )
          .group('topic_code, subtopic');
        setItems(data ?? []);
      } else if (statType === 'delivered') {
        const { data } = await supabase
          .from('customer_article')
          .select('topic_code, subtopic, count:count(*)')
          .eq('customer_id', userId)
          .eq('distributed', true)
          .gte(
            'distributed_at',
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          )
          .group('topic_code, subtopic');
        setItems(data ?? []);
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
        setItems([]);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [open, statType, userId]);

  const titleMap: Record<string, string> = {
  ...

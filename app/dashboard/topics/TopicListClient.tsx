// app/dashboard/topics/TopicListClient.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Topic = {
  code: string;
  label: string;
};
type UserTopic = {
  topic_code: string;
  is_active: boolean | null;
  custom_tags: string | null;
  rss_url: string | null;
};

interface Props {
  topics: Topic[];
  userTopics: UserTopic[];
  plan: string;
  userId: string;
}

/**
 * Client-side component for managing topics.  Free users may activate up to 3 topics and cannot set custom RSS or tags.
 */
export default function TopicListClient({
  topics,
  userTopics,
  plan,
  userId
}: Props) {
  // Cast supabase to any to allow calling tables not included in the generated types
  const supabase: any = createClient();
  const initialMap: Record<
    string,
    { is_active: boolean; custom_tags: string; rss_url: string }
  > = {};
  userTopics.forEach((t) => {
    initialMap[t.topic_code] = {
      is_active: t.is_active ?? false,
      custom_tags: t.custom_tags ?? '',
      rss_url: t.rss_url ?? ''
    };
  });
  const [state, setState] = useState<Record<
    string,
    { is_active: boolean; custom_tags: string; rss_url: string }
  >>(() => {
    const obj: Record<
      string,
      { is_active: boolean; custom_tags: string; rss_url: string }
    > = {};
    topics.forEach((topic) => {
      const found = initialMap[topic.code];
      obj[topic.code] = found ?? {
        is_active: false,
        custom_tags: '',
        rss_url: ''
      };
    });
    return obj;
  });
  const isFree = plan?.toLowerCase() === 'free';
  const activeCount = Object.values(state).filter((t) => t.is_active).length;

  async function upsertTopic(
    code: string,
    fields: { is_active: boolean; custom_tags?: string; rss_url?: string }
  ) {
    const updates: any = {
      customer_id: userId,
      topic_code: code,
      is_active: fields.is_active
    };
    if (fields.custom_tags !== undefined) {
      updates.custom_tags = fields.custom_tags || null;
    }
    if (fields.rss_url !== undefined) {
      updates.rss_url = fields.rss_url || null;
    }
    const { error } = await supabase.from('customer_topics').upsert(updates);
    if (error) {
      console.error('Failed to update topic', error);
    }
  }

  const handleToggle = async (code: string) => {
    const current = state[code];
    const newValue = !current.is_active;
    if (isFree && newValue && activeCount >= 3) {
      alert('Free plan allows up to 3 active topics. Please upgrade for more.');
      return;
    }
    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], is_active: newValue }
    }));
    await upsertTopic(code, { is_active: newValue });
  };

  const handleCustomTagsChange = async (code: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], custom_tags: value }
    }));
    await upsertTopic(code, {
      is_active: state[code].is_active,
      custom_tags: value
    });
  };

  const handleRssChange = async (code: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], rss_url: value }
    }));
    await upsertTopic(code, {
      is_active: state[code].is_active,
      rss_url: value
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {topics.map((topic) => {
        const data = state[topic.code];
        const disabled =
          isFree && !data.is_active && activeCount >= 3 ? true : false;
        return (
          <div
            key={topic.code}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">
                {topic.label}
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-400">Active</label>
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={() => handleToggle(topic.code)}
                  disabled={disabled}
                />
              </div>
            </div>
            {data.is_active && !isFree && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Custom RSS URL
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
                    placeholder="Override default feed URL"
                    value={data.rss_url}
                    onChange={(e) =>
                      handleRssChange(topic.code, e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Custom tags (comma separated)
                  </label>
                  <input
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
                    placeholder="e.g. ai, cloud"
                    value={data.custom_tags}
                    onChange={(e) =>
                      handleCustomTagsChange(topic.code, e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {data.is_active && isFree && (
              <p className="mt-3 text-xs text-zinc-500">
                Custom RSS and tags are only available on the Pro plan.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

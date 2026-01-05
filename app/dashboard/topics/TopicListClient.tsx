// app/dashboard/topics/TopicListClient.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  plan: string; // expects "basic" or "pro" now
  userId: string;
}

export default function TopicListClient({
  topics,
  userTopics,
  plan,
  userId,
}: Props) {
  const supabase: any = createClient();

  const isPro = (plan ?? '').toLowerCase() === 'pro';
  const isBasic = !isPro; // anything not "pro" behaves as basic

  // Basic limit: 3 active topics
  const maxActiveTopics = isBasic ? 3 : Number.POSITIVE_INFINITY;

  // Build initial state map from userTopics
  const initialMap: Record<
    string,
    { is_active: boolean; custom_tags: string; rss_url: string }
  > = {};
  userTopics.forEach((t) => {
    initialMap[t.topic_code] = {
      is_active: t.is_active ?? false,
      custom_tags: t.custom_tags ?? '',
      rss_url: t.rss_url ?? '',
    };
  });

  const [state, setState] = useState<
    Record<string, { is_active: boolean; custom_tags: string; rss_url: string }>
  >(() => {
    const obj: Record<
      string,
      { is_active: boolean; custom_tags: string; rss_url: string }
    > = {};
    topics.forEach((topic) => {
      const found = initialMap[topic.code];
      obj[topic.code] =
        found ??
        ({
          is_active: false,
          custom_tags: '',
          rss_url: '',
        } as const);
    });
    return obj;
  });

  const activeCount = useMemo(
    () => Object.values(state).filter((t) => t.is_active).length,
    [state],
  );

  // Upsert helper
  async function upsertTopic(
    code: string,
    fields: { is_active: boolean; custom_tags?: string; rss_url?: string },
  ) {
    const updates: any = {
      customer_id: userId,
      topic_code: code,
      is_active: fields.is_active,
    };
    if (fields.custom_tags !== undefined) {
      updates.custom_tags = fields.custom_tags?.trim() ? fields.custom_tags : null;
    }
    if (fields.rss_url !== undefined) {
      updates.rss_url = fields.rss_url?.trim() ? fields.rss_url : null;
    }

    const { error } = await supabase.from('customer_topics').upsert(updates, {
      onConflict: 'customer_id,topic_code',
    });

    if (error) {
      console.error('Failed to update topic', error);
      // optional: revert UI state if you want strict consistency
    }
  }

  const handleToggle = async (code: string) => {
    const current = state[code];
    const newValue = !current.is_active;

    // Enabling when already at limit (basic)
    if (isBasic && newValue && activeCount >= maxActiveTopics) {
      alert(
        `Basic plan allows up to ${maxActiveTopics} active topics. Upgrade to Pro for unlimited topics.`,
      );
      return;
    }

    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], is_active: newValue },
    }));

    await upsertTopic(code, { is_active: newValue });
  };

  const handleCustomTagsChange = (code: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], custom_tags: value },
    }));
  };

  const handleCustomTagsBlur = async (code: string) => {
    await upsertTopic(code, {
      is_active: state[code].is_active,
      custom_tags: state[code].custom_tags,
    });
  };

  const handleRssChange = (code: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [code]: { ...prev[code], rss_url: value },
    }));
  };

  const handleRssBlur = async (code: string) => {
    await upsertTopic(code, {
      is_active: state[code].is_active,
      rss_url: state[code].rss_url,
    });
  };

  const showUpgradeBanner = isBasic;

  return (
    <div className="space-y-4">
      {/* Plan gate notice */}
      {showUpgradeBanner && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">
                Basic plan limits
              </div>
              <ul className="mt-1 text-xs text-white/70 list-disc pl-4 space-y-1">
                <li>Up to {maxActiveTopics} active topics</li>
                <li>Custom RSS overrides and custom tags are Pro-only</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-500"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => {
          const data = state[topic.code];

          // Disable toggle ONLY when trying to turn ON beyond limit
          const disableToggle =
            isBasic && !data.is_active && activeCount >= maxActiveTopics;

          // Disable Pro-only fields on basic
          const proOnlyDisabled = isBasic;

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
                    disabled={disableToggle}
                    aria-disabled={disableToggle}
                  />
                </div>
              </div>

              {/* Pro-only fields: show when active, but disabled on basic */}
              {data.is_active && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Custom RSS URL{' '}
                      {!isPro && (
                        <span className="ml-1 text-[10px] text-pink-400">
                          Pro
                        </span>
                      )}
                    </label>
                    <input
                      className={`w-full rounded-md border px-2 py-1 text-sm text-zinc-100 ${
                        proOnlyDisabled
                          ? 'border-zinc-800 bg-zinc-950/40 opacity-60 cursor-not-allowed'
                          : 'border-zinc-700 bg-zinc-900'
                      }`}
                      placeholder="Override default feed URL"
                      value={data.rss_url}
                      onChange={(e) => handleRssChange(topic.code, e.target.value)}
                      onBlur={() => handleRssBlur(topic.code)}
                      disabled={proOnlyDisabled}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      Custom tags (comma separated){' '}
                      {!isPro && (
                        <span className="ml-1 text-[10px] text-pink-400">
                          Pro
                        </span>
                      )}
                    </label>
                    <input
                      className={`w-full rounded-md border px-2 py-1 text-sm text-zinc-100 ${
                        proOnlyDisabled
                          ? 'border-zinc-800 bg-zinc-950/40 opacity-60 cursor-not-allowed'
                          : 'border-zinc-700 bg-zinc-900'
                      }`}
                      placeholder="e.g. ai, cloud"
                      value={data.custom_tags}
                      onChange={(e) =>
                        handleCustomTagsChange(topic.code, e.target.value)
                      }
                      onBlur={() => handleCustomTagsBlur(topic.code)}
                      disabled={proOnlyDisabled}
                    />
                  </div>

                  {/* Inline upgrade hint (only on basic) */}
                  {isBasic && (
                    <p className="text-xs text-zinc-500">
                      Upgrade to Pro to customize RSS overrides and tags.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// app/dashboard/integrations/IntegrationListClient.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import UpgradeNotice from '../UpgradeNotice';

interface Integration {
  channel: string;
  is_active: boolean;
  config: any;
}

interface Props {
  integrations: Integration[];
  plan: string;
  userId: string;
}

/**
 * IntegrationListClient renders toggles for integrations and enforces plan gating:
 * Basic can only enable Ghost (one integration).
 * Pro can enable any integrations allowed by your plan rules.
 */
export default function IntegrationListClient({
  integrations,
  plan,
  userId,
}: Props) {
  const supabase: any = createClient();
  const isPro = (plan ?? '').toLowerCase() === 'pro';
  const isBasic = !isPro;

  // State keyed by channel
  const initialState: Record<string, Integration> = {};
  ['ghost', 'twitter', 'wordpress', 'webhook'].forEach((ch) => {
    const found = integrations.find((i) => i.channel === ch);
    initialState[ch] = {
      channel: ch,
      is_active: found?.is_active ?? false,
      config: found?.config ?? {},
    };
  });
  const [state, setState] = useState<Record<string, Integration>>(initialState);

  const activeCount = Object.values(state).filter((i) => i.is_active).length;

  const handleToggle = async (channel: string) => {
    const current = state[channel];
    const nextActive = !current.is_active;

    // BASIC gating: only Ghost allowed; max one integration
    if (isBasic) {
      if (channel !== 'ghost') {
        alert('Upgrade to Pro to enable this integration.');
        return;
      }
      if (nextActive && activeCount >= 1) {
        alert('Basic plan allows only one integration (Ghost).');
        return;
      }
    }

    // Update UI state
    setState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], is_active: nextActive },
    }));

    // Persist to Supabase
    const payload = {
      customer_id: userId,
      channel,
      is_active: nextActive,
      config: current.config ?? {},
    };
    const { error } = await supabase
      .from('customer_integrations')
      .upsert(payload, { onConflict: 'customer_id,channel' });
    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {!isPro && (
        <UpgradeNotice message="Basic plan allows only one integration (Ghost). Upgrade to Pro for more integrations." />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {['ghost', 'wordpress', 'twitter', 'webhook'].map((channel) => {
          const integration = state[channel];
          const isGhost = channel === 'ghost';
          const disabled = isBasic && !isGhost;

          return (
            <div
              key={channel}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold capitalize text-zinc-100">
                  {channel}
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-400">Enabled</label>
                  <input
                    type="checkbox"
                    checked={integration.is_active}
                    onChange={() => handleToggle(channel)}
                    disabled={disabled}
                    aria-disabled={disabled}
                  />
                </div>
              </div>
              {disabled && (
                <p className="mt-1 text-xs text-zinc-500">
                  Pro plan required for this integration.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

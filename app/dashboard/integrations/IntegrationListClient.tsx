'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import GhostConfigModal from './GhostConfigModal';

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
 * Client component for displaying and toggling integrations.
 * Free plans can enable only the Ghost integration.  Pro plans can enable more.
 */
export default function IntegrationListClient({
  integrations,
  plan,
  userId,
}: Props) {
  const supabase: any = createClient();
  const isFree = plan?.toLowerCase() === 'free';
  const channels = ['ghost', 'wordpress', 'twitter', 'webhook'];

  // Initialize state with is_active and config per channel
  const initialState: Record<string, { is_active: boolean; config: any }> = {};
  channels.forEach((ch) => {
    const found = integrations.find((i) => i.channel === ch);
    initialState[ch] = {
      is_active: found?.is_active ?? false,
      config: found?.config ?? {},
    };
  });
  const [state, setState] = useState(initialState);

  // State for Ghost configuration modal
  const [ghostModalOpen, setGhostModalOpen] = useState(false);

  // Upsert with onConflict set to (customer_id, channel)
  async function upsertIntegration(
    channel: string,
    fields: { is_active: boolean; config?: any },
  ) {
    const updates: any = {
      customer_id: userId,
      channel,
      is_active: fields.is_active,
    };
    if (fields.config !== undefined) {
      updates.config = fields.config;
    }
    const { error } = await supabase
      .from('customer_integrations')
      .upsert(updates, {
        onConflict: 'customer_id,channel',
      });
    if (error) {
      console.error('Failed to update integration', error);
    }
  }

  // Toggle handler: enforces free-plan rules and opens modal for Ghost
  const handleToggle = async (channel: string) => {
    const current = state[channel];
    const newValue = !current.is_active;

    if (isFree && channel !== 'ghost' && newValue) {
      alert(
        'The Free plan supports only the Ghost integration. Upgrade to enable more.',
      );
      return;
    }

    // If enabling Ghost and no config saved, show the modal
    if (channel === 'ghost' && newValue) {
      const existingConfig = state.ghost?.config || {};
      if (
        !existingConfig.api_url ||
        !existingConfig.admin_key ||
        !existingConfig.content_id
      ) {
        setGhostModalOpen(true);
        return;
      }
    }

    // Update local state and persist
    setState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], is_active: newValue },
    }));
    await upsertIntegration(channel, { is_active: newValue });
  };

  // When user saves Ghost settings
  const handleGhostSave = async (config: {
    api_url: string;
    admin_key: string;
    content_id: string;
  }) => {
    setGhostModalOpen(false);
    // Update local state
    setState((prev) => ({
      ...prev,
      ghost: { is_active: true, config },
    }));
    // Persist with config and is_active=true
    await upsertIntegration('ghost', {
      is_active: true,
      config,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {channels.map((channel) => {
        const integration = state[channel];
        const disabled = isFree && channel !== 'ghost';
        return (
          <div
            key={channel}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
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
                />
              </div>
            </div>
            {disabled && (
              <p className="mt-2 text-xs text-zinc-500">
                Pro plan required to enable this integration.
              </p>
            )}
          </div>
        );
      })}
      {/* Ghost configuration modal */}
      <GhostConfigModal
        open={ghostModalOpen}
        onClose={() => setGhostModalOpen(false)}
        onSave={handleGhostSave}
        initialConfig={state.ghost?.config}
      />
    </div>
  );
}

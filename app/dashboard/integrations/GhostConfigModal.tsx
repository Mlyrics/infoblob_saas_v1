// app/dashboard/integrations/GhostConfigModal.tsx
'use client';

import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (config: { api_url: string; admin_key: string; content_id: string }) => void;
  initialConfig?: {
    api_url?: string;
    admin_key?: string;
    content_id?: string;
  };
}

export default function GhostConfigModal({
  open,
  onClose,
  onSave,
  initialConfig = {}
}: Props) {
  const [apiUrl, setApiUrl] = useState(initialConfig.api_url || '');
  const [adminKey, setAdminKey] = useState(initialConfig.admin_key || '');
  const [contentId, setContentId] = useState(initialConfig.content_id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      api_url: apiUrl,
      admin_key: adminKey,
      content_id: contentId
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold text-white">Configure Ghost</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">API URL</label>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
              required
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-site.ghost.io"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Admin Key</label>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
              required
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Ghost Admin API key"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Content ID</label>
            <input
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
              required
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
              placeholder="Ghost integration ID"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-100"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// app/dashboard/writing/WritingPrefsForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface WritingPrefs {
  tone: string;
  format: string;
  audience: string;
  length: string;
  stance: string;
  emoji: string;
  cta: string;
}

interface Props {
  initialPrefs: WritingPrefs;
  initialPreset: string;
  userId: string;
}

export default function WritingPrefsForm({
  initialPrefs,
  initialPreset,
  userId
}: Props) {
  const supabase: any = createClient();
  const [prefs, setPrefs] = useState<WritingPrefs>(initialPrefs);
  const [preset, setPreset] = useState<string>(initialPreset);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: keyof WritingPrefs, value: string) => {
    setPrefs((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from('users_table')
      .update({
        writing_prefs: prefs,
        personality_preset: preset
      })
      .eq('id', userId);
    setSaving(false);
    if (error) {
      setMessage('Error saving preferences: ' + error.message);
    } else {
      setMessage('Preferences updated successfully.');
    }
  };

  return (
    <form
      className="space-y-4 max-w-xl"
      onSubmit={handleSubmit}
    >
      {/* Tone */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Tone</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.tone}
          onChange={(e) => handleChange('tone', e.target.value)}
        >
          <option value="neutral">Neutral</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="playful">Playful</option>
        </select>
      </div>

      {/* Format */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Format</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.format}
          onChange={(e) => handleChange('format', e.target.value)}
        >
          <option value="bullets_then_takeaway">Bullets then takeaway</option>
          <option value="paragraph">Paragraph</option>
        </select>
      </div>

      {/* Audience */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Audience</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          placeholder="general, technical, etc."
          value={prefs.audience}
          onChange={(e) => handleChange('audience', e.target.value)}
        />
      </div>

      {/* Length */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Length</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.length}
          onChange={(e) => handleChange('length', e.target.value)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Stance */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Stance</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.stance}
          onChange={(e) => handleChange('stance', e.target.value)}
        >
          <option value="strictly_neutral">Strictly neutral</option>
          <option value="positive">Positive</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Emoji */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">Emoji</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.emoji}
          onChange={(e) => handleChange('emoji', e.target.value)}
        >
          <option value="none">None</option>
          <option value="minimal">Minimal</option>
          <option value="frequent">Frequent</option>
        </select>
      </div>

      {/* CTA */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">
          Call to action
        </label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          placeholder="read_more, subscribe, etc."
          value={prefs.cta}
          onChange={(e) => handleChange('cta', e.target.value)}
        />
      </div>

      {/* Personality preset */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">
          Personality preset
        </label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          placeholder="executive_brief"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-100 transition"
      >
        {saving ? 'Saving...' : 'Save preferences'}
      </button>

      {message && <p className="text-xs text-zinc-400 mt-2">{message}</p>}
    </form>
  );
}

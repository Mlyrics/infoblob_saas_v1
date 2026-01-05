// app/dashboard/writing/WritingPrefsForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import UpgradeNotice from '../UpgradeNotice';

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
  plan: string;
}

/**
 * Writing preferences form.  Basic plan users can only edit Tone;
 * all other fields are disabled and an upgrade notice is shown instead of the save button.
 */
export default function WritingPrefsForm({
  initialPrefs,
  initialPreset,
  userId,
  plan,
}: Props) {
  const supabase: any = createClient();
  const [prefs, setPrefs] = useState<WritingPrefs>(initialPrefs);
  const [preset, setPreset] = useState<string>(initialPreset);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isPro = (plan ?? '').toLowerCase() === 'pro';
  const isBasic = !isPro;

  const handleChange = (field: keyof WritingPrefs, value: string) => {
    setPrefs((prev) => ({
      ...prev,
      [field]: value,
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
        personality_preset: preset,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tone (editable on both plans) */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Tone</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.tone}
          onChange={(e) => handleChange('tone', e.target.value)}
        >
          <option value="neutral">Neutral</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="playful">Playful</option>
        </select>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Format</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.format}
          onChange={(e) => handleChange('format', e.target.value)}
          disabled={isBasic}
        >
          <option value="bullets_then_takeaway">Bullets then takeaway</option>
          <option value="paragraph">Paragraph</option>
        </select>
      </div>

      {/* Audience */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Audience</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.audience}
          onChange={(e) => handleChange('audience', e.target.value)}
          disabled={isBasic}
          placeholder="general, technical, etc."
        />
      </div>

      {/* Length */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Length</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.length}
          onChange={(e) => handleChange('length', e.target.value)}
          disabled={isBasic}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Stance */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Stance</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.stance}
          onChange={(e) => handleChange('stance', e.target.value)}
          disabled={isBasic}
        >
          <option value="strictly_neutral">Strictly neutral</option>
          <option value="positive">Positive</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Emoji */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Emoji</label>
        <select
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.emoji}
          onChange={(e) => handleChange('emoji', e.target.value)}
          disabled={isBasic}
        >
          <option value="none">None</option>
          <option value="minimal">Minimal</option>
          <option value="frequent">Frequent</option>
        </select>
      </div>

      {/* Call to Action */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Call to action</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={prefs.cta}
          onChange={(e) => handleChange('cta', e.target.value)}
          disabled={isBasic}
          placeholder="read_more, subscribe, etc."
        />
      </div>

      {/* Personality preset */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Personality preset</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          disabled={isBasic}
          placeholder="executive_brief"
        />
      </div>

      {/* Save button or upgrade notice */}
      {isBasic ? (
        <UpgradeNotice message="Editing writing preferences beyond Tone is a Pro feature." />
      ) : (
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-100 transition"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      )}

      {message && <p className="text-xs text-zinc-400 mt-2">{message}</p>}
    </form>
  );
}

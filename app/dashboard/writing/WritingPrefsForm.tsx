// app/dashboard/writing/WritingPrefsForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import UpgradeNotice from '../UpgradeNotice';
import {
  Music,
  List,
  Users,
  Ruler,
  Scale,
  Smile,
  Megaphone,
  Brain,
} from 'lucide-react';

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

  // Helper for disabled styling
  function disabledClasses(disabled: boolean) {
    return disabled
      ? 'border-zinc-800 bg-zinc-950 opacity-60 cursor-not-allowed'
      : 'border-zinc-700 bg-zinc-900';
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card wrapper with header */}
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Customize your digest
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Choose how InfoBlob should craft your summaries and digests.
          </p>
        </div>

        {/* Tile grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tone */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Music size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Tone</label>
              <select
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
                value={prefs.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option value="neutral">Neutral</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="playful">Playful</option>
              </select>
            </div>
          </div>

          {/* Format */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <List size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Format</label>
              <select
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.format}
                onChange={(e) => handleChange('format', e.target.value)}
                disabled={isBasic}
              >
                <option value="bullets_then_takeaway">Bullets then takeaway</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>
          </div>

          {/* Audience */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Users size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Audience</label>
              <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.audience}
                onChange={(e) => handleChange('audience', e.target.value)}
                disabled={isBasic}
                placeholder="general, technical, etc."
              />
            </div>
          </div>

          {/* Length */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Ruler size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Length</label>
              <select
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.length}
                onChange={(e) => handleChange('length', e.target.value)}
                disabled={isBasic}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          {/* Stance */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Scale size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Stance</label>
              <select
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.stance}
                onChange={(e) => handleChange('stance', e.target.value)}
                disabled={isBasic}
              >
                <option value="strictly_neutral">Strictly neutral</option>
                <option value="positive">Positive</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Emoji */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Smile size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Emoji</label>
              <select
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.emoji}
                onChange={(e) => handleChange('emoji', e.target.value)}
                disabled={isBasic}
              >
                <option value="none">None</option>
                <option value="minimal">Minimal</option>
                <option value="frequent">Frequent</option>
              </select>
            </div>
          </div>

          {/* Call to action */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Megaphone size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Call to action</label>
              <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={prefs.cta}
                onChange={(e) => handleChange('cta', e.target.value)}
                disabled={isBasic}
                placeholder="read_more, subscribe, etc."
              />
            </div>
          </div>

          {/* Personality preset */}
          <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="p-2 rounded-full bg-zinc-800 text-pink-500">
              <Brain size={16} />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-1">Personality preset</label>
              <input
                type="text"
                className={`w-full rounded-md border px-3 py-2 text-sm text-zinc-100 ${disabledClasses(isBasic)}`}
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                disabled={isBasic}
                placeholder="executive_brief"
              />
            </div>
          </div>
        </div>

        {/* Save button or upgrade notice */}
        <div>
          {isBasic ? (
            <UpgradeNotice message="Editing writing preferences beyond Tone is a Pro feature." />
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="mt-4 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black hover:bg-zinc-100 transition"
            >
              {saving ? 'Saving…' : 'Save preferences'}
            </button>
          )}
          {message && <p className="mt-2 text-xs text-zinc-400">{message}</p>}
        </div>
      </div>
    </form>
  );
}

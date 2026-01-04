@@ interface Props {
   initialPrefs: WritingPrefs;
   initialPreset: string;
   userId: string;
+  plan: string;
 }

 export default function WritingPrefsForm({
   initialPrefs,
   initialPreset,
   userId
-}: Props) {
+  plan
+}: Props) {
   const supabase: any = createClient();
   const [prefs, setPrefs] = useState<WritingPrefs>(initialPrefs);
@@
   const [message, setMessage] = useState<string | null>(null);

+  const isFree = plan?.toLowerCase() === 'free';

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
@@
       {/* Tone */}
       <div>
         <label className="block text-xs text-zinc-400 mb-1">Tone</label>
         <select
           className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
           value={prefs.tone}
           onChange={(e) => handleChange('tone', e.target.value)}
+          disabled={isFree}
         >

@@
 import { useState } from 'react';
 import { createClient } from '@/utils/supabase/client';
+import GhostConfigModal from './GhostConfigModal';
@@
 export default function IntegrationListClient({
   integrations,
   plan,
   userId
 }: Props) {
   const supabase: any = createClient();
   const isFree = plan?.toLowerCase() === 'free';
   const channels = ['ghost', 'wordpress', 'twitter', 'webhook'];

@@
-  const [state, setState] = useState(initialState);
+  const [state, setState] = useState(initialState);
+
+  // Modal state for Ghost
+  const [ghostModalOpen, setGhostModalOpen] = useState(false);
+  const [ghostPendingChannel, setGhostPendingChannel] = useState<'ghost' | null>(null);

   async function upsertIntegration(
     channel: string,
     fields: { is_active: boolean; config?: any }
   ) {
     const updates: any = {
       customer_id: userId,
       channel,
       is_active: fields.is_active
     };
     if (fields.config !== undefined) {
       updates.config = fields.config;
     }
-    const { error } = await supabase
-      .from('customer_integrations')
-      .upsert(updates);
+    const { error } = await supabase
+      .from('customer_integrations')
+      .upsert(updates, {
+        // use unique constraint for upsert
+        onConflict: 'customer_id,channel'
+      });
     if (error) {
       console.error('Failed to update integration', error);
     }
   }

   const handleToggle = async (channel: string) => {
     const current = state[channel];
     const newValue = !current.is_active;
     if (isFree && channel !== 'ghost' && newValue) {
       alert(
         'The Free plan supports only the Ghost integration. Upgrade to enable more.'
       );
       return;
     }
-    setState((prev) => ({
-      ...prev,
-      [channel]: { ...prev[channel], is_active: newValue }
-    }));
-    await upsertIntegration(channel, { is_active: newValue });
+
+    // If enabling Ghost and no config present, show modal first
+    if (channel === 'ghost' && newValue) {
+      const existingConfig = state.ghost.config || {};
+      if (
+        !existingConfig.api_url ||
+        !existingConfig.admin_key ||
+        !existingConfig.content_id
+      ) {
+        setGhostPendingChannel('ghost');
+        setGhostModalOpen(true);
+        // Don’t toggle state yet
+        return;
+      }
+    }
+
+    // update UI immediately
+    setState((prev) => ({
+      ...prev,
+      [channel]: { ...prev[channel], is_active: newValue }
+    }));
+    await upsertIntegration(channel, { is_active: newValue });
   };

+  const handleGhostSave = async (config: {
+    api_url: string;
+    admin_key: string;
+    content_id: string;
+  }) => {
+    setGhostModalOpen(false);
+    setGhostPendingChannel(null);
+    // enable ghost with config
+    setState((prev) => ({
+      ...prev,
+      ghost: { is_active: true, config }
+    }));
+    await upsertIntegration('ghost', {
+      is_active: true,
+      config
+    });
+  };

   return (
     <div className="grid gap-4 md:grid-cols-2">
@@
       {channels.map((channel) => {
@@
         return (
           <div
@@
             {disabled && (
               <p className="mt-2 text-xs text-zinc-500">
                 Pro plan required to enable this integration.
               </p>
             )}
           </div>
         );
       })}
+      <GhostConfigModal
+        open={ghostModalOpen}
+        onClose={() => setGhostModalOpen(false)}
+        onSave={handleGhostSave}
+        initialConfig={state.ghost?.config}
+      />
     </div>
   );
 }

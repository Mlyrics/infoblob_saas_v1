async function upsertTopic(
  code: string,
  fields: { is_active: boolean; custom_tags?: string; rss_url?: string }
) {
  const updates: any = {
    customer_id: userId,
    topic_code: code,
    is_active: fields.is_active,
  };
  if (fields.custom_tags !== undefined) updates.custom_tags = fields.custom_tags || null;
  if (fields.rss_url !== undefined) updates.rss_url = fields.rss_url || null;

  const { error } = await supabase
    .from('customer_topics')
    .upsert(updates, {
      // Use unique constraint for upsert
      onConflict: 'customer_id,topic_code',
    });

  if (error) {
    console.error('Failed to update topic', error);
  }
}

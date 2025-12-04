// lib/billing.ts

import Stripe from "stripe";
import { supabaseAdmin } from "./supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function getOrCreateStripeCustomerId(userId: string) {
  const { data: user, error } = await supabaseAdmin
    .from("users_table")
    .select("id, email, name, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error || !user) {
    console.error("getOrCreateStripeCustomerId: user lookup failed", error);
    throw new Error("User not found in users_table");
  }

  if (user.stripe_customer_id) {
    return user.stripe_customer_id as string;
  }

  const customer = await stripe.customers.create({
    email: user.email || undefined,
    name: user.name || undefined,
    metadata: {
      users_table_id: user.id,
    },
  });

  const { error: updateError } = await supabaseAdmin
    .from("users_table")
    .update({
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Failed to update users_table with stripe_customer_id", updateError);
  }

  return customer.id;
}

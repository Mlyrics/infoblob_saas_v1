// lib/accessControl.ts

import { supabaseAdmin } from "./supabaseAdmin";
import { PLAN_LIMITS, PlanName, PlanLimits, UserStatus } from "./planConfig";

export interface UserPlanContext {
  userId: string;
  email: string | null;
  name: string | null;
  plan: PlanName;
  status: UserStatus;
  limits: PlanLimits;
}

export async function getUserPlanContext(userId: string): Promise<UserPlanContext> {
  const { data, error } = await supabaseAdmin
    .from("users_table")
    .select("id, email, name, plan, status")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("getUserPlanContext error", error);
    throw new Error("User not found in users_table");
  }

  const plan = (data.plan ?? "free") as PlanName;
  const status = (data.status ?? "pending") as UserStatus;

  return {
    userId: data.id,
    email: data.email ?? null,
    name: data.name ?? null,
    plan,
    status,
    limits: PLAN_LIMITS[plan],
  };
}

export function assertActiveSubscription(ctx: UserPlanContext) {
  if (ctx.status !== "active") {
    throw new Error("Subscription is not active. Please update your billing.");
  }
}

export function isAtOrAboveLimit(current: number, max: number | "unlimited") {
  if (max === "unlimited") return false;
  return current >= max;
}

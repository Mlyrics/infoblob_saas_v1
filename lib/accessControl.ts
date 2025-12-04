// lib/accessControl.ts
import { PLAN_LIMITS, PlanName, UserStatus, PlanLimits } from "./planConfig";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface UserPlanContext {
  userId: string;        // auth.users.id
  email: string | null;
  name: string | null;
  plan: PlanName;
  status: UserStatus;
  limits: PlanLimits;
}

export async function getUserPlanContext(userId: string): Promise<UserPlanContext> {
  const [row] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!row) {
    throw new Error("User not found in users_table");
  }

  const plan = (row.plan ?? "free") as PlanName;
  const status = (row.status ?? "pending") as UserStatus;

  return {
    userId,
    email: row.email ?? null,
    name: row.name ?? null,
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

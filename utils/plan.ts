// utils/plan.ts
export type Plan = 'basic' | 'pro';

/** Normalize any incoming plan string to our internal Plan type. */
export function normalizePlan(input: string | null | undefined): Plan {
  const p = (input ?? '').toLowerCase();
  return p === 'pro' ? 'pro' : 'basic';
}

/** Limits for each plan.  Modify these values to adjust gating. */
export const PLAN_LIMITS = {
  basic: {
    maxActiveTopics: 3,
    maxIntegrations: 1,
    allowedIntegrations: ['ghost'] as const,
    writingStyleAdvanced: false,
  },
  pro: {
    maxActiveTopics: 999,
    maxIntegrations: 999,
    allowedIntegrations: ['ghost', 'wordpress', 'twitter', 'webhook'] as const,
    writingStyleAdvanced: true,
  },
} as const;

/** Helper for quickly checking if a plan is Pro. */
export function isPro(plan: Plan) {
  return plan === 'pro';
}

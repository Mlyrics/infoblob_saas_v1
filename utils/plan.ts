// utils/plan.ts
export type Plan = 'basic' | 'pro';

export function normalizePlan(input: string | null | undefined): Plan {
  const p = (input ?? '').toLowerCase();
  return p === 'pro' ? 'pro' : 'basic';
}

export const PLAN_LIMITS = {
  basic: {
    maxActiveTopics: 3,
    maxIntegrations: 1,
    allowedIntegrations: ['ghost'] as const, // BASIC can only use Ghost (change if you want)
    writingStyleAdvanced: false,
  },
  pro: {
    maxActiveTopics: 999,
    maxIntegrations: 999,
    allowedIntegrations: ['ghost', 'wordpress', 'webhook', 'email'] as const, // example
    writingStyleAdvanced: true,
  },
} as const;

export function isPro(plan: Plan) {
  return plan === 'pro';
}

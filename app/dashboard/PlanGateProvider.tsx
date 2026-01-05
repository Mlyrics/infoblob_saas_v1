// app/dashboard/PlanGateProvider.tsx
'use client';

import { createContext, useContext } from 'react';
import { normalizePlan, PLAN_LIMITS, type Plan } from '@/utils/plan';

type PlanGate = {
  plan: Plan;
  isPro: boolean;
  isFree: boolean;
  limits: (typeof PLAN_LIMITS)[Plan];
};

const PlanGateContext = createContext<PlanGate | null>(null);

/**
 * PlanGateProvider exposes the current user's plan, flags for Pro/Free,
 * and the defined limits via context.  Wrap dashboard pages with this.
 */
export function PlanGateProvider({
  plan,
  children,
}: {
  plan: string | null | undefined;
  children: React.ReactNode;
}) {
  const normalized = normalizePlan(plan);
  const value: PlanGate = {
    plan: normalized,
    isPro: normalized === 'pro',
    isFree: normalized !== 'pro',
    limits: PLAN_LIMITS[normalized],
  };

  return (
    <PlanGateContext.Provider value={value}>
      {children}
    </PlanGateContext.Provider>
  );
}

export function usePlanGate() {
  const context = useContext(PlanGateContext);
  if (!context) throw new Error('usePlanGate must be used within PlanGateProvider');
  return context;
}

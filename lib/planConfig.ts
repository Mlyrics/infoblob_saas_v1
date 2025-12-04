// lib/planConfig.ts
export type PlanName = "free" | "basic" | "pro" | "agency";
export type UserStatus = "pending" | "active" | "inactive";

export interface PlanLimits {
  maxTopics: number | "unlimited";
  maxGhostIntegrations: number;
  allowCustomTags: boolean;
  allowCustomRss: boolean;
  allowCustomPrompt: boolean;
  allowAutomations: boolean;
  allowSocialQueue: boolean;
  allowBackfill: boolean;
  allowApiAccess: boolean;
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    maxTopics: 3,
    maxGhostIntegrations: 0,
    allowCustomTags: false,
    allowCustomRss: false,
    allowCustomPrompt: false,
    allowAutomations: false,
    allowSocialQueue: false,
    allowBackfill: false,
    allowApiAccess: false,
  },
  basic: {
    maxTopics: 10,
    maxGhostIntegrations: 1,
    allowCustomTags: true,
    allowCustomRss: false,
    allowCustomPrompt: false,
    allowAutomations: true,
    allowSocialQueue: false,
    allowBackfill: false,
    allowApiAccess: false,
  },
  pro: {
    maxTopics: 20,
    maxGhostIntegrations: 3,
    allowCustomTags: true,
    allowCustomRss: true,
    allowCustomPrompt: true,
    allowAutomations: true,
    allowSocialQueue: true,
    allowBackfill: true,
    allowApiAccess: true,
  },
  agency: {
    maxTopics: "unlimited",
    maxGhostIntegrations: 9999,
    allowCustomTags: true,
    allowCustomRss: true,
    allowCustomPrompt: true,
    allowAutomations: true,
    allowSocialQueue: true,
    allowBackfill: true,
    allowApiAccess: true,
  },
};

// client/src/api/analytics.ts
import API from "../lib/axios";

export interface AnalyticsData {
  timeframe: string;
  summary: {
    productivityScore: number;
    totalEntities: {
      visions: number;
      goals: number;
      tasks: number;
      ideas: number;
      notes: number;
      journalEntries: number;
      achievements: number;
    };
  };
  visions: {
    total: number;
    active: number;
    planning: number;
    completed: number;
    paused: number;
    averageProgress: number;
  };
  goals: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    paused: number;
    averageProgress: number;
    completionRate: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    completionRate: number;
    overdue: number;
  };
  ideas: {
    total: number;
    draft: number;
    exploring: number;
    ready: number;
    implemented: number;
    archived: number;
  };
  notes: {
    total: number;
    pinned: number;
    withTags: number;
  };
  journal: {
    total: number;
    byMood: Record<string, number>;
    averageEntriesPerWeek: number;
  };
  achievements: {
    total: number;
    public: number;
    private: number;
    averageImpactScore: number;
  };
  trends: {
    goals: {
      current: number;
      previous: number;
      change: number;
    };
    tasks: {
      current: number;
      previous: number;
      change: number;
    };
  };
}

/**
 * Get aggregated analytics data
 * @param timeframe - 'week', 'month', 'year', or 'all' (default: 'all')
 */
export const getAnalytics = async (timeframe: 'week' | 'month' | 'year' | 'all' = 'all'): Promise<AnalyticsData> => {
  const res = await API.get("/analytics", {
    params: { timeframe },
  });
  return res.data;
};


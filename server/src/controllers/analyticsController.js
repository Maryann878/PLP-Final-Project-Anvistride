// server/src/controllers/analyticsController.js
import asyncHandler from "express-async-handler";
import Vision from "../models/Vision.js";
import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Idea from "../models/Idea.js";
import Note from "../models/Note.js";
import JournalEntry from "../models/JournalEntry.js";
import Achievement from "../models/Achievement.js";

/**
 * @desc Get aggregated analytics data
 * @route GET /api/analytics
 * @access Private
 * @query timeframe (optional) - 'week', 'month', 'year', or 'all' (default: 'all')
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const { timeframe = 'all' } = req.query;
  const userId = req.user.id;

  // Calculate date range based on timeframe
  let startDate = null;
  const now = new Date();

  switch (timeframe) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'all':
    default:
      startDate = null; // No filter
      break;
  }

  // Build date filter
  const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

  // Aggregate data in parallel
  const [
    visions,
    goals,
    tasks,
    ideas,
    notes,
    journalEntries,
    achievements,
  ] = await Promise.all([
    Vision.find({ user: userId, ...dateFilter }).lean(),
    Goal.find({ user: userId, ...dateFilter }).lean(),
    Task.find({ user: userId, ...dateFilter }).lean(),
    Idea.find({ user: userId, ...dateFilter }).lean(),
    Note.find({ user: userId, ...dateFilter }).lean(),
    JournalEntry.find({ user: userId, ...dateFilter }).lean(),
    Achievement.find({ user: userId, ...dateFilter }).lean(),
  ]);

  // Calculate vision statistics
  const visionStats = {
    total: visions.length,
    active: visions.filter(v => v.status === 'active').length,
    planning: visions.filter(v => v.status === 'planning').length,
    completed: visions.filter(v => v.status === 'completed').length,
    paused: visions.filter(v => v.status === 'paused').length,
    averageProgress: visions.length > 0
      ? visions.reduce((sum, v) => sum + (v.progress || 0), 0) / visions.length
      : 0,
  };

  // Calculate goal statistics
  const goalStats = {
    total: goals.length,
    notStarted: goals.filter(g => g.status === 'not_started').length,
    inProgress: goals.filter(g => g.status === 'in_progress').length,
    completed: goals.filter(g => g.status === 'completed').length,
    paused: goals.filter(g => g.status === 'paused').length,
    averageProgress: goals.length > 0
      ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length
      : 0,
    completionRate: goals.length > 0
      ? (goals.filter(g => g.status === 'completed').length / goals.length) * 100
      : 0,
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    completionRate: tasks.length > 0
      ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100
      : 0,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < now && t.status !== 'done';
    }).length,
  };

  // Calculate idea statistics
  const ideaStats = {
    total: ideas.length,
    draft: ideas.filter(i => i.status === 'draft').length,
    exploring: ideas.filter(i => i.status === 'exploring').length,
    ready: ideas.filter(i => i.status === 'ready').length,
    implemented: ideas.filter(i => i.status === 'implemented').length,
    archived: ideas.filter(i => i.status === 'archived').length,
  };

  // Calculate note statistics
  const noteStats = {
    total: notes.length,
    pinned: notes.filter(n => n.pinned).length,
    withTags: notes.filter(n => n.tags && n.tags.length > 0).length,
  };

  // Calculate journal statistics
  const journalStats = {
    total: journalEntries.length,
    byMood: journalEntries.reduce((acc, entry) => {
      const mood = entry.mood || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {}),
    averageEntriesPerWeek: journalEntries.length > 0
      ? (journalEntries.length / Math.max(1, Math.ceil((now - (startDate || new Date(0))) / (7 * 24 * 60 * 60 * 1000))))
      : 0,
  };

  // Calculate achievement statistics
  const achievementStats = {
    total: achievements.length,
    public: achievements.filter(a => a.visibility === 'public').length,
    private: achievements.filter(a => a.visibility === 'private').length,
    averageImpactScore: achievements.length > 0
      ? achievements.reduce((sum, a) => sum + (a.impactScore || 0), 0) / achievements.length
      : 0,
  };

  // Calculate productivity score (0-100)
  const productivityScore = calculateProductivityScore({
    visionStats,
    goalStats,
    taskStats,
    ideaStats,
    journalStats,
    achievementStats,
  });

  // Calculate trends (comparing current period to previous period)
  const trends = await calculateTrends(userId, timeframe, startDate);

  res.status(200).json({
    timeframe,
    summary: {
      productivityScore: Math.round(productivityScore),
      totalEntities: {
        visions: visionStats.total,
        goals: goalStats.total,
        tasks: taskStats.total,
        ideas: ideaStats.total,
        notes: noteStats.total,
        journalEntries: journalStats.total,
        achievements: achievementStats.total,
      },
    },
    visions: visionStats,
    goals: goalStats,
    tasks: taskStats,
    ideas: ideaStats,
    notes: noteStats,
    journal: journalStats,
    achievements: achievementStats,
    trends,
  });
});

/**
 * Calculate productivity score (0-100)
 */
function calculateProductivityScore(stats) {
  let score = 0;
  let maxScore = 0;

  // Vision progress (20 points)
  maxScore += 20;
  score += (stats.visionStats.averageProgress / 100) * 20;

  // Goal completion rate (30 points)
  maxScore += 30;
  score += (stats.goalStats.completionRate / 100) * 30;

  // Task completion rate (30 points)
  maxScore += 30;
  score += (stats.taskStats.completionRate / 100) * 30;

  // Journal activity (10 points) - based on entries
  maxScore += 10;
  const journalActivity = Math.min(stats.journalStats.averageEntriesPerWeek / 7, 1);
  score += journalActivity * 10;

  // Achievement progress (10 points)
  maxScore += 10;
  const achievementProgress = Math.min(stats.achievementStats.total / 10, 1);
  score += achievementProgress * 10;

  return Math.min(100, (score / maxScore) * 100);
}

/**
 * Calculate trends by comparing current period to previous period
 */
async function calculateTrends(userId, timeframe, startDate) {
  if (!startDate) {
    // For 'all' timeframe, compare last 30 days to previous 30 days
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [currentGoals, previousGoals] = await Promise.all([
      Goal.countDocuments({ user: userId, createdAt: { $gte: last30Days } }),
      Goal.countDocuments({ user: userId, createdAt: { $gte: previous30Days, $lt: last30Days } }),
    ]);

    const [currentTasks, previousTasks] = await Promise.all([
      Task.countDocuments({ user: userId, createdAt: { $gte: last30Days } }),
      Task.countDocuments({ user: userId, createdAt: { $gte: previous30Days, $lt: last30Days } }),
    ]);

    return {
      goals: {
        current: currentGoals,
        previous: previousGoals,
        change: previousGoals > 0 ? ((currentGoals - previousGoals) / previousGoals) * 100 : 0,
      },
      tasks: {
        current: currentTasks,
        previous: previousTasks,
        change: previousTasks > 0 ? ((currentTasks - previousTasks) / previousTasks) * 100 : 0,
      },
    };
  }

  // Calculate previous period based on timeframe
  let previousStartDate;
  const periodLength = new Date().getTime() - startDate.getTime();

  if (timeframe === 'week') {
    previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeframe === 'month') {
    previousStartDate = new Date(startDate.getTime() - periodLength);
  } else if (timeframe === 'year') {
    previousStartDate = new Date(startDate.getTime() - periodLength);
  }

  const [currentGoals, previousGoals] = await Promise.all([
    Goal.countDocuments({ user: userId, createdAt: { $gte: startDate } }),
    Goal.countDocuments({ user: userId, createdAt: { $gte: previousStartDate, $lt: startDate } }),
  ]);

  const [currentTasks, previousTasks] = await Promise.all([
    Task.countDocuments({ user: userId, createdAt: { $gte: startDate } }),
    Task.countDocuments({ user: userId, createdAt: { $gte: previousStartDate, $lt: startDate } }),
  ]);

  return {
    goals: {
      current: currentGoals,
      previous: previousGoals,
      change: previousGoals > 0 ? ((currentGoals - previousGoals) / previousGoals) * 100 : 0,
    },
    tasks: {
      current: currentTasks,
      previous: previousTasks,
      change: previousTasks > 0 ? ((currentTasks - previousTasks) / previousTasks) * 100 : 0,
    },
  };
}


import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Target,
  CheckCircle2,
  Clock,
  Lightbulb,
  StickyNote,
  BookOpen,
  Trophy,
  Quote,
  Calendar,
  TrendingUp,
  X,
  Shuffle,
  Flame,
  Medal,
  Bell,
  ChevronRight,
  Info,
  Star,
  Check,
  Trash2,
} from "lucide-react";
import ScrollButtons from "@/components/ScrollButtons";

const DAILY_INSPIRATION_KEY = "anvistride_dailyInspiration";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    visions,
    goals,
    tasks,
    ideas,
    notes,
    journal,
    achievements,
    quotes,
    toggleTaskStatus,
  } = useAppContext();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllRead } = useNotifications();
  const navigate = useNavigate();
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  // Safety checks: ensure all arrays are defined (for use in JSX)
  const safeVisions = visions || [];
  const safeGoals = goals || [];
  const safeTasks = tasks || [];
  const safeIdeas = ideas || [];
  const safeNotes = notes || [];
  const safeJournal = journal || [];
  const safeAchievements = achievements || [];

  // State for quote carousel
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(
    quotes.length > 0 ? Math.floor(Math.random() * quotes.length) : 0
  );
  const [showDailyInspiration, setShowDailyInspiration] = useState(() => {
    const saved = localStorage.getItem(DAILY_INSPIRATION_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showInspirationModal, setShowInspirationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Load daily inspiration preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(DAILY_INSPIRATION_KEY);
    if (saved !== null) {
      setShowDailyInspiration(JSON.parse(saved));
    }
  }, []);

  // Save daily inspiration preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(DAILY_INSPIRATION_KEY, JSON.stringify(showDailyInspiration));
  }, [showDailyInspiration]);

  // Get current quote
  const currentQuote = quotes[currentQuoteIndex] || {
    text: "Vision into stride, one step at a time.",
    author: "Anvistride",
  };

  // Shuffle quote function
  const shuffleQuote = () => {
    if (quotes.length <= 1) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    setCurrentQuoteIndex(newIndex);
  };

  // Comprehensive dashboard data calculations
  const dashboardData = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Vision filtering
    const activeVisions = safeVisions.filter((v) => v?.status === "Active");
    const planningVisions = safeVisions.filter((v) => v?.status === "Planning");
    const pausedVisions = safeVisions.filter((v) => v?.status === "Paused");
    const completedVisions = safeVisions.filter((v) => v?.status === "Completed");
    const accomplishedVisions = safeVisions.filter((v) => {
      const linkedGoals = safeGoals.filter((goal) => goal.linkedVisionId === v.id);
      const allGoalsCompleted =
        linkedGoals.length > 0 &&
        linkedGoals.every((goal) => goal.status === "Completed");
      const progressComplete = (v.progress || 0) >= 100;
      return progressComplete || allGoalsCompleted || v.status === "Completed";
    });

    // Goal filtering
    const activeGoals = safeGoals.filter((g) => g?.status === "In Progress");
    const overdueGoals = safeGoals.filter((g) => {
      if (!g?.deadline || g?.status === "Completed") return false;
      const deadlineDate = new Date(g.deadline);
      return deadlineDate < now && deadlineDate.getTime() > 0;
    });

    const upcomingDeadlines = safeGoals
      .filter((g) => {
        if (!g?.deadline || g?.status === "Completed") return false;
        const deadlineDate = new Date(g.deadline);
        return deadlineDate > now && deadlineDate.getTime() > 0;
      })
      .sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
        return dateA - dateB;
      })
      .slice(0, 5);

    // Task filtering
    const todayTasks = safeTasks.filter((t) => t?.status === "Todo");
    const overdueTasks = safeTasks.filter((t) => {
      if (t?.status === "Done" || !t?.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < now;
    });
    const highPriorityTasks = safeTasks.filter(
      (t) => t?.priority === "High" && t?.status !== "Done"
    );

    // Smart prioritization for Today's Focus
    const smartFocusTasks = safeTasks
      .filter((t) => t?.status === "Todo")
      .sort((a, b) => {
        const getPriorityScore = (task: any) => {
          let score = 0;
          const priorityScores: Record<string, number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          score += priorityScores[task.priority] || 1;

          if (task.dueDate) {
            const deadlineDate = new Date(task.dueDate);
            const daysUntilDeadline = Math.ceil(
              (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysUntilDeadline <= 0) score += 5;
            else if (daysUntilDeadline <= 1) score += 4;
            else if (daysUntilDeadline <= 3) score += 3;
            else if (daysUntilDeadline <= 7) score += 2;
            else score += 1;
          }

          if (task.createdAt) {
            const createdDate = new Date(task.createdAt);
            const daysSinceCreation = Math.ceil(
              (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceCreation <= 1) score += 0.5;
          }

          return score;
        };

        return getPriorityScore(b) - getPriorityScore(a);
      })
      .slice(0, 3);

    // Smart prioritization for This Week's Goals
    const smartWeeklyGoals = safeGoals
      .filter((g) => g?.status === "In Progress")
      .sort((a, b) => {
        const getGoalPriorityScore = (goal: any) => {
          let score = 0;
          const progressScore = (goal.progress || 0) / 100;
          score += progressScore * 2;

          if (goal.deadline) {
            const deadlineDate = new Date(goal.deadline);
            const daysUntilDeadline = Math.ceil(
              (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysUntilDeadline <= 0) score += 5;
            else if (daysUntilDeadline <= 3) score += 4;
            else if (daysUntilDeadline <= 7) score += 3;
            else if (daysUntilDeadline <= 14) score += 2;
            else score += 1;
          }

          if (goal.visionId) {
            const linkedVision = safeVisions.find((v) => v.id === goal.visionId);
            if (linkedVision) score += 1;
          }

          return score;
        };

        return getGoalPriorityScore(b) - getGoalPriorityScore(a);
      })
      .slice(0, 3);

    // Ideas filtering
    const newIdeas = safeIdeas.filter((i) => i?.createdAt);
    // Note: Ideas don't have a status field in the current type definition
    const implementedIdeas: typeof safeIdeas = [];

    // Notes filtering
    const recentNotes = safeNotes
      .filter((n) => n?.updatedAt)
      .sort(
        (a, b) =>
          (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) - (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
      )
      .slice(0, 5);

    // Journal entries
    const recentJournalEntries = safeJournal
      .filter((j) => j?.date)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3);

    const todayJournalEntries = safeJournal.filter((j) => j?.date === today);

    // Progress calculations
    const goalsProgress =
      safeGoals.length > 0
        ? safeGoals.reduce((sum, g) => sum + (g?.progress || 0), 0) / safeGoals.length
        : 0;

    const tasksProgress =
      safeTasks.length > 0
        ? (safeTasks.filter((t) => t?.status === "Done").length / safeTasks.length) *
          100
        : 0;

    const visionsProgress =
      safeVisions.length > 0
        ? safeVisions.reduce((sum, v) => sum + (v?.progress || 0), 0) /
          safeVisions.length
        : 0;

    const overallProgress = Math.round(
      goalsProgress * 0.4 + tasksProgress * 0.4 + visionsProgress * 0.2
    );

    const taskCompletionRate =
      safeTasks.length > 0
        ? Math.round(
            (safeTasks.filter((t) => t?.status === "Done").length / safeTasks.length) *
              100
          )
        : 0;

    // Completion tracking
    const completedToday = safeTasks.filter((t) => {
      if (t?.status !== "Done" || !t?.completedAt) return false;
      const completedDate = new Date(t.completedAt).toISOString().split("T")[0];
      return completedDate === today;
    }).length;

    const completedThisWeek = safeTasks.filter((t) => {
      if (t?.status !== "Done" || !t?.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return completedDate >= weekStart;
    }).length;

    const completedThisMonth = safeTasks.filter((t) => {
      if (t?.status !== "Done" || !t?.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return completedDate >= monthStart;
    }).length;

    // Recent achievements
    const recentAchievements = safeAchievements
      .filter((a) => a?.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    // Activity timeline
    const activityTimeline = [
      ...safeVisions.map((v) => ({
        ...v,
        type: "vision",
        action: "created",
        timestamp: v.createdAt,
      })),
      ...safeGoals.map((g) => ({
        ...g,
        type: "goal",
        action: "created",
        timestamp: g.createdAt,
      })),
      ...safeTasks.map((t) => ({
        ...t,
        type: "task",
        action: "created",
        timestamp: t.createdAt,
      })),
      ...safeIdeas.map((i) => ({
        ...i,
        type: "idea",
        action: "created",
        timestamp: i.createdAt,
      })),
      ...safeNotes.map((n) => ({
        ...n,
        type: "note",
        action: "created",
        timestamp: n.updatedAt,
      })),
      ...safeJournal.map((j) => ({
        ...j,
        type: "journal",
        action: "created",
        timestamp: j.date,
      })),
      ...safeAchievements.map((a) => ({
        ...a,
        type: "achievement",
        action: "created",
        timestamp: a.date,
      })),
    ]
      .filter((item) => item.timestamp)
      .sort(
        (a, b) =>
          (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0)
      )
      .slice(0, 10);

    return {
      activeVisions,
      planningVisions,
      pausedVisions,
      completedVisions,
      accomplishedVisions,
      activeGoals,
      overdueGoals,
      upcomingDeadlines,
      todayTasks,
      overdueTasks,
      highPriorityTasks,
      smartFocusTasks,
      smartWeeklyGoals,
      newIdeas,
      implementedIdeas,
      recentNotes,
      recentJournalEntries,
      todayJournalEntries,
      overallProgress,
      taskCompletionRate,
      completedToday,
      completedThisWeek,
      completedThisMonth,
      recentAchievements,
      activityTimeline,
      goalsProgress,
      tasksProgress,
      visionsProgress,
    };
  }, [visions, goals, tasks, ideas, notes, journal, achievements]);

  // Navigation handlers
  const handleQuickAction = (action: string) => {
    navigate(`/app/${action}`);
  };

  // Get greeting - always "Hello [username]"
  const getGreeting = () => {
    return `Hello`;
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="relative space-y-3 sm:space-y-6 md:space-y-8 pb-8 sm:pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 overflow-hidden">
      {/* Mobile Daily Inspiration - Show at top on mobile */}
      {showDailyInspiration && (
        <div className="lg:hidden px-3 sm:px-4 pt-3 sm:pt-4 md:pt-6">
          <Card
            onClick={() => setShowInspirationModal(true)}
            className={`${glassClass} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg border border-purple-200/50 hover:border-teal-200/50 transition-all duration-300 cursor-pointer active:scale-[0.98]`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Quote className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-600">Daily Inspiration</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newValue = false;
                      setShowDailyInspiration(newValue);
                      localStorage.setItem(DAILY_INSPIRATION_KEY, JSON.stringify(newValue));
                    }}
                    className="w-6 h-6 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <blockquote className="text-sm font-medium text-gray-900 italic leading-relaxed line-clamp-2">
                  &quot;{currentQuote.text}&quot;
                </blockquote>
              </div>
            </div>
            <cite className="text-xs text-gray-600 not-italic block text-right font-medium mb-2">
              — {currentQuote.author}
            </cite>
            <div className="flex items-center justify-between pt-2 border-t border-purple-200/30">
              <span className="text-xs text-purple-600 font-medium">Tap to view full quote</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shuffleQuote();
                }}
                className="w-7 h-7 rounded-lg bg-purple-100 hover:bg-purple-200 active:bg-purple-300 flex items-center justify-center text-purple-600 transition-colors"
                title="Shuffle quote"
              >
                <Shuffle className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        </div>
      )}
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Inspiration Widget - Right Side */}
      {showDailyInspiration && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block max-w-[280px]">
          <div
            onClick={() => setShowInspirationModal(true)}
            className={`relative ${glassClass} rounded-2xl p-5 shadow-2xl border border-purple-200/50 hover:border-teal-200/50 transition-all duration-300 cursor-pointer hover:scale-105 group`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newValue = false;
                setShowDailyInspiration(newValue);
                localStorage.setItem(DAILY_INSPIRATION_KEY, JSON.stringify(newValue));
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors duration-200 z-10"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Quote className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">Daily Inspiration</h3>
                <blockquote className="text-sm font-medium text-gray-900 italic leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                  &quot;{currentQuote.text}&quot;
                </blockquote>
              </div>
            </div>
            <cite className="text-xs text-gray-600 not-italic block text-right font-medium">
              — {currentQuote.author}
            </cite>
            <div className="mt-3 pt-3 border-t border-purple-200/30 flex items-center justify-between">
              <span className="text-xs text-purple-600 font-medium">Click to view full quote</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shuffleQuote();
                }}
                className="w-7 h-7 rounded-lg bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-600 transition-colors"
                title="Shuffle quote"
              >
                <Shuffle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspiration Modal */}
      <Dialog open={showInspirationModal} onOpenChange={(open) => {
        if (!open) {
          setShowInspirationModal(false);
        }
      }}>
        <DialogContent className={`${glassClass} rounded-2xl max-w-md mx-auto`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Quote className="h-5 w-5 text-purple-600" />
              Daily Inspiration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200/50">
              <blockquote className="text-base font-medium text-gray-900 italic mb-3 leading-relaxed">
                &quot;{currentQuote.text}&quot;
              </blockquote>
              <cite className="text-sm text-gray-600 not-italic block text-right">
                — {currentQuote.author}
              </cite>
            </div>
            <Button
              onClick={shuffleQuote}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              New Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={(open) => {
        if (!open) {
          setShowNotificationModal(false);
        }
      }}>
        <DialogContent className={`${glassClass} rounded-2xl max-w-2xl mx-auto max-h-[85vh] overflow-hidden flex flex-col`}>
          <DialogHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
                    )}
                  </div>
                </div>
              </DialogTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {/* Filter tabs */}
          <div className="flex-shrink-0 py-3 border-b border-gray-200">
            <div className="flex gap-2">
              <Button
                variant={notificationFilter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationFilter('all')}
                className={notificationFilter === 'all' ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white" : ""}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={notificationFilter === 'unread' ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationFilter('unread')}
                className={notificationFilter === 'unread' ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white" : ""}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={notificationFilter === 'urgent' ? "default" : "outline"}
                size="sm"
                onClick={() => setNotificationFilter('urgent')}
                className={notificationFilter === 'urgent' ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white" : ""}
              >
                Urgent ({notifications.filter(n => n.priority === 'high' && !n.isRead).length})
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {(() => {
              const filtered = notificationFilter === 'all' 
                ? notifications 
                : notificationFilter === 'unread'
                ? notifications.filter(n => !n.isRead)
                : notifications.filter(n => n.priority === 'high' && !n.isRead);
              
              const formatTimestamp = (timestamp: string) => {
                const date = new Date(timestamp);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
                if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                return date.toLocaleDateString();
              };

              const getNotificationIcon = (type: string) => {
                switch (type) {
                  case 'system':
                    return <Info className="h-5 w-5 text-blue-600" />;
                  case 'reminder':
                    return <Clock className="h-5 w-5 text-amber-600" />;
                  case 'update':
                    return <Bell className="h-5 w-5 text-purple-600" />;
                  case 'achievement':
                    return <Star className="h-5 w-5 text-amber-600" />;
                  default:
                    return <Bell className="h-5 w-5 text-gray-600" />;
                }
              };

              const getPriorityColor = (priority: string) => {
                switch (priority) {
                  case 'high':
                    return 'bg-red-500';
                  case 'medium':
                    return 'bg-amber-500';
                  case 'low':
                    return 'bg-green-500';
                  default:
                    return 'bg-gray-500';
                }
              };
              
              return filtered.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">
                    {notificationFilter === 'unread' 
                      ? 'All caught up! No unread notifications'
                      : notificationFilter === 'urgent'
                      ? 'No urgent notifications'
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              ) : (
                filtered.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${glassClass} ${!notification.isRead ? 'border-l-4 border-l-purple-500' : ''} hover:shadow-xl transition-all duration-300 cursor-pointer`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        setShowNotificationModal(false);
                        navigate(notification.actionUrl);
                      }
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{notification.message}</p>
                          {notification.actionUrl && notification.actionText && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                                setShowNotificationModal(false);
                                navigate(notification.actionUrl!);
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              );
            })()}
          </div>
          {notifications.some(n => n.isRead) && (
            <div className="flex-shrink-0 pt-4 border-t border-gray-200 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllRead}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Read Notifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Welcome Section - Enhanced with gradient and glass */}
      <section className="relative px-3 sm:px-4 md:px-6">
        <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-purple-200/50 overflow-hidden`}>
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 relative z-10">
              <button
                onClick={() => navigate('/app/profile')}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20 overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105"
                title="View Profile"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.username || user?.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 via-teal-500 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-1.5 sm:mb-2 md:mb-3 leading-tight tracking-tight">
                  {getGreeting()} <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">{user?.username || user?.name || "there"}</span>
                </h1>
                <p className="text-xs sm:text-sm font-medium text-gray-600 bg-white/90 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2.5 rounded-lg sm:rounded-xl inline-block mb-2 sm:mb-3 md:mb-4 lg:mb-5 backdrop-blur-sm border border-gray-200/60 shadow-sm">
                  {user?.email || "user@anvistride.com"}
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-800 leading-relaxed tracking-wide">
                  Ready to turn your <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">vision</span> into{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span>? Here's your personalized dashboard with all your progress and upcoming tasks.
                </p>
              </div>
            </div>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5 rounded-xl sm:rounded-2xl" />
          </CardContent>
        </Card>
      </section>

      {/* Statistics Cards - Grid with brand colors */}
      <section className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 px-3 sm:px-4 md:px-6">
        <StatCard
          icon={<Eye className="h-6 w-6 text-white" />}
          value={visions.length}
          label="Total Visions"
          detail={`${dashboardData.activeVisions.length} Active • ${dashboardData.completedVisions.length} Completed`}
          badge={
            dashboardData.accomplishedVisions.length > 0
              ? {
                  text: `${dashboardData.accomplishedVisions.length} Accomplished`,
                  icon: <Medal className="h-3 w-3" />,
                }
              : undefined
          }
          color="purple"
          glassClass={glassClass}
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-white" />}
          value={safeGoals.length}
          label="Total Goals"
          detail={`${dashboardData.activeGoals.length} In Progress • ${dashboardData.overdueGoals.length} Overdue`}
          badge={
            dashboardData.overdueGoals.length === 0 && dashboardData.activeGoals.length > 0
              ? {
                  text: "On Track",
                  icon: <CheckCircle2 className="h-3 w-3" />,
                }
              : undefined
          }
          color="teal"
          glassClass={glassClass}
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          value={safeTasks.length}
          label="Total Tasks"
          detail={`${dashboardData.todayTasks.length} Today • ${dashboardData.overdueTasks.length} Overdue`}
          badge={
            dashboardData.completedToday > 0
              ? {
                  text: `${dashboardData.completedToday} Today`,
                  icon: <CheckCircle2 className="h-3 w-3" />,
                }
              : undefined
          }
          color="gold"
          glassClass={glassClass}
        />
        <StatCard
          icon={<Lightbulb className="h-6 w-6 text-white" />}
          value={safeIdeas.length}
          label="Total Ideas"
          detail={`${dashboardData.newIdeas.length} New • 0 Implemented`}
          badge={
            dashboardData.implementedIdeas.length > 0
              ? {
                  text: `${dashboardData.implementedIdeas.length} Implemented`,
                  icon: <CheckCircle2 className="h-3 w-3" />,
                }
              : undefined
          }
          color="purple"
          glassClass={glassClass}
        />
      </section>

      {/* Momentum Tracker - Enhanced grid */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-teal-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Momentum Tracker</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base font-medium text-gray-700 mt-1">
            Your consistency and <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span> building
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MomentumItem
              icon={<Flame className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />}
              value={dashboardData.completedToday}
              label="Today's Wins"
              glassClass={glassClass}
            />
            <MomentumItem
              icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />}
              value={dashboardData.completedThisWeek}
              label="This Week"
              glassClass={glassClass}
            />
            <MomentumItem
              icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />}
              value={dashboardData.completedThisMonth}
              label="This Month"
              glassClass={glassClass}
            />
            <div className="lg:col-span-1">
              <div className={`${glassClass} rounded-xl p-4 sm:p-6 text-center h-full flex flex-col justify-center`}>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{dashboardData.overallProgress}%</div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">Overall Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3 sm:mt-4">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-teal-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${dashboardData.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-50 to-teal-50/70 border border-purple-200/50 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium">
              Keep this <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span> going! Consistency is the key to success!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Focus - Refined empty state and cards */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-purple-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Today's Focus</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base font-medium text-gray-700 mt-1">Your 3 most important tasks for today</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.smartFocusTasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Focus Tasks Today</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Your priority tasks will appear here as you create and organize your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent font-semibold">workflow</span>!
              </p>
              <Button
                onClick={() => handleQuickAction("tasks")}
                className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Clock className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.smartFocusTasks.map((task: any, index: number) => (
                <div
                  key={task.id}
                  className={`${glassClass} rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-xl transition-all duration-300 border-purple-200/30`}
                >
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2 leading-tight">{task.title}</h4>
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                        <span
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                            task.priority === "High" || task.priority === "Critical"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTaskStatus(task.id, "In Progress")}
                          className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id, "Done")}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200/50 text-center">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Focus on these tasks today and build unstoppable <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span>!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* This Week's Goals - Similar refinements */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-teal-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">This Week's Goals</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Your key objectives for this week</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.smartWeeklyGoals.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-teal-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Weekly Goals Set</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Your priority goals will appear here as you create and organize your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent font-semibold">objectives</span>!
              </p>
              <Button
                onClick={() => handleQuickAction("goals")}
                className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Target className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.smartWeeklyGoals.map((goal: any, index: number) => {
                const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
                const daysUntilDeadline = deadlineDate
                  ? Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3;
                const isNear = daysUntilDeadline !== null && daysUntilDeadline <= 7 && !isUrgent;

                return (
                  <div
                    key={goal.id}
                    className={`rounded-xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-xl ${
                      isUrgent
                        ? "bg-red-50/50 border-red-200/50"
                        : isNear
                        ? "bg-yellow-50/50 border-yellow-200/50"
                        : `${glassClass} border-purple-200/30`
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{goal.title}</h4>
                          {isUrgent && <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-1 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                          <span className="text-xs sm:text-sm text-teal-600 font-medium">In Progress</span>
                          {goal.deadline && (
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                isUrgent ? "text-red-600" : isNear ? "text-yellow-600" : "text-gray-600"
                              }`}
                            >
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {goal.visionId && (
                            <span className="text-xs sm:text-sm text-purple-600 flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Vision Linked
                            </span>
                          )}
                        </div>
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                            <span>Progress</span>
                            <span className="font-semibold">{goal.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                isUrgent
                                  ? "bg-red-500"
                                  : isNear
                                  ? "bg-yellow-500"
                                  : "bg-gradient-to-r from-teal-500 to-purple-600"
                              }`}
                              style={{ width: `${goal.progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction("goals")}
                          className="w-full border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                        >
                          View Goal
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200/50 text-center">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Focus on these goals this week and watch your <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span> grow!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-yellow-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Progress Overview</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Your overall progress and completion rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8">
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl">📊</span>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardData.overallProgress}%</span>
            </div>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-yellow-500 to-teal-500 transition-all duration-1000"
                style={{ width: `${dashboardData.overallProgress}%` }}
              />
            </div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 font-medium">Overall Progress</p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <div className={`${glassClass} rounded-xl p-4 sm:p-5 md:p-6 text-center`}>
              <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">🎯</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 uppercase font-medium">Goals</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(dashboardData.goalsProgress)}%</div>
            </div>
            <div className={`${glassClass} rounded-xl p-4 sm:p-5 md:p-6 text-center`}>
              <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">✅</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 uppercase font-medium">Tasks</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(dashboardData.tasksProgress)}%</div>
            </div>
            <div className={`${glassClass} rounded-xl p-4 sm:p-5 md:p-6 text-center`}>
              <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">👁️</div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 uppercase font-medium">Visions</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(dashboardData.visionsProgress)}%</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-50 to-purple-50 border border-yellow-200/50 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🚀</span>
              Let's get started! Every step counts toward your vision!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Journal Entries */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-purple-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent Journal Entries</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Your latest reflections with mood indicators</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.recentJournalEntries.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Recent Journal Entries</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Your journal entries will appear here as you start documenting your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent font-semibold">journey</span>!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
                <Button
                  onClick={() => handleQuickAction("journal")}
                  className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Journaling
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickAction("notes")}
                  className="border-gray-300 px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Quick Note
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardData.recentJournalEntries.map((entry: any) => (
                <div
                  key={entry.id}
                  className={`${glassClass} rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 border-teal-200/30`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full text-xs font-semibold text-purple-700">
                      {entry.mood}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg leading-tight">{entry.title || "Untitled Entry"}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-3 sm:mb-4 leading-relaxed">{entry.reflection}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border border-gray-300 hover:bg-gray-50 rounded-lg text-xs sm:text-sm"
                    onClick={() => handleQuickAction("journal")}
                  >
                    View Full Entry
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Gallery */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-yellow-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Achievement Gallery</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Your recent accomplishments and recognition</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.recentAchievements.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-100 to-purple-100 flex items-center justify-center">
                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Recent Achievements</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Your achievements will appear here as you start building your{" "}
                <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent font-semibold">success</span> portfolio!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
                <Button
                  onClick={() => handleQuickAction("achievements")}
                  className="bg-gradient-to-r from-yellow-500 to-purple-600 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickAction("goals")}
                  className="border-gray-300 px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Set Goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardData.recentAchievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className={`${glassClass} rounded-xl p-4 sm:p-5 md:p-6 text-center hover:shadow-xl transition-all duration-300 border-yellow-200/30`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <Trophy className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-base sm:text-lg leading-tight">{achievement.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{new Date(achievement.date).toLocaleDateString()}</p>
                  {achievement.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">{achievement.description}</p>
                  )}
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    Achievement
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-red-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Deadlines</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Goals and tasks with approaching deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-100 to-purple-100 flex items-center justify-center">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Upcoming Deadlines</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Set some goal deadlines to stay{" "}
                <span className="bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent font-semibold">on track</span> and organized!
              </p>
              <Button
                onClick={() => handleQuickAction("goals")}
                className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Target className="h-4 w-4 mr-2" />
                Set Deadlines
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.upcomingDeadlines.map((goal: any) => {
                const deadlineDate = new Date(goal.deadline!);
                const daysUntilDeadline = Math.ceil(
                  (deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isUrgent = daysUntilDeadline <= 3;
                const isNear = daysUntilDeadline <= 7 && !isUrgent;

                return (
                  <div
                    key={goal.id}
                    className={`rounded-xl p-3 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-xl ${
                      isUrgent
                        ? "bg-red-50/70 border-red-300/50"
                        : isNear
                        ? "bg-yellow-50/70 border-yellow-300/50"
                        : `${glassClass} border-purple-200/30`
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-md">
                        !
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-base sm:text-lg leading-tight">{goal.title}</h4>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 flex-wrap">
                          <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            {deadlineDate.toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              isUrgent
                                ? "bg-red-100 text-red-700"
                                : isNear
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {daysUntilDeadline === 1 ? "Tomorrow" : `${daysUntilDeadline} days`}
                          </span>
                        </div>
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                            <span>Progress</span>
                            <span className="font-semibold">{goal.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${
                                isUrgent
                                  ? "bg-red-500"
                                  : isNear
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${goal.progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction("goals")}
                          className="w-full border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                        >
                          Review Goal
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className={`${glassClass} rounded-xl sm:rounded-2xl border-purple-200/50 mx-3 sm:mx-4 md:mx-6`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Activity Timeline</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">Recent actions across all your data</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.activityTimeline.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-100 to-purple-100 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Recent Activity</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4">
                Your activity timeline will appear here as you start using the app and creating your visions, goals, and tasks!
              </p>
              <Button
                onClick={() => handleQuickAction("vision")}
                className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Eye className="h-4 w-4 mr-2" />
                Create Vision
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.activityTimeline.slice(0, 8).map((item: any, index: number) => {
                const getIcon = (type: string) => {
                  const icons = {
                    vision: <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />,
                    goal: <Target className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />,
                    task: <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />,
                    idea: <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />,
                    note: <StickyNote className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />,
                    journal: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />,
                    achievement: <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />,
                  };
                  return icons[type as keyof typeof icons] || <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
                };

                const title = "title" in item ? item.title : "Untitled";
                const description = "description" in item && item.description ? item.description.substring(0, 80) + "..." : "";

                return (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className={`${glassClass} rounded-xl p-3 sm:p-4 md:p-5 border-l-4 border-purple-500/30 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2 flex-wrap gap-1">
                          <span className="text-xs font-semibold uppercase text-purple-600 tracking-wide">
                            {item.type}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 leading-tight">{title}</h4>
                        {description && <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scroll Buttons */}
      <ScrollButtons showOnMobile={true} showOnDesktop={true} />
    </div>
  );
}

// Updated StatCard with glass and brand colors
type StatCardProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
  detail: string;
  badge?: { text: string; icon: React.ReactNode };
  color?: "purple" | "teal" | "gold";
  glassClass: string;
};

function StatCard({ icon, value, label, detail, badge, color = "purple", glassClass }: StatCardProps) {
  const colorClasses = {
    purple: "from-purple-600 to-purple-700",
    teal: "from-teal-500 to-teal-600",
    gold: "from-yellow-500 to-yellow-600",
  };

  const iconBg = colorClasses[color];

  return (
    <Card className={`${glassClass} rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-lg border-purple-200/50`}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`p-2.5 sm:p-3 md:p-4 rounded-xl bg-gradient-to-br ${iconBg} shadow-lg text-white flex items-center justify-center ring-2 ring-white/20`}>
            <div className="text-white [&>svg]:text-white [&>svg]:stroke-white [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6">
              {icon}
            </div>
          </div>
          <span className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${iconBg} bg-clip-text text-transparent`}>{value}</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 sm:mb-2">{label}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
        {badge && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200/50">
            <div className="[&>svg]:h-3 [&>svg]:w-3 sm:[&>svg]:h-3.5 sm:[&>svg]:w-3.5">{badge.icon}</div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{badge.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Updated MomentumItem
type MomentumItemProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  glassClass: string;
};

function MomentumItem({ icon, value, label, glassClass }: MomentumItemProps) {
  return (
    <Card className={`${glassClass} rounded-xl text-center hover:shadow-xl transition-all duration-300 border-teal-200/30`}>
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-center mb-3 sm:mb-4 text-purple-600 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">{icon}</div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">{value}</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">{label}</div>
      </CardContent>
    </Card>
  );
}

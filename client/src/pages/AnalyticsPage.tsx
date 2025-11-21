import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Trophy, Target, CheckCircle, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function AnalyticsPage() {
  const { visions, goals, tasks, ideas, notes, journal } = useAppContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    let start: Date;
    
    switch (selectedTimeframe) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(0);
    }

    const filteredGoals = goals.filter((g: any) => new Date(g.createdAt) >= start);
    const filteredTasks = tasks.filter((t: any) => new Date(t.createdAt) >= start);

    const totalVisions = visions.length;
    const activeVisions = visions.filter((v: any) => v.status === 'Active').length;
    const totalGoals = filteredGoals.length;
    const completedGoals = filteredGoals.filter((g: any) => g.status === 'Completed').length;
    const inProgressGoals = filteredGoals.filter((g: any) => g.status === 'In Progress').length;
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter((t: any) => t.status === 'Done').length;
    const inProgressTasks = filteredTasks.filter((t: any) => t.status === 'In Progress').length;

    const goalCompletionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const productivityScore = Math.round((goalCompletionRate + taskCompletionRate) / 2);

    return {
      totalVisions,
      activeVisions,
      totalGoals,
      completedGoals,
      inProgressGoals,
      totalTasks,
      completedTasks,
      inProgressTasks,
      goalCompletionRate,
      taskCompletionRate,
      productivityScore,
    };
  }, [visions, goals, tasks, selectedTimeframe]);

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const productivityLevel = getProductivityLevel(analytics.productivityScore);
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
            <p className="text-gray-600">Track your progress and discover productivity patterns</p>
          </div>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 justify-center">
        {[
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'year', label: 'This Year' }
        ].map((timeframe) => (
          <Button
            key={timeframe.value}
            variant={selectedTimeframe === timeframe.value ? "default" : "outline"}
            onClick={() => setSelectedTimeframe(timeframe.value as 'week' | 'month' | 'year')}
            className={selectedTimeframe === timeframe.value ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white" : ""}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>

      {/* Productivity Score */}
      <Card className={glassClass}>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Trophy className="h-12 w-12 text-amber-500" />
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-2">Overall Productivity Score</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                {analytics.productivityScore}
              </div>
              <p className="text-gray-500 text-sm">/ 100</p>
            </div>
            <Badge className={`${productivityLevel.bg} ${productivityLevel.color} text-sm px-4 py-1`}>
              {productivityLevel.level}
            </Badge>
            <p className="text-sm text-gray-600">Based on your goal completion, task performance, and vision activity</p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{analytics.activeVisions}/{analytics.totalVisions}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Active Visions</p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-teal-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{analytics.completedGoals}/{analytics.totalGoals}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Goals Completed</p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{analytics.completedTasks}/{analytics.totalTasks}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Tasks Completed</p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardContent className="p-6 text-center">
            <PieChart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-gray-900">{ideas.length + notes.length + journal.length}</p>
            <p className="text-xs uppercase tracking-wide text-gray-600">Total Captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rates */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Completion Rate</span>
                <span className="text-purple-600">{analytics.goalCompletionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-teal-500 transition-all duration-500"
                  style={{ width: `${analytics.goalCompletionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-semibold text-gray-900">{analytics.totalGoals - analytics.completedGoals - analytics.inProgressGoals}</p>
                <p className="text-gray-600">Not Started</p>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-semibold text-blue-700">{analytics.inProgressGoals}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="font-semibold text-green-700">{analytics.completedGoals}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Task Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Completion Rate</span>
                <span className="text-teal-600">{analytics.taskCompletionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${analytics.taskCompletionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-semibold text-gray-900">{analytics.totalTasks - analytics.completedTasks - analytics.inProgressTasks}</p>
                <p className="text-gray-600">Todo</p>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-semibold text-blue-700">{analytics.inProgressTasks}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="font-semibold text-green-700">{analytics.completedTasks}</p>
                <p className="text-gray-600">Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Breakdown */}
      <Card className={glassClass}>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Productivity Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Goal Completion</span>
              <span className="text-sm font-semibold text-purple-600">{analytics.goalCompletionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-500"
                style={{ width: `${analytics.goalCompletionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Task Completion</span>
              <span className="text-sm font-semibold text-teal-600">{analytics.taskCompletionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${analytics.taskCompletionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Vision Activity</span>
              <span className="text-sm font-semibold text-purple-600">
                {((analytics.activeVisions / Math.max(analytics.totalVisions, 1)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-500"
                style={{ width: `${(analytics.activeVisions / Math.max(analytics.totalVisions, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {analytics.totalGoals === 0 && analytics.totalTasks === 0 && (
        <Card className={glassClass}>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Yet</h3>
            <p className="text-gray-600">
              Create some visions, goals, and tasks to see your analytics and insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


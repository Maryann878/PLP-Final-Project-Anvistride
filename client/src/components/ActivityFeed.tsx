// client/src/components/ActivityFeed.tsx
import React from 'react';
import { useActivity } from '@/context/ActivityContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Plus, Edit, Trash2 } from 'lucide-react';

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return time.toLocaleDateString();
};

const ActivityFeed: React.FC = () => {
  const { activities } = useActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: any) => {
    const entityName = activity.entity.charAt(0).toUpperCase() + activity.entity.slice(1);
    const itemTitle = activity.itemTitle ? `"${activity.itemTitle}"` : 'item';
    
    switch (activity.type) {
      case 'add':
        return `Created ${entityName.toLowerCase()} ${itemTitle}`;
      case 'update':
        return activity.action 
          ? `${entityName} ${itemTitle} ${activity.action}`
          : `Updated ${entityName.toLowerCase()} ${itemTitle}`;
      case 'delete':
        return `Deleted ${entityName.toLowerCase()} ${itemTitle}`;
      default:
        return `Activity on ${entityName.toLowerCase()}`;
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Activity className="h-5 w-5 text-purple-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors border-l-2 border-purple-200"
            >
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(activity)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;


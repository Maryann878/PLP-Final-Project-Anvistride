import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/NotificationContext";
import { Bell, Check, Trash2, Search, Settings, Info, Clock, Star, X } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
  } = useNotifications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'reminder' | 'update' | 'achievement'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesFilter = filter === 'all' || notification.type === filter || (filter === 'unread' && !notification.isRead);
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [notifications, filter, searchQuery]);

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

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
      {/* Enhanced Header - Modern & Professional */}
      <div className="relative">
        <div className={`${glassClass} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5 flex-1">
              {/* Enhanced Icon with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                  <Bell className="h-7 w-7 sm:h-8 sm:w-8" />
                  {/* Unread count badge */}
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent tracking-tight leading-tight">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg ring-2 ring-white/50">
                      {unreadCount} {unreadCount === 1 ? 'new' : 'new'}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Stay updated with your progress and important updates</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex-1 sm:flex-initial"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  onClick={markAllAsRead}
                  className="bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:from-purple-700 hover:to-teal-600 flex-1 sm:flex-initial shadow-lg"
                >
                  <Check className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Mark All Read</span>
                  <span className="sm:hidden">Mark Read</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className={glassClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notification Preferences</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-gray-700">Goal completion notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-gray-700">Task due reminders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-gray-700">Achievement notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-gray-700">Weekly progress reminders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                <span className="text-gray-700">System updates</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm sm:text-base h-10 sm:h-11"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {(['all', 'unread', 'system', 'reminder', 'achievement'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className={`text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 ${
                filter === filterType 
                  ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white" 
                  : ""
              }`}
            >
              {filterType === 'all' 
                ? 'All' 
                : filterType === 'unread' 
                  ? `Unread${window.innerWidth >= 640 ? ` (${unreadCount})` : ''}` 
                  : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className={glassClass}>
          <CardContent className="p-8 sm:p-12 text-center">
            <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchQuery
                ? 'Try adjusting your search terms'
                : filter === 'unread'
                  ? 'All caught up! No unread notifications'
                  : 'You don\'t have any notifications yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${glassClass} ${!notification.isRead ? 'border-l-4 border-l-purple-500' : ''} hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.98]`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getPriorityColor(notification.priority)}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Timestamp Row */}
                    <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 ml-2">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    
                    {/* Message */}
                    <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed break-words line-clamp-3 sm:line-clamp-none">
                      {notification.message}
                    </p>
                    
                    {/* Action Button */}
                    {notification.actionUrl && notification.actionText && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                      >
                        {notification.actionText}
                      </Button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Mark as read"
                        className="h-8 w-8 p-0 hover:bg-purple-50"
                      >
                        <Check className="h-4 w-4 text-purple-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {notifications.some(n => n.isRead) && (
        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllRead}
            className="text-red-600 border-red-200 hover:bg-red-50 text-sm"
          >
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Clear Read Notifications</span>
            <span className="sm:hidden">Clear Read</span>
          </Button>
        </div>
      )}
    </div>
  );
}


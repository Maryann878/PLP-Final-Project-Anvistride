// client/src/components/chat/MessageBubble.tsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Message } from '@/api/chat';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }
    } catch {
      return '';
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3 sm:my-4">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-2 sm:gap-3 max-w-[75%] sm:max-w-[65%] md:max-w-[60%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md ring-2 ring-white dark:ring-gray-800 hover:scale-110 transition-transform duration-200">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} gap-1`}>
          {!isOwn && (
            <span className="text-xs text-gray-600 dark:text-gray-400 mb-0.5 px-2 font-medium">
              {message.senderName}
            </span>
          )}
          <div
            className={`rounded-2xl sm:rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200 ${
              isOwn
                ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white rounded-br-md sm:rounded-br-lg'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md sm:rounded-bl-lg'
            }`}
          >
            <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            {message.createdAt && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime(message.createdAt)}
              </span>
            )}
            {isOwn && (
              <div className="flex items-center">
                <CheckCheck className="h-3 w-3 text-white/70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;


// client/src/components/chat/MessageBubble.tsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Message } from '@/api/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs text-gray-600 mb-1 px-2">{message.senderName}</span>
          )}
          <div
            className={`rounded-2xl px-4 py-2 shadow-sm ${
              isOwn
                ? 'bg-gradient-to-br from-purple-600 to-teal-500 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          {message.createdAt && (
            <span className="text-xs text-gray-400 mt-1 px-2">
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;


// client/src/components/chat/ChatList.tsx
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { MessageCircle, Users, Circle } from 'lucide-react';
// Format time ago helper
const formatTimeAgo = (timestamp?: string): string => {
  if (!timestamp) return '';
  try {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  } catch {
    return '';
  }
};

const ChatList: React.FC = () => {
  const { chats, activeChat, setActiveChat, onlineUsers } = useChat();
  const { user } = useAuth();

  const formatTime = formatTimeAgo;

  const getChatName = (chat: any) => {
    if (chat.isGroup) return chat.name || 'Anvistride Community';
    if (chat.otherParticipant) return chat.otherParticipant.name;
    return 'Private Chat';
  };

  const getChatPreview = (chat: any) => {
    if (chat.lastMessage) {
      return chat.lastMessage.content;
    }
    return 'No messages yet';
  };

  const isOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {chats.map((chat) => {
          const isActive = activeChat?._id === chat._id;
          const chatName = getChatName(chat);
          const preview = getChatPreview(chat);
          const isGroup = chat.isGroup || chat.type === 'group';
          const otherUserId = chat.otherParticipant?._id;

          return (
            <Card
              key={chat._id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 to-teal-50 border-purple-300 shadow-md'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                    {isGroup ? (
                      <Users className="h-6 w-6" />
                    ) : (
                      <span className="text-lg">
                        {chatName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {!isGroup && otherUserId && isOnline(otherUserId) && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-green-500 fill-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chatName}</h3>
                    {chat.lastActivity && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(chat.lastActivity)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{preview}</p>
                  {isGroup && (
                    <div className="mt-1 flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {onlineUsers.length} online
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;


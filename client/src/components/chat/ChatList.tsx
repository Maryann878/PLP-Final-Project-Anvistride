// client/src/components/chat/ChatList.tsx
import React, { useMemo } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { MessageCircle, Users, Circle } from 'lucide-react';

interface ChatListProps {
  searchQuery?: string;
}
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

const ChatList: React.FC<ChatListProps> = ({ searchQuery = '' }) => {
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

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const chatName = getChatName(chat).toLowerCase();
      const preview = getChatPreview(chat).toLowerCase();
      return chatName.includes(query) || preview.includes(query);
    });
  }, [chats, searchQuery]);

  return (
    <div className="h-full overflow-y-auto min-h-0 flex flex-col">
      {filteredChats.length === 0 ? (
        <div className="flex items-center justify-center h-full p-4 sm:p-8 text-center">
          <div>
            <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm sm:text-base font-medium text-gray-600 mb-1 sm:mb-2">
              {searchQuery ? 'No chats found' : 'No conversations, yet'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 px-2">
              {searchQuery ? 'Try a different search term' : 'Start a new chat to get started'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-2.5 flex-1">
          {filteredChats.map((chat) => {
          const isActive = activeChat?._id === chat._id;
          const chatName = getChatName(chat);
          const preview = getChatPreview(chat);
          const isGroup = chat.isGroup || chat.type === 'group';
          const otherUserId = chat.otherParticipant?._id;

          return (
            <Card
              key={chat._id}
              className={`p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 via-purple-50/50 to-teal-50 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-teal-900/30 border-purple-300 dark:border-purple-700 shadow-lg ring-2 ring-purple-200 dark:ring-purple-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => {
                setActiveChat(chat);
                // On mobile, hide chat list after selection
                if (window.innerWidth < 768) {
                  // This will be handled by parent component
                }
              }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="relative flex-shrink-0 group">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-gray-800 transition-transform duration-300 ${isActive ? 'ring-purple-300 dark:ring-purple-700 scale-110' : 'group-hover:scale-110'}`}>
                    {isGroup ? (
                      <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                    ) : (
                      <span className="text-lg sm:text-xl">
                        {chatName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {!isGroup && otherUserId && isOnline(otherUserId) && (
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <Circle className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-green-500 fill-green-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <h3 className={`font-bold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base transition-colors ${isActive ? 'text-purple-700 dark:text-purple-300' : ''}`}>
                      {chatName}
                    </h3>
                    {chat.lastActivity && (
                      <span className={`text-xs flex-shrink-0 transition-colors ${isActive ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatTime(chat.lastActivity)}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm truncate mb-1 transition-colors ${isActive ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {preview}
                  </p>
                  {isGroup && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="relative">
                        <MessageCircle className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                        <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20"></div>
                      </div>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
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
      )}
    </div>
  );
};

export default ChatList;


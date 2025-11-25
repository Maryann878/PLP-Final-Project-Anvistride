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
        <div className="p-2 sm:p-3 md:p-4 space-y-2 flex-1">
          {filteredChats.map((chat) => {
          const isActive = activeChat?._id === chat._id;
          const chatName = getChatName(chat);
          const preview = getChatPreview(chat);
          const isGroup = chat.isGroup || chat.type === 'group';
          const otherUserId = chat.otherParticipant?._id;

          return (
            <Card
              key={chat._id}
              className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 to-teal-50 border-purple-300 shadow-md'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveChat(chat);
                // On mobile, hide chat list after selection
                if (window.innerWidth < 768) {
                  // This will be handled by parent component
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                    {isGroup ? (
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <span className="text-base sm:text-lg">
                        {chatName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {!isGroup && otherUserId && isOnline(otherUserId) && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 fill-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{chatName}</h3>
                    {chat.lastActivity && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.lastActivity)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{preview}</p>
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
      )}
    </div>
  );
};

export default ChatList;


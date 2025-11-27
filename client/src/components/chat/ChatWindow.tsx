// client/src/components/chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Users, Loader2, MessageCircle, ArrowLeft } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useSocket } from '@/context/SocketContext';

interface ChatWindowProps {
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const { activeChat, messages, sendMessage, isTyping, onlineUsers } = useChat();
  const { user } = useAuth();
  const { isConnected, emit } = useSocket();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (isConnected && activeChat) {
      emit('chat:typing', {
        chatId: activeChat._id,
        isTyping: true,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emit('chat:typing', {
          chatId: activeChat._id,
          isTyping: false,
        });
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !activeChat) return;

    setSending(true);
    try {
      await sendMessage(input.trim());
      setInput('');

      // Stop typing indicator
      if (isConnected && activeChat) {
        emit('chat:typing', {
          chatId: activeChat._id,
          isTyping: false,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!activeChat) {
    return (
      <Card className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Select a chat to start messaging</p>
        </div>
      </Card>
    );
  }

  const isGroup = activeChat.isGroup || activeChat.type === 'group';
  const chatName = isGroup
    ? activeChat.name || 'Anvistride Community'
    : activeChat.otherParticipant?.name || 'Private Chat';

  // Get typing users (excluding self)
  const typingUsers = Object.entries(isTyping)
    .filter(([userId, typing]) => typing && userId !== user?.id)
    .map(([userId]) => userId);

  return (
    <Card className="h-full flex flex-col bg-white rounded-none sm:rounded-xl md:rounded-2xl shadow-none sm:shadow-sm overflow-hidden m-0">
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 via-purple-50/80 to-teal-50 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-teal-900/30 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Mobile back button */}
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="md:hidden p-2 flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="relative group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-gray-800 hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {isGroup ? (
                  <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <span className="text-lg sm:text-xl">{chatName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {!isGroup && (
                <div className="absolute -bottom-0.5 -right-0.5">
                  <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg mb-1">
                {chatName}
              </h3>
              <div className="flex items-center gap-2">
                {isGroup && (
                  <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    {onlineUsers.length} online
                  </p>
                )}
                {typingUsers.length > 0 && (
                  <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium animate-pulse flex items-center gap-1">
                    <div className="flex gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    {typingUsers.length === 1 ? 'typing...' : 'people typing...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50 min-h-0 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 px-4">
            <div className="text-center max-w-sm animate-in fade-in zoom-in-95 duration-500">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 via-purple-50 to-teal-100 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-teal-900/30 flex items-center justify-center shadow-lg ring-4 ring-purple-100/50 dark:ring-purple-900/30">
                <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400 dark:text-purple-500" />
                <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping"></div>
              </div>
              <p className="text-lg sm:text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">
                No messages yet
              </p>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                Be the first to start the conversation!
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <div className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-1 w-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 sm:space-y-2 max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <MessageBubble key={message._id || index} message={message} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 shadow-lg" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl sm:rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 text-sm sm:text-base transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 hover:border-purple-400 dark:hover:border-purple-600"
              disabled={sending || !isConnected}
              autoFocus={false}
            />
            {!isConnected && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || sending || !isConnected}
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 text-white px-5 sm:px-7 h-auto py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl flex-shrink-0 min-w-[48px] sm:min-w-[56px] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-2 px-1">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Reconnecting to server...</span>
          </p>
        )}
      </form>
    </Card>
  );
};

export default ChatWindow;


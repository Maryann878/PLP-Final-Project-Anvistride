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
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-teal-50 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile back button */}
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="md:hidden p-2 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              {isGroup ? (
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <span className="text-base sm:text-lg">{chatName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{chatName}</h3>
              {isGroup && (
                <p className="text-xs text-gray-600">{onlineUsers.length} online</p>
              )}
              {typingUsers.length > 0 && (
                <p className="text-xs text-purple-600 animate-pulse">
                  {typingUsers.length === 1 ? 'Someone is typing...' : 'People are typing...'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 px-4">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
              </div>
              <p className="text-base sm:text-lg font-semibold mb-2 text-gray-700">No messages yet</p>
              <p className="text-sm sm:text-base text-gray-500">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 sm:space-y-2">
            {messages.map((message, index) => (
              <MessageBubble key={message._id || index} message={message} />
            ))}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base transition-all"
            disabled={sending || !isConnected}
            autoFocus={false}
          />
          <Button
            type="submit"
            disabled={!input.trim() || sending || !isConnected}
            className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white px-4 sm:px-6 h-auto py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex-shrink-0 min-w-[44px] sm:min-w-[56px]"
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
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Reconnecting...
          </p>
        )}
      </form>
    </Card>
  );
};

export default ChatWindow;


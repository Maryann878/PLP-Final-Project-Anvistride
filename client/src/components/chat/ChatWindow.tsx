// client/src/components/chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Users, Loader2, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useSocket } from '@/context/SocketContext';

const ChatWindow: React.FC = () => {
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
    <Card className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold">
              {isGroup ? (
                <Users className="h-5 w-5" />
              ) : (
                <span>{chatName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{chatName}</h3>
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={message._id || index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={sending || !isConnected}
          />
          <Button
            type="submit"
            disabled={!input.trim() || sending || !isConnected}
            className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white px-6"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">Reconnecting...</p>
        )}
      </form>
    </Card>
  );
};

export default ChatWindow;


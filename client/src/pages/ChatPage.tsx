// client/src/pages/ChatPage.tsx
import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Users, Search, UserPlus, X } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import API from '@/lib/axios';
import { getGlobalToast } from '@/lib/toast';

const ChatPage: React.FC = () => {
  const { activeChat, setActiveChat, startPrivateChat, loadChats } = useChat();
  const { user } = useAuth();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await API.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.filter((u: any) => u.id !== user?.id));
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      await startPrivateChat(userId);
      setShowNewChat(false);
      setSearchQuery('');
      setSearchResults([]);
      setShowChatList(false); // Hide chat list on mobile after selecting
    } catch (error) {
      const toast = getGlobalToast();
      toast?.({
        title: 'Error',
        description: 'Failed to start chat',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] flex flex-col p-4 md:p-6 gap-4">
      {/* Header */}
      <Card className={`${glassClass} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-xl">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                Chat
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Connect with the community and accountability partners
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewChat(true)}
            className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </Card>

      {/* Chat Interface */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat List - Desktop always visible, mobile toggle */}
        <div
          className={`${
            showChatList ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white rounded-xl overflow-hidden`}
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-teal-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
              {!showChatList && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatList(true)}
                  className="md:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <ChatList />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeChat ? (
            <>
              {/* Mobile: Show back button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveChat(null);
                  setShowChatList(true);
                }}
                className="md:hidden mb-2 self-start"
              >
                ← Back to chats
              </Button>
              <ChatWindow />
            </>
          ) : (
            <Card className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-medium mb-2">No chat selected</p>
                <p className="text-sm">Choose a conversation or start a new one</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className={`${glassClass} rounded-3xl max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Start New Chat
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchUsers(e.target.value);
                }}
                className="pl-10"
              />
            </div>

            {searching && (
              <div className="text-center py-4 text-gray-500">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleStartChat(result.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold">
                      {result.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.email}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white"
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && !searching && searchResults.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No users found
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Search for users to start a private chat</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;


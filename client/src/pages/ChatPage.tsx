// client/src/pages/ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Users, Search, UserPlus, X, ArrowLeft, Menu } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import API from '@/lib/axios';
import { getGlobalToast } from '@/lib/toast';

const ChatPage: React.FC = () => {
  const { activeChat, setActiveChat, startPrivateChat, loadChats, chats } = useChat();
  const { user } = useAuth();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  // On mobile, show chat list by default if no active chat
  const [showChatList, setShowChatList] = useState(true);
  const [chatListSearch, setChatListSearch] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  // Debounced user search
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

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearchUsers(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // On mobile, hide chat list when chat is selected, show when no chat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChatList(true);
      } else {
        // On mobile, show list when no chat, hide when chat is active
        setShowChatList(!activeChat);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  const handleStartChat = async (userId: string) => {
    try {
      await startPrivateChat(userId);
      setShowNewChat(false);
      setSearchQuery('');
      setSearchResults([]);
      // On mobile, hide chat list after selecting
      if (window.innerWidth < 768) {
        setShowChatList(false);
      }
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
    <div className="space-y-2 sm:space-y-3 p-2 sm:p-3 md:p-4 w-full max-w-full overflow-x-hidden h-full flex flex-col">
      {/* Enhanced Header - Modern & Professional */}
      <div className="relative w-full flex-shrink-0">
        <div className={`${glassClass} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Enhanced Logo Container with glow effect */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-xl shadow-purple-500/30 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-purple-400/15 to-teal-400/20 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center justify-center p-2">
                    <img 
                      src="/Anvistride_logo.png" 
                      alt="Anvistride" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-3 w-3 text-white stroke-[2.5]" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">Famz</span>
                    <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Stride</span>
                  </h1>
                  <span className="px-2 py-1 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-300 dark:border-amber-700">
                    FS
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                  Connect with accountability partners and the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Statistics - Compact */}
      <div className="flex items-center justify-between gap-2 w-full flex-shrink-0">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-50 via-amber-50/50 to-teal-50 dark:from-purple-900/20 dark:via-amber-900/10 dark:to-teal-900/20 border border-purple-200/50 dark:border-purple-800/50 shadow-sm flex-1 sm:flex-initial group">
          <div className="relative">
            <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 animate-pulse ring-1 ring-white dark:ring-gray-800"></div>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{chats.length}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium hidden sm:inline">Active Chats</span>
        </div>
        <Button
          onClick={() => setShowNewChat(true)}
          className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 px-4 py-2 rounded-lg text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span className="font-medium">New Chat</span>
        </Button>
      </div>

      {/* Chat Interface - Dynamic height calculation */}
      <div className="flex-1 flex gap-0 sm:gap-2 md:gap-3 min-h-0 relative overflow-hidden w-full max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-15rem)]">
        {/* Chat List - Desktop always visible, mobile toggle */}
        <div
          className={`${
            showChatList ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 xl:w-[28rem] border-r-0 md:border-r border-gray-200 bg-white rounded-none sm:rounded-xl md:rounded-2xl overflow-hidden shadow-none sm:shadow-sm h-full max-w-full`}
        >
          {/* Mobile header with back button - only show if we're in chat list view */}
          {showChatList && (
            <div className="md:hidden p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 flex items-center gap-3 flex-shrink-0 w-full">
              <h2 className="font-semibold text-gray-900 flex-1 text-base min-w-0">Conversations</h2>
              <Button
                onClick={() => setShowNewChat(true)}
                variant="ghost"
                size="sm"
                className="p-2 flex-shrink-0"
                aria-label="New chat"
              >
                <UserPlus className="h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 w-full flex-shrink-0">
            <div className="flex items-center justify-between mb-2 hidden md:flex">
              <h2 className="font-semibold text-gray-900 text-sm">Conversations</h2>
            </div>
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search chats..."
                value={chatListSearch}
                onChange={(e) => setChatListSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 h-9 text-sm"
              />
            </div>
          </div>
          <ChatList searchQuery={chatListSearch} />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 h-full w-full max-w-full">
          {activeChat ? (
            <ChatWindow 
              onBack={() => {
                setActiveChat(null);
                if (window.innerWidth < 768) {
                  setShowChatList(true);
                }
              }}
            />
          ) : (
            <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-teal-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-teal-900/10 rounded-none sm:rounded-xl md:rounded-2xl m-0 w-full border-0 shadow-lg">
              <div className="text-center text-gray-500 dark:text-gray-400 px-4 w-full">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-5 rounded-2xl bg-gradient-to-br from-purple-100 via-purple-50 to-teal-100 dark:from-purple-900/30 dark:via-purple-900/20 dark:to-teal-900/30 flex items-center justify-center p-4 shadow-xl border-2 border-purple-200/50 dark:border-purple-800/50 ring-2 ring-purple-100/30 dark:ring-purple-900/20">
                  <img 
                    src="/Anvistride_logo.png" 
                    alt="Anvistride" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Join Your <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Famz</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 px-4 max-w-md mx-auto leading-relaxed">
                  Connect with your stride family, accountability partners, or choose a conversation to continue your journey
                </p>
                <Button
                  onClick={() => setShowNewChat(true)}
                  className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white text-sm shadow-md hover:shadow-lg transition-all duration-300 px-4 py-2"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className={`${glassClass} rounded-2xl sm:rounded-3xl max-w-md mx-4 sm:mx-auto max-h-[85vh] flex flex-col`}>
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Start New Chat
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base"
                autoFocus
              />
            </div>

            {searching && (
              <div className="text-center py-8 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mb-2"></div>
                <p className="text-sm">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2.5 flex-1 overflow-y-auto min-h-0">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-300 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md group"
                    onClick={() => handleStartChat(result.id)}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-gray-800 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {result.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg">{result.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">{result.email}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 px-4 py-2 rounded-xl font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartChat(result.id);
                      }}
                    >
                      Chat
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && !searching && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No users found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-8 text-gray-500 flex-1 flex items-center justify-center">
                <div>
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium text-gray-600">Search for users</p>
                  <p className="text-sm mt-1 text-gray-500">Enter a name or email to find users</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;


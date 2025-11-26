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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header - FamzStride - Creative Branded Design */}
      <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 overflow-hidden relative`}>
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-teal-50/50 dark:from-purple-900/10 dark:to-teal-900/10 pointer-events-none"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Creative Logo Container with Gold Accent */}
              <div className="relative group">
                {/* Main logo container with gradient border */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 via-amber-500 to-teal-500 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-xl shadow-purple-500/30 ring-2 ring-white/20 overflow-hidden">
                    {/* Animated pulsing glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-purple-400/20 to-teal-400/30 rounded-2xl animate-pulse-slow"></div>
                    {/* Logo - maintaining uniformity */}
                    <div className="relative z-10 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform duration-500">
                      <img 
                        src="/Anvistride_logo.png" 
                        alt="Anvistride" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                {/* Modern message icon badge - Professional design */}
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-xl shadow-amber-500/50 ring-1 ring-amber-400/30">
                  <MessageCircle className="h-3 w-3 text-white stroke-[2.5]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">Famz</span>
                    <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">Stride</span>
                  </h1>
                  <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] sm:text-xs font-bold rounded-full border border-amber-300 dark:border-amber-700 shadow-sm">
                    FS
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
                  Your stride family - connect with accountability partners and the community
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Statistics - Compact */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 via-amber-50/50 to-teal-50 dark:from-purple-900/20 dark:via-amber-900/10 dark:to-teal-900/20 border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
          <div className="relative">
            <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{chats.length}</span>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Famz Members</span>
        </div>
        <Button
          onClick={() => setShowNewChat(true)}
          className="hidden sm:flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <UserPlus className="h-5 w-5" />
          New Chat
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-20rem)] md:h-[calc(100vh-18rem)] flex gap-0 sm:gap-2 md:gap-4 min-h-0 relative overflow-hidden">
        {/* Chat List - Desktop always visible, mobile toggle */}
        <div
          className={`${
            showChatList ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 xl:w-[28rem] border-r-0 md:border-r border-gray-200 bg-white rounded-none sm:rounded-xl md:rounded-2xl overflow-hidden shadow-none sm:shadow-sm h-full`}
        >
          {/* Mobile header with back button - only show if we're in chat list view */}
          {showChatList && (
            <div className="md:hidden p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 flex items-center gap-3 flex-shrink-0">
              <h2 className="font-semibold text-gray-900 flex-1 text-base">Conversations</h2>
              <Button
                onClick={() => setShowNewChat(true)}
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="New chat"
              >
                <UserPlus className="h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
            <div className="flex items-center justify-between mb-3 hidden md:flex">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search chats..."
                value={chatListSearch}
                onChange={(e) => setChatListSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 h-10 text-sm"
              />
            </div>
          </div>
          <ChatList searchQuery={chatListSearch} />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
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
            <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10 rounded-none sm:rounded-xl md:rounded-2xl m-0">
              <div className="text-center text-gray-500 dark:text-gray-400 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 flex items-center justify-center p-4 shadow-lg border-2 border-purple-200/50 dark:border-purple-800/50">
                  <img 
                    src="/Anvistride_logo.png" 
                    alt="Anvistride" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-gray-700 dark:text-gray-300">
                  Join Your <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Famz</span>
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 px-2">Connect with your stride family, accountability partners, or choose a conversation to continue your journey</p>
                <Button
                  onClick={() => setShowNewChat(true)}
                  className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300"
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
              <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                    onClick={() => handleStartChat(result.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                      {result.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{result.name}</p>
                      <p className="text-sm text-gray-600 truncate">{result.email}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white flex-shrink-0"
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


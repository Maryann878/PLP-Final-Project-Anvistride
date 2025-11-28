import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGlobalToast } from "@/lib/toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, Database, User, Palette, Info, Download, Upload, Trash2, AlertTriangle, LogOut, CheckCircle, Quote, Eye, Target, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const DAILY_INSPIRATION_KEY = "anvistride_dailyInspiration";

export default function SettingsPage() {
  const { logout } = useAuth();
  const { visions, goals, tasks, ideas, notes, journal, achievements } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [showDailyInspiration, setShowDailyInspiration] = useState(() => {
    const saved = localStorage.getItem(DAILY_INSPIRATION_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save daily inspiration preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(DAILY_INSPIRATION_KEY, JSON.stringify(showDailyInspiration));
  }, [showDailyInspiration]);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = {
        visions,
        goals,
        tasks,
        ideas,
        notes,
        journal,
        achievements,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anvistride-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const toast = getGlobalToast();
      toast?.({
        title: "Success!",
        description: "Data exported successfully!",
        variant: "success",
      });
    } catch {
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure (basic check)
      if (!data.visions || !data.goals || !data.tasks) {
        throw new Error('Invalid data format');
      }
      
      // Store in localStorage (assuming AppContext loads from it)
      localStorage.setItem('anvistride-app-state', JSON.stringify(data));
      
      const toast = getGlobalToast();
      toast?.({
        title: "Success!",
        description: "Data imported successfully! Refreshing page...",
        variant: "success",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.clear();
      
      const toast = getGlobalToast();
      toast?.({
        title: "Success!",
        description: "All data cleared successfully!",
        variant: "success",
      });
      setShowConfirmClear(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: "Failed to clear data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Modern & Professional */}
      <div className="relative">
        <div className={`${glassClass} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Enhanced Icon with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                  <Settings className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Settings
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Manage your account and data preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="data" className="w-full">
        <Card className={`${glassClass} border-purple-200/50 p-2 sm:p-3`}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-transparent p-0 gap-2 h-auto">
            <TabsTrigger 
              value="data" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Data Management</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="display" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Display</span>
              <span className="sm:hidden">Theme</span>
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <Info className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">About</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          </TabsList>
        </Card>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
              <span>Data Management</span>
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-purple-600 to-teal-500 w-full rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Export Data Card */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5 sm:p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-2">Export Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Download all your data as a JSON backup file</p>
                <Button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* Import Data Card */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5 sm:p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-2">Import Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Restore your data from a backup file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-600/30 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Choose File
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Clear All Data Card - Full Width */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-900/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mt-4 sm:mt-6">
            <CardContent className="p-5 sm:p-6">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-2">Clear All Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Permanently delete all your data. This action cannot be undone.</p>
              {!showConfirmClear ? (
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmClear(true)}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-2 border-red-600 hover:border-red-700 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm sm:text-base font-semibold text-red-700 dark:text-red-300">Are you absolutely sure? This action cannot be undone.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmClear(false)}
                      disabled={isLoading}
                      className="flex-1 sm:flex-initial border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleClearData}
                      disabled={isLoading}
                      className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Confirm Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
              <span>Account Settings</span>
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-purple-600 to-teal-500 w-full rounded-full"></div>
          </div>

          <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50`}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-br from-red-50/50 to-white dark:from-red-900/20 dark:to-gray-800 rounded-xl border-2 border-red-200/50 dark:border-red-800/50 hover:shadow-lg hover:border-red-300/50 dark:hover:border-red-700/50 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg mb-1">Log Out</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Sign out of your account and return to the landing page</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full sm:w-auto text-red-600 dark:text-red-400 border-2 border-red-400 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-500 dark:hover:border-red-500 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Preferences Tab */}
        <TabsContent value="display" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
              <span>Display Preferences</span>
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-purple-600 to-teal-500 w-full rounded-full"></div>
          </div>

          <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50`}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span>Display Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <PreferenceToggle
                label="Dark Mode"
                description="Switch between light and dark theme"
                enabled={theme === "dark"}
                onChange={(value) => {
                  toggleTheme();
                }}
              />
              <PreferenceToggle
                label="Daily Inspiration"
                description="Show motivational quotes on the dashboard"
                enabled={showDailyInspiration}
                onChange={(value) => {
                  setShowDailyInspiration(value);
                  localStorage.setItem(DAILY_INSPIRATION_KEY, JSON.stringify(value));
                }}
              />
              <PreferenceToggle
                label="Email Updates"
                description="Get notified about new features and roadmap wins"
                enabled={emailUpdates}
                onChange={setEmailUpdates}
              />
              <PreferenceToggle
                label="Weekly Stride Digest"
                description="Receive a recap of goals, tasks, and journal prompts"
                enabled={weeklyDigest}
                onChange={setWeeklyDigest}
              />
              <PreferenceToggle
                label="Beta Features"
                description="Try AI-powered insights and advanced analytics early"
                enabled={betaFeatures}
                onChange={setBetaFeatures}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6 sm:space-y-8 mt-4 sm:mt-6">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <Info className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
              <span>About Anvistride</span>
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-purple-600 to-teal-500 w-full rounded-full"></div>
          </div>

          {/* App Header */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 mb-4 sm:mb-6">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center p-2.5 shadow-md shadow-purple-500/10">
                    <img
                      src="/Anvistride_logo.png"
                      alt="Anvistride Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                  Anvistride
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">Vision into stride, one step at a time</p>
                <div className="flex justify-center gap-2 sm:gap-3 flex-wrap pt-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">Version 1.0.0</Badge>
                  <Badge variant="outline" className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Build 2025.1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            {/* Acronym and Stride - Side by Side */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Acronym */}
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-center">
                    What does <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Anvistride</span> mean?
                  </h4>
                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold">A</span>
                      <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm sm:text-base">new</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold">V</span>
                      <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm sm:text-base">ision</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">in</span>
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold">S</span>
                      <span className="text-amber-700 dark:text-amber-300 font-semibold text-sm sm:text-base">tride</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stride Explanation */}
              <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-md flex-shrink-0">
                      S
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300 mb-1">Stride <span className="text-sm font-normal text-gray-600 dark:text-gray-400 italic">(noun)</span></h3>
                      <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        A long, confident step forward in your journey toward your goals. 
                        It's the momentum you build when <span className="text-purple-700 dark:text-purple-300 font-semibold">clarity</span> meets <span className="text-teal-700 dark:text-teal-300 font-semibold">action</span>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inspiration */}
            <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-5 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-block p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 mb-2 sm:mb-3">
                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300">Our Inspiration</h4>
                </div>
                <blockquote className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border-l-4 border-purple-600 dark:border-purple-500 mb-3 sm:mb-4">
                  <p className="text-base sm:text-lg italic text-gray-800 dark:text-gray-200 font-medium mb-2 sm:mb-3 leading-relaxed">
                    "Write the vision and make it plain on tablets, that he may run who reads it."
                  </p>
                  <cite className="text-purple-700 dark:text-purple-300 font-semibold not-italic text-xs sm:text-sm">— Habakkuk 2:2</cite>
                </blockquote>
                <p className="text-sm sm:text-base leading-relaxed text-center text-gray-700 dark:text-gray-300">
                  This powerful verse inspired the creation of Anvistride. Just as the prophet Habakkuk was instructed to write down the vision clearly so others could run with it, we believe that writing down your personal vision and making it plain through structured planning enables you to <span className="text-purple-700 dark:text-purple-300 font-semibold">run with purpose</span> and <span className="text-teal-700 dark:text-teal-300 font-semibold">achieve your goals</span>.
                </p>
              </CardContent>
            </Card>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="inline-block p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 mb-2 sm:mb-3">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h4 className="text-purple-700 dark:text-purple-300 font-bold text-base sm:text-lg mb-2 sm:mb-3">Our Vision</h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    Empowering individuals to transform their aspirations into meaningful action through structured planning and consistent execution.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="inline-block p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 mb-2 sm:mb-3">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h4 className="text-teal-700 dark:text-teal-300 font-bold text-base sm:text-lg mb-2 sm:mb-3">Our Mission</h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    Help you turn your <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-semibold">vision</span> into <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-semibold">stride</span> by providing the tools, structure, and motivation needed to achieve your long-term goals.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features & Stats */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-base sm:text-lg">Core Features</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { title: "Vision & Planning", items: ["Vision Board", "Goal Setting", "Progress Tracking"] },
                      { title: "Productivity", items: ["Task Management", "Daily Planning", "Priorities"] },
                      { title: "Capture & Organize", items: ["Ideas", "Notes", "Journaling"] },
                      { title: "Data & Security", items: ["Export/Import", "Recycle Bin", "Backup"] },
                    ].map((category, index) => (
                      <div key={index} className="mb-2 sm:mb-3">
                        <h5 className="font-semibold text-purple-600 dark:text-purple-400 text-xs sm:text-sm mb-1.5 sm:mb-2">{category.title}</h5>
                        <ul className="space-y-1">
                          {category.items.map((item, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                              <CheckCircle className="h-3 w-3 text-teal-500 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 sm:p-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-base sm:text-lg">Technical Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    {[
                      { label: "Framework", value: "React 19 + TypeScript" },
                      { label: "Styling", value: "Tailwind CSS + shadcn/ui" },
                      { label: "Storage", value: "Local Storage" },
                      { label: "Build Tool", value: "Vite" },
                      { label: "Icons", value: "Lucide React" },
                      { label: "Design", value: "Mobile-First" },
                    ].map((tech, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300 text-xs mb-0.5 sm:mb-0">{tech.label}:</span>
                        <span className="text-gray-600 dark:text-gray-400 text-xs break-words sm:break-normal">{tech.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                © 2025 Anvistride by Annaura. All rights reserved.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type PreferenceToggleProps = {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

function PreferenceToggle({ label, description, enabled, onChange }: PreferenceToggleProps) {
  return (
    <div className="flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:border-purple-200/50 dark:hover:border-purple-700/50 transition-all duration-300 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex-shrink-0 ${
          enabled 
            ? "bg-gradient-to-r from-purple-600 to-teal-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            enabled ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

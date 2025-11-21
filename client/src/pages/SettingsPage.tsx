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
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600">Manage your account and data preferences</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/90 backdrop-blur-xl border border-purple-200/50 p-1.5 rounded-2xl shadow-lg">
          <TabsTrigger 
            value="data" 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:bg-purple-50"
          >
            <Database className="h-5 w-5" />
            <span className="hidden sm:inline">Data</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:bg-purple-50"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Account</span>
            <span className="sm:hidden">Account</span>
          </TabsTrigger>
          <TabsTrigger 
            value="display" 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:bg-purple-50"
          >
            <Palette className="h-5 w-5" />
            <span className="hidden sm:inline">Display</span>
            <span className="sm:hidden">Display</span>
          </TabsTrigger>
          <TabsTrigger 
            value="about" 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-purple-600 data-[state=inactive]:hover:bg-purple-50"
          >
            <Info className="h-5 w-5" />
            <span className="hidden sm:inline">About</span>
            <span className="sm:hidden">About</span>
          </TabsTrigger>
        </TabsList>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className={`${glassClass} border-purple-200/50`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <Database className="h-5 w-5" />
                </div>
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-br from-purple-50/50 to-white rounded-xl border border-purple-200/50 hover:shadow-lg hover:border-purple-300/50 transition-all duration-300">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Download className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Export Data</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Download all your data as a JSON backup file for safekeeping</p>
                  </div>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-br from-teal-50/50 to-white rounded-xl border border-teal-200/50 hover:shadow-lg hover:border-teal-300/50 transition-all duration-300">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Import Data</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Restore your data from a previously exported backup file</p>
                  </div>
                </div>
                <div>
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
                    className="border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-red-50/80 to-red-100/50 rounded-xl border-2 border-red-300/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-900 text-lg mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Clear All Data
                      </h3>
                      <p className="text-sm text-red-700 leading-relaxed">Permanently delete all your data. This action cannot be undone and will remove all your visions, goals, tasks, ideas, notes, journal entries, and achievements.</p>
                    </div>
                  </div>
                  {!showConfirmClear ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmClear(true)}
                      disabled={isLoading}
                      className="text-red-600 border-red-400 hover:bg-red-100 hover:border-red-500 transition-all duration-300 whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Data
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg border border-red-300">
                        <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0" />
                        <p className="text-sm font-semibold text-red-700">Are you absolutely sure?</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowConfirmClear(false)}
                          disabled={isLoading}
                          className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleClearData}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none shadow-lg"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card className={`${glassClass} border-purple-200/50`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <User className="h-5 w-5" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-br from-red-50/50 to-white rounded-xl border border-red-200/50 hover:shadow-lg hover:border-red-300/50 transition-all duration-300">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <LogOut className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Log Out</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Sign out of your account and return to the landing page</p>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-400 hover:bg-red-50 hover:border-red-500 hover:text-red-700 transition-all duration-300 whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Preferences Tab */}
        <TabsContent value="display" className="space-y-6 mt-6">
          <Card className={`${glassClass} border-purple-200/50`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <Palette className="h-5 w-5" />
                </div>
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
        <TabsContent value="about" className="space-y-8 mt-6">
          <Card className={`${glassClass} overflow-hidden`}>
            <CardHeader className="relative pb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-teal-500/10 to-purple-500/10"></div>
              <div className="relative text-center space-y-6">
                <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-teal-500 shadow-xl">
                  <img
                    src="/Anvistride_logo.png"
                    alt="Anvistride Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <CardTitle className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
                  Anvistride
                </CardTitle>
                <p className="text-2xl text-purple-700 font-bold italic tracking-wide">Vision into stride, one step at a time</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-1.5 text-sm font-semibold shadow-md">Version 1.0.0</Badge>
                  <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold border-2">Build 2025.1</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 px-6 pb-8">
              {/* Stride Explanation */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 via-teal-50/50 to-purple-50 border-2 border-purple-200/60 shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg flex-shrink-0">
                      S
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold text-purple-700 mb-2 tracking-tight">Stride</h3>
                      <p className="text-base font-medium text-gray-600 italic">(noun)</p>
                    </div>
                  </div>
                  <p className="text-xl leading-relaxed text-gray-900 font-medium">
                    A long, confident step forward in your journey toward your goals. 
                    It's the momentum you build when <span className="text-purple-700 font-bold">clarity</span> meets <span className="text-teal-700 font-bold">action</span>.
                  </p>
                </div>
              </div>

              {/* App Description */}
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-xl leading-relaxed text-gray-800 font-medium tracking-wide">
                  Turn your dreams into <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">unstoppable momentum</span> with our comprehensive productivity platform. 
                  From vision clarity to daily execution, we help you build the confidence and consistency 
                  needed to achieve your most ambitious goals through structured planning and purposeful action.
                </p>
              </div>

              {/* Acronym */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white via-purple-50/30 to-teal-50/30 border-2 border-purple-200/60 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5"></div>
                <div className="relative">
                  <h4 className="text-center text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    What does <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Anvistride</span> mean?
                  </h4>
                  <div className="flex flex-wrap justify-center items-center gap-4 text-xl font-bold">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">A</span>
                      <span className="text-purple-700">new</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">V</span>
                      <span className="text-purple-700">ision</span>
                    </div>
                    <div className="p-4">
                      <span className="text-gray-600 font-semibold">in</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <span className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">S</span>
                      <span className="text-amber-700">tride</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspiration */}
              <div className="relative p-10 rounded-2xl bg-gradient-to-br from-purple-50 via-teal-50/50 to-purple-50/50 border-2 border-purple-200/60 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 mb-4">
                      <Quote className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-3xl font-extrabold text-purple-700 tracking-tight">Our Inspiration</h4>
                  </div>
                  <blockquote className="relative bg-white p-8 rounded-2xl border-l-4 border-purple-600 shadow-lg mb-6">
                    <span className="absolute -top-6 left-6 text-7xl text-purple-200 font-serif leading-none">"</span>
                    <p className="text-2xl italic text-gray-900 font-semibold mb-6 pl-8 leading-relaxed tracking-wide">
                      Write the vision and make it plain on tablets, that he may run who reads it.
                    </p>
                    <cite className="text-purple-700 font-bold not-italic text-lg pl-8">— Habakkuk 2:2</cite>
                  </blockquote>
                  <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-800 font-medium">
                    This powerful verse inspired the creation of Anvistride. Just as the prophet Habakkuk was instructed to write down the vision clearly so others could run with it, we believe that writing down your personal vision and making it plain through structured planning enables you to <span className="text-purple-700 font-bold">run with purpose</span> and <span className="text-teal-700 font-bold">achieve your goals</span>.
                  </p>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="grid md:grid-cols-2 gap-8 py-8 border-t-2 border-b-2 border-purple-200/60">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200/60 shadow-lg">
                  <div className="inline-block p-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 mb-4 shadow-lg">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-purple-700 font-extrabold text-2xl mb-4 tracking-tight">Our Vision</h4>
                  <p className="text-gray-800 leading-relaxed font-medium text-lg">
                    Empowering individuals to transform their aspirations into meaningful action through structured planning and consistent execution.
                  </p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200/60 shadow-lg">
                  <div className="inline-block p-4 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 mb-4 shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-teal-700 font-extrabold text-2xl mb-4 tracking-tight">Our Mission</h4>
                  <p className="text-gray-800 leading-relaxed font-medium text-lg">
                    Help you turn your <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">vision</span> into <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span> by providing the tools, structure, and motivation needed to achieve your long-term goals.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Core Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Vision & Planning", items: ["Vision Board", "Goal Setting", "Progress Tracking", "Milestones"] },
                    { title: "Productivity", items: ["Task Management", "Daily Planning", "Priorities", "Deadlines"] },
                    { title: "Capture & Organize", items: ["Ideas", "Notes", "Journaling", "Achievements", "Search"] },
                    { title: "Data & Security", items: ["Export/Import", "Local Storage", "Recycle Bin", "Backup"] },
                  ].map((category, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-purple-600 mb-3">{category.title}</h5>
                      <ul className="space-y-1">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-teal-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Technical Information:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: "Framework", value: "React 19 + TypeScript" },
                    { label: "Styling", value: "Tailwind CSS + shadcn/ui" },
                    { label: "Storage", value: "Local Storage" },
                    { label: "Build Tool", value: "Vite" },
                    { label: "Icons", value: "Lucide React" },
                    { label: "Responsive", value: "Mobile-First Design" },
                  ].map((tech, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-900">{tech.label}:</span>
                      <span className="text-sm text-gray-600">{tech.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { number: "7+", label: "Core Features" },
                  { number: "100%", label: "Mobile Responsive" },
                  { number: visions.length + goals.length + tasks.length + ideas.length + notes.length + journal.length + achievements.length, label: "Your Items" },
                  { number: "∞", label: "Possibilities" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-600 to-teal-500 text-white rounded-xl shadow-lg">
                    <p className="text-3xl font-bold">{stat.number}</p>
                    <p className="text-sm opacity-90">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  © 2025 Anvistride by Annaura. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
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
    <div className="flex items-start justify-between gap-4 p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/50 hover:shadow-lg hover:border-purple-200/50 transition-all duration-300 group">
      <div className="flex-1">
        <p className="text-base font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          enabled 
            ? "bg-gradient-to-r from-purple-600 to-teal-500 shadow-lg" 
            : "bg-gray-300 hover:bg-gray-400"
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

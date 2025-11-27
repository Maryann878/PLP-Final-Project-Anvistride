import {
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
  FaUser,
  FaCog,
  FaTrash,
  FaQuestionCircle,
  FaBell,
} from "react-icons/fa";
import {
  LayoutDashboard,
  Eye,
  Target,
  CheckSquare,
  Lightbulb,
  StickyNote,
  BookOpen,
  Trophy,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    closeSidebar?.();
    navigate("/", { replace: true });
  };

  const handleNavClick = () => {
    const mainContent = document.querySelector(".main-content");
    mainContent?.scrollTo({ top: 0, behavior: "smooth" });
    if (window.innerWidth <= 768) closeSidebar?.();
  };

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar-container");
    if (sidebar) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = sidebar;
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
      };
      handleScroll();
      sidebar.addEventListener("scroll", handleScroll);
      return () => sidebar.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <aside className="sidebar-container fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white via-purple-50/30 to-violet-50/40 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20 flex flex-col justify-between shadow-xl shadow-purple-500/10 dark:shadow-purple-500/20 border-r-2 border-purple-100/50 dark:border-purple-800/50 overflow-y-auto overflow-x-hidden z-50 scroll-smooth backdrop-blur-sm">
      {/* Scroll Indicators */}
      {canScrollUp && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-purple-500 dark:text-purple-400 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md z-10">
          <FaChevronUp size={12} />
        </div>
      )}
      {canScrollDown && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-purple-500 dark:text-purple-400 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md z-10">
          <FaChevronDown size={12} />
        </div>
      )}

      {/* Logo Section - Animated */}
      <div className="flex items-center justify-center py-5 sm:py-6 border-b border-purple-100/50 dark:border-purple-800/50">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 flex items-center justify-center p-2.5 shadow-md shadow-purple-500/10 dark:shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300 group">
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride Logo"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Utility Icons Section - Playful */}
      <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-purple-100/50 dark:border-purple-800/50">
          <button
            onClick={() => {
              if (location.pathname === "/app/notifications" || location.pathname.startsWith("/app/notifications")) {
                // If already on notifications page, navigate to dashboard
                navigate("/app");
                handleNavClick();
              } else {
                // If not on notifications page, navigate to it
                navigate("/app/notifications");
                handleNavClick();
              }
            }}
            className={cn(
              "relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 group",
              location.pathname === "/app/notifications" || location.pathname.startsWith("/app/notifications")
                ? "bg-gradient-to-br from-purple-600 to-violet-600 text-white"
                : "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/50 dark:hover:to-violet-800/50 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            )}
            title={location.pathname === "/app/notifications" || location.pathname.startsWith("/app/notifications") ? "Close Notifications" : "Notifications"}
          >
            <FaBell className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NavLink
            to="/app/profile"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/50 dark:hover:to-violet-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 group"
            title="Profile"
            onClick={handleNavClick}
          >
            <FaUser className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-500" />
          </NavLink>
          <NavLink
            to="/app/settings"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/50 dark:hover:to-violet-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 group"
            title="Settings"
            onClick={handleNavClick}
          >
            <FaCog className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-500" />
          </NavLink>
          <NavLink
            to="/app/help"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/50 dark:hover:to-violet-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 group"
            title="Help"
            onClick={handleNavClick}
          >
            <FaQuestionCircle className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-500" />
          </NavLink>
          <NavLink
            to="/app/recycle-bin"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/50 dark:hover:to-violet-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 group"
            title="Recycle Bin"
            onClick={handleNavClick}
          >
            <FaTrash className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-500" />
          </NavLink>
      </div>


      {/* Navigation - Enhanced */}
      <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-5 overflow-y-auto">
        <div className="flex flex-col space-y-1.5 sm:space-y-2">
          {[
            { to: "/app", label: "Dashboard", icon: LayoutDashboard },
            { to: "/app/vision", label: "Vision", icon: Eye },
            { to: "/app/goals", label: "Goals", icon: Target },
            { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
            { to: "/app/ideas", label: "Ideas", icon: Lightbulb },
            { to: "/app/notes", label: "Notes", icon: StickyNote },
            { to: "/app/journal", label: "Journal", icon: BookOpen },
            { to: "/app/achievements", label: "Achievements", icon: Trophy },
          ].map((item, index) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== "/app" && location.pathname.startsWith(item.to));
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 hover:text-purple-700 dark:hover:text-purple-300 hover:shadow-md"
                )}
                onClick={handleNavClick}
              >
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200",
                  isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                )}>
                  <IconComponent className="w-full h-full" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="relative z-10 flex-1">{item.label}</span>
                {!isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-[#6A0DAD] to-[#8B5CF6] rounded-r-full group-hover:h-8 transition-all duration-200" />
                )}
              </NavLink>
            );
          })}
          
          {/* FamzStride - Featured Card in Navigation */}
          <div className="mt-4 pt-4 border-t border-purple-100/50 dark:border-purple-800/50">
            <NavLink
              to="/app/chat"
              className={cn(
                "relative flex flex-col items-center gap-2 px-3 sm:px-4 py-4 rounded-2xl transition-all duration-300 group overflow-hidden",
                location.pathname === "/app/chat" || location.pathname.startsWith("/app/chat")
                  ? "bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] shadow-xl shadow-purple-500/40 ring-2 ring-purple-400/50"
                  : "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/30 dark:hover:to-violet-800/30 hover:shadow-lg hover:shadow-purple-500/20 border border-purple-200/50 dark:border-purple-700/50"
              )}
              onClick={handleNavClick}
              title="FamzStride"
            >
              <div className="relative z-10 flex items-center justify-center">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-lg ring-2 ring-white/30 overflow-hidden">
                  {/* Animated pulsing glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-purple-400/20 to-teal-400/30 rounded-xl animate-pulse-slow"></div>
                  {/* Logo */}
                  <div className="relative z-10 flex items-center justify-center p-2 sm:p-2.5">
                    <img 
                      src="/Anvistride_logo.png" 
                      alt="FamzStride" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Message icon badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-xl shadow-amber-500/60 ring-1 ring-amber-400/40">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative z-10 text-center">
                <span className={cn(
                  "text-xs sm:text-sm font-bold block",
                  location.pathname === "/app/chat" || location.pathname.startsWith("/app/chat")
                    ? "text-white"
                    : "bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent"
                )}>
                  FamzStride
                </span>
                <span className={cn(
                  "text-[10px] sm:text-xs block mt-0.5",
                  location.pathname === "/app/chat" || location.pathname.startsWith("/app/chat")
                    ? "text-white/80"
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  Connect & Chat
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Footer - Animated */}
      <div className="border-t border-purple-100/50 dark:border-purple-800/50 p-3 sm:p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-white bg-gradient-to-r from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700 rounded-xl hover:from-red-600 hover:via-red-700 hover:to-rose-700 dark:hover:from-red-700 dark:hover:via-red-800 dark:hover:to-rose-800 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg shadow-red-500/30 dark:shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/40 dark:hover:shadow-red-500/60 hover:scale-[1.02] sm:hover:scale-105 hover:-translate-y-0.5 active:scale-100 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <FaSignOutAlt className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
  
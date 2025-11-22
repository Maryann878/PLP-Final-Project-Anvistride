import {
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
  FaUser,
  FaCog,
  FaTrash,
  FaQuestionCircle,
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
    <aside className="sidebar-container fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white via-purple-50/30 to-violet-50/40 flex flex-col justify-between shadow-xl shadow-purple-500/10 border-r-2 border-purple-100/50 overflow-y-auto overflow-x-hidden z-50 scroll-smooth backdrop-blur-sm">
      {/* Scroll Indicators */}
      {canScrollUp && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white/40 z-10">
          <FaChevronUp size={14} />
        </div>
      )}
      {canScrollDown && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/40 z-10">
          <FaChevronDown size={14} />
        </div>
      )}

      {/* Logo Section - Animated */}
      <div className="flex items-center justify-center py-6 border-b border-purple-100/50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center p-2.5 shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-110 transition-all duration-300 group">
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride Logo"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Utility Icons Section - Playful */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-purple-100/50">
        <NavLink
          to="/app/profile"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 flex items-center justify-center text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 group"
          title="Profile"
          onClick={handleNavClick}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FaUser className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          )}
        </NavLink>
        <NavLink
          to="/app/settings"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 flex items-center justify-center text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 group"
          title="Settings"
          onClick={handleNavClick}
        >
          <FaCog className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </NavLink>
        <NavLink
          to="/app/help"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 flex items-center justify-center text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 group"
          title="Help"
          onClick={handleNavClick}
        >
          <FaQuestionCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        </NavLink>
        <NavLink
          to="/app/recycle-bin"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 flex items-center justify-center text-purple-600 hover:text-purple-700 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 group"
          title="Recycle Bin"
          onClick={handleNavClick}
        >
          <FaTrash className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        </NavLink>
      </div>

      {/* Navigation - Animated & Playful */}
      <nav className="flex-1 px-3 py-4">
        {/* Core Features */}
        <div>
          <h3 className="text-[11px] font-bold uppercase text-purple-500 mb-4 px-3 tracking-widest">
            CORE FEATURES
          </h3>
          <div className="flex flex-col space-y-1.5">
            {[
              { to: "/app", label: "Dashboard" },
              { to: "/app/vision", label: "Vision" },
              { to: "/app/goals", label: "Goals" },
              { to: "/app/tasks", label: "Tasks" },
              { to: "/app/chat", label: "Chat" },
              { to: "/app/ideas", label: "Ideas" },
              { to: "/app/notes", label: "Notes" },
              { to: "/app/journal", label: "Journal" },
              { to: "/app/achievements", label: "Achievements" },
            ].map((item, index) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/app" && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] text-white shadow-lg shadow-purple-500/30 scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md hover:scale-105 hover:-translate-y-0.5"
                  )}
                  onClick={handleNavClick}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {!isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-[#6A0DAD] to-[#8B5CF6] rounded-r-full group-hover:h-8 transition-all duration-300" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer - Animated */}
      <div className="border-t border-purple-100/50 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-red-500 via-red-600 to-rose-600 rounded-xl hover:from-red-600 hover:via-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-100 relative overflow-hidden group"
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
  
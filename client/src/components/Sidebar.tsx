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
    <aside className="sidebar-container fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 dark:from-purple-950 dark:via-purple-900 dark:to-indigo-950 flex flex-col justify-between shadow-2xl shadow-purple-950/50 overflow-y-auto overflow-x-hidden z-50 border-r border-purple-800/40 scroll-smooth backdrop-blur-xl">
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

      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 border-b border-white/10 backdrop-blur-sm bg-gradient-to-r from-white/10 via-white/5 to-white/10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/95 to-white/90 shadow-xl shadow-purple-500/20 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 ring-2 ring-white/20">
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Utility Icons Section */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 border-b border-white/10 backdrop-blur-sm bg-gradient-to-r from-white/10 via-white/5 to-white/10">
        <NavLink
          to="/app/profile"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 hover:scale-110 flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 ring-1 ring-white/20 hover:ring-white/30"
          title="Profile"
          onClick={handleNavClick}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <FaUser className="h-5 w-5" />
          )}
        </NavLink>
        <NavLink
          to="/app/settings"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 hover:scale-110 flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 ring-1 ring-white/20 hover:ring-white/30"
          title="Settings"
          onClick={handleNavClick}
        >
          <FaCog className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/app/help"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 hover:scale-110 flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 ring-1 ring-white/20 hover:ring-white/30"
          title="Help"
          onClick={handleNavClick}
        >
          <FaQuestionCircle className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/app/recycle-bin"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 hover:scale-110 flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 ring-1 ring-white/20 hover:ring-white/30"
          title="Recycle Bin"
          onClick={handleNavClick}
        >
          <FaTrash className="h-5 w-5" />
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {/* Core Features */}
        <div>
          <h3 className="text-[10px] font-bold uppercase text-white/60 mb-4 px-3 tracking-[0.15em] letter-spacing-wide">
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
            ].map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/app" && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                    isActive
                      ? "bg-gradient-to-r from-teal-500 via-purple-500 to-purple-600 text-white shadow-xl shadow-purple-500/50 scale-[1.02] ring-2 ring-white/20"
                      : "text-white/85 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 hover:text-white hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.01] backdrop-blur-sm border border-transparent hover:border-white/10"
                  )}
                  onClick={handleNavClick}
                >
                  <span className="tracking-wide relative z-10">{item.label}</span>
                  {isActive && (
                    <>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-l-full shadow-lg" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 backdrop-blur-sm bg-gradient-to-r from-white/10 via-white/5 to-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 text-white bg-gradient-to-r from-red-600 via-red-500 to-rose-600 rounded-xl hover:from-red-700 hover:via-red-600 hover:to-rose-700 transition-all duration-300 font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] tracking-wide ring-1 ring-red-400/20 hover:ring-red-400/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <FaSignOutAlt className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
  
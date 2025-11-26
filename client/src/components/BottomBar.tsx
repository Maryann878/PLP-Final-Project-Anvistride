import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Target, CheckSquare, Eye, User, Plus, Menu, MessageCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when any navigation happens
  const handleNavClick = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  const handleQuickAdd = () => {
    const path = location.pathname;
    if (path.includes('vision')) navigate('/app/vision');
    else if (path.includes('goals')) navigate('/app/goals');
    else if (path.includes('tasks')) navigate('/app/tasks');
    else if (path.includes('ideas')) navigate('/app/ideas');
    else if (path.includes('notes')) navigate('/app/notes');
    else navigate('/app/vision');
  };

  const menuItems = [
    { to: '/app/chat', label: 'FamzStride', icon: 'famzstride', action: null },
    { to: '/app/ideas', label: 'Ideas', icon: '💡', action: null },
    { to: '/app/notes', label: 'Notes', icon: '📝', action: null },
    { to: '/app/journal', label: 'Journal', icon: '📔', action: null },
    { to: '/app/achievements', label: 'Achievements', icon: '🏆', action: null },
    { to: '/app/recycle-bin', label: 'Recycle Bin', icon: '🗑️', action: null },
    { to: '/app/settings', label: 'Settings', icon: '⚙️', action: null },
    { to: '/app/help', label: 'Help', icon: '❓', action: null },
    { to: null, label: 'Logout', icon: '🚪', action: handleLogout },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowMenu(false)}
        >
          <div 
            className="absolute bottom-20 left-0 right-0 bg-white/98 backdrop-blur-2xl border-t-2 border-purple-100/50 shadow-2xl shadow-purple-500/20 rounded-t-2xl p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item, index) => {
                if (item.action) {
                  // Logout button
                  return (
                    <button
                      key={`${item.label}-${index}`}
                      onClick={item.action}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md active:scale-95 border border-transparent hover:border-red-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      aria-label={item.label}
                    >
                      <LogOut className="w-6 h-6" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 group border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                        isActive
                          ? "bg-gradient-to-br from-[#6A0DAD] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/30"
                          : "text-gray-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md active:scale-95 hover:border-purple-200/50"
                      }`
                    }
                    aria-label={item.label}
                  >
                    {item.icon === 'famzstride' ? (
                      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-md ring-1 ring-white/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-purple-400/20 to-teal-400/30 rounded-lg animate-pulse-slow"></div>
                        <div className="relative z-10 flex items-center justify-center p-1.5">
                          <img 
                            src="/Anvistride_logo.png" 
                            alt="FamzStride" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white flex items-center justify-center shadow-lg shadow-amber-500/50">
                          <svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <span className="text-2xl">{item.icon}</span>
                    )}
                    <span className="text-xs font-semibold">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg flex justify-around items-center py-3 md:hidden z-50 pb-safe transition-transform duration-300 bottom-bar-nav" aria-label="Bottom navigation">
        <NavLink
          to="/app"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-2 rounded-xl flex-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
              isActive 
                ? "text-purple-600 bg-purple-50" 
                : "text-purple-400 hover:text-purple-600 hover:bg-purple-50 active:scale-95"
            }`
          }
          aria-label="Dashboard"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/app/vision"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-2 rounded-xl flex-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
              isActive 
                ? "text-purple-600 bg-purple-50" 
                : "text-purple-400 hover:text-purple-600 hover:bg-purple-50 active:scale-95"
            }`
          }
          aria-label="Vision"
        >
          <Eye className="w-5 h-5" />
          <span>Vision</span>
        </NavLink>

        <NavLink
          to="/app/goals"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-2 rounded-xl flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              isActive 
                ? "text-teal-600 bg-teal-50" 
                : "text-teal-400 hover:text-teal-600 hover:bg-teal-50 active:scale-95"
            }`
          }
          aria-label="Goals"
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </NavLink>

        <NavLink
          to="/app/tasks"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-2 rounded-xl flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
              isActive 
                ? "text-amber-600 bg-amber-50" 
                : "text-amber-400 hover:text-amber-600 hover:bg-amber-50 active:scale-95"
            }`
          }
          aria-label="Tasks"
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/app/profile"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-2 rounded-xl flex-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
              isActive 
                ? "text-purple-600 bg-purple-50" 
                : "text-purple-400 hover:text-purple-600 hover:bg-purple-50 active:scale-95"
            }`
          }
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>

        <button
          className="flex flex-col items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-700 transition-all relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-xl px-2.5 py-2"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="More options"
          aria-expanded={showMenu}
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-200 ${showMenu ? 'scale-110 rotate-90' : 'hover:scale-110 hover:rotate-12 active:scale-95'}`}>
            <Menu className="w-5 h-5 text-white transition-transform duration-200" />
          </div>
          <span className="text-[10px] group-hover:text-purple-700 transition-colors duration-200">More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomBar;

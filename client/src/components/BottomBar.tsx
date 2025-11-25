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
    { to: '/app/chat', label: 'Chat', icon: '💬', action: null },
    { to: '/app/ideas', label: 'Ideas', icon: '💡', action: null },
    { to: '/app/notes', label: 'Notes', icon: '📝', action: null },
    { to: '/app/journal', label: 'Journal', icon: '📔', action: null },
    { to: '/app/achievements', label: 'Achievements', icon: '🏆', action: null },
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
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 group text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md hover:scale-105 border border-transparent hover:border-red-200/50"
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
                      `flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 group border border-transparent ${
                        isActive
                          ? "bg-gradient-to-br from-[#6A0DAD] to-[#8B5CF6] text-white shadow-lg shadow-purple-500/30 scale-105"
                          : "text-gray-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md hover:scale-105 hover:border-purple-200/50"
                      }`
                    }
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-purple-100/50 shadow-2xl shadow-purple-500/10 flex justify-around items-center py-3 md:hidden z-50 pb-safe">
        <NavLink
          to="/app"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-300 px-2.5 py-2 rounded-xl flex-1 group ${
              isActive 
                ? "text-white bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] shadow-lg shadow-purple-500/30 scale-110" 
                : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:shadow-md hover:scale-105"
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/app/vision"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-300 px-2.5 py-2 rounded-xl flex-1 group ${
              isActive 
                ? "text-white bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] shadow-lg shadow-purple-500/30 scale-110" 
                : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:shadow-md hover:scale-105"
            }`
          }
        >
          <Eye className="w-5 h-5" />
          <span>Vision</span>
        </NavLink>

        <NavLink
          to="/app/goals"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-xl flex-1 ${
              isActive 
                ? "text-teal-600 bg-teal-50 scale-110" 
                : "text-gray-500 hover:text-teal-600 hover:bg-teal-50/50"
            }`
          }
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </NavLink>

        <NavLink
          to="/app/tasks"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-xl flex-1 ${
              isActive 
                ? "text-amber-600 bg-amber-50 scale-110" 
                : "text-gray-500 hover:text-amber-600 hover:bg-amber-50/50"
            }`
          }
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/app/profile"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-300 px-2.5 py-2 rounded-xl flex-1 group ${
              isActive 
                ? "text-white bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] shadow-lg shadow-purple-500/30 scale-110" 
                : "text-gray-600 hover:text-purple-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:shadow-md hover:scale-105"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>

        <button
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-600 transition-all relative group"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 ${showMenu ? 'scale-110 rotate-90' : 'hover:scale-110 hover:rotate-12'}`}>
            <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] group-hover:text-purple-700 transition-colors duration-300">More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomBar;

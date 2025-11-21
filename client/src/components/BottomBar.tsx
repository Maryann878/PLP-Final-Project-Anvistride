import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Target, CheckSquare, Eye, User, Plus, Menu, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

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
    { to: '/app/chat', label: 'Chat', icon: '💬' },
    { to: '/app/ideas', label: 'Ideas', icon: '💡' },
    { to: '/app/notes', label: 'Notes', icon: '📝' },
    { to: '/app/journal', label: 'Journal', icon: '📔' },
    { to: '/app/achievements', label: 'Achievements', icon: '🏆' },
    { to: '/app/settings', label: 'Settings', icon: '⚙️' },
    { to: '/app/help', label: 'Help', icon: '❓' },
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
            className="absolute bottom-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-purple-200/50 shadow-2xl rounded-t-3xl p-4 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-purple-50 text-purple-600 scale-105"
                        : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                    }`
                  }
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-semibold">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-purple-200/50 shadow-2xl flex justify-around items-center py-2 md:hidden z-50 pb-safe">
        <NavLink
          to="/app"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-xl flex-1 ${
              isActive 
                ? "text-purple-600 bg-purple-50 scale-110" 
                : "text-gray-500 hover:text-purple-600 hover:bg-purple-50/50"
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/app/vision"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-xl flex-1 ${
              isActive 
                ? "text-purple-600 bg-purple-50 scale-110" 
                : "text-gray-500 hover:text-purple-600 hover:bg-purple-50/50"
            }`
          }
        >
          <Eye className="w-5 h-5" />
          <span>Vision</span>
        </NavLink>

        <NavLink
          to="/app/goals"
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
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-xl flex-1 ${
              isActive 
                ? "text-blue-600 bg-blue-50 scale-110" 
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>

        <button
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-500 active:scale-95 transition-all hover:scale-105 relative"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/50 ${showMenu ? 'scale-110' : ''}`}>
            <Menu className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomBar;

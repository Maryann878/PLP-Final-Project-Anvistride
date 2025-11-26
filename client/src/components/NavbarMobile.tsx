import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Why Choose Us", href: "#why-choose" },
  { label: "Pricing", href: "#pricing" },
];

const NavbarMobile = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setOpen(false);
      const element = document.querySelector(href);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      setOpen(false);
    }
  };

  // For logged-in users, show simplified navbar (logo + notification only)
  if (user) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-sm md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img
              src="/Anvistride_logo.png"
              alt="Anvistride Logo"
              className="h-12 w-auto"
            />
          </div>

          <button
            onClick={() => {
              navigate('/app/notifications');
            }}
            className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-all duration-200 active:scale-95"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    );
  }

  // For non-logged-in users, show full landing page navbar
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-sm md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link 
          to="/" 
          className="flex items-center transition-transform duration-300 hover:scale-105"
          onClick={() => setOpen(false)}
        >
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride Logo"
            className="h-12 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="relative rounded-lg p-2 text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 active:scale-95"
          >
            <span className="sr-only">Toggle menu</span>
            <div className="relative w-6 h-6">
              <Menu 
                className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                  open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              />
              <X 
                className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                  open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-[57px] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Content */}
      <div
        className={`absolute left-0 right-0 top-[57px] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-4 py-3.5 text-base font-semibold text-gray-800 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-teal-50 hover:text-purple-600 hover:shadow-md active:scale-[0.98] border border-transparent hover:border-purple-200/50 [&::after]:hidden outline-none focus-visible:ring-0"
              style={{
                animationDelay: open ? `${index * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </a>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200/50 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-center text-gray-700 border-2 border-purple-200/70 bg-white/95 backdrop-blur-md hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/90 hover:to-teal-50/90 hover:border-purple-400/80 hover:shadow-xl hover:shadow-purple-200/40 font-bold py-3.5 rounded-xl transition-all duration-300" 
              asChild
            >
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button 
              className="w-full bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] text-white shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98] font-extrabold py-3.5 rounded-xl ring-1 ring-white/20 transition-all duration-300" 
              asChild
            >
              <Link to="/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                <span className="font-bold">Get started</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMobile;

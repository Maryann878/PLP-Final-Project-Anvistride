import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Why Choose Us", href: "#why-choose" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="hidden md:block fixed top-0 inset-x-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-3">
        <Link 
          to="/" 
          className="flex items-center group transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride Logo"
            className="h-14 w-auto transition-all duration-300"
          />
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:text-purple-600 hover:bg-purple-50/50 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-teal-400 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 -translate-x-1/2"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-purple-600 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md" 
            asChild
          >
            <Link to="/login">Sign in</Link>
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300 font-bold px-6 py-2.5 rounded-xl ring-1 ring-white/20 group" 
            asChild
          >
            <Link to="/register" className="flex items-center gap-2">
              Get started
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

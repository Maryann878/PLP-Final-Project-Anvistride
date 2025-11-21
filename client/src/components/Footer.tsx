import { Link } from "react-router-dom";
import {
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa6";

const socialLinks = [
  { icon: <FaXTwitter className="h-5 w-5" />, href: "/social/twitter", label: "X" },
  { icon: <FaLinkedin className="h-5 w-5" />, href: "/social/linkedin", label: "LinkedIn" },
  { icon: <FaInstagram className="h-5 w-5" />, href: "/social/instagram", label: "Instagram" },
  { icon: <FaFacebook className="h-5 w-5" />, href: "/social/facebook", label: "Facebook" },
  { icon: <FaEnvelope className="h-5 w-5" />, href: "/social/email", label: "Email" },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith("#")) {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
};

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Anvistride", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-300">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-900/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl grid gap-12 px-6 py-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        {/* Brand section */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white group transition-transform duration-300 hover:scale-105">
            <img src="/Anvistride_logo.png" alt="Anvistride logo" className="h-14 w-auto" />
            <div className="leading-tight">
              <p className="text-2xl font-bold group-hover:text-purple-300 transition-colors duration-300">Anvistride</p>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Vision into stride</p>
            </div>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">
            A modern productivity platform that helps you write the vision, make it plain, and stay in stride through
            planning, execution, and reflection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                to={social.href}
                aria-label={social.label}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-purple-400/50 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-teal-500 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Links section */}
        <div className="grid gap-8 sm:grid-cols-3">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400 mb-5">{section.title}</p>
              <ul className="space-y-3.5">
                {section.links.map((link) =>
                  link.href.startsWith("/") ? (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="inline-block text-sm text-gray-400 transition-all duration-200 hover:text-white hover:translate-x-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="inline-block text-sm text-gray-400 transition-all duration-200 hover:text-white hover:translate-x-1"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Anvistride. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

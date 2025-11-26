import React, { useEffect, useState } from "react"
import { ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

const stats = [
  { number: "7+", label: "Core Features" },
  { number: "100%", label: "Free to Start" },
  { number: "New", label: "Launching Soon" },
];

const HeroSection: React.FC = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center py-14 md:py-30">
      {/* Professional Background - Matching Forgot Password Page */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background image - More visible for the hand */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero_img.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.85,
          }}
        />
        {/* Secondary overlay image - More visible for hand and pen */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/download.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
          }}
        />
        {/* Lighter gradient overlay - Less intense for better visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(106,13,173,0.25) 0%, rgba(124,58,237,0.18) 30%, rgba(26,188,156,0.15) 70%, rgba(99,102,241,0.08) 100%)",
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Subtle blur orbs */}
        <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse-slow" />
        <div className="absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-teal-200/15 blur-[140px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-4 sm:gap-5 px-4 sm:px-6 text-center pt-14 md:pt-0 justify-center h-full py-8 sm:py-12">
        {/* Badge - Modern & Professional - More Visible */}
        <div className="inline-flex items-center justify-center rounded-full border-2 border-white/50 bg-white/30 backdrop-blur-xl px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-2xl shadow-black/40 leading-tight animate-slide-down">
          All-in-One Productivity Platform
        </div>

        {/* Main Heading - Beautiful & Modern - Enhanced Visibility */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 sm:mb-4 mt-2 sm:mt-3 leading-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_20px_rgba(0,0,0,0.9),_0_0_40px_rgba(0,0,0,0.5)] animate-slide-up">
          Transform Your Vision Into{" "}
          <span className="block mt-2 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] [text-shadow:_0_0_30px_rgba(255,215,0,0.9),_0_0_50px_rgba(255,215,0,0.6)] animate-pulse-slow">
            Stride
          </span>
        </h1>

        {/* Description - Professional - Enhanced Visibility */}
        <p className="text-white mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-[0_3px_15px_rgba(0,0,0,0.7)] [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)] px-2 font-semibold animate-slide-up" style={{ animationDelay: '0.1s' }}>
          A productivity platform that combines vision planning, goal setting, task management, idea capture, journaling, and analytics in one place.
        </p>

        {/* CTA Buttons - Enhanced & Improved */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 mb-6 sm:mb-8 w-full px-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/register"
            className="relative bg-gradient-to-r from-white/40 via-white/35 to-white/40 backdrop-blur-xl px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-7 rounded-xl shadow-2xl shadow-black/30 border-[2px] border-white/50 transform transition-all duration-300 hover:scale-[1.05] hover:bg-gradient-to-r hover:from-white/50 hover:via-white/45 hover:to-white/50 hover:shadow-2xl hover:shadow-black/40 hover:border-white/60 active:scale-[0.98] flex items-center justify-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 overflow-hidden no-underline"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10 font-extrabold text-white text-base sm:text-lg md:text-xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              Start Your Journey Free
            </span>
            <ArrowRight className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300 group-hover:translate-x-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]" />
          </Link>

          <Link
            to="/demo"
            className="relative bg-gradient-to-r from-white/40 via-white/35 to-white/40 backdrop-blur-xl px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-7 rounded-xl shadow-2xl shadow-black/30 border-[2px] border-white/50 transform transition-all duration-300 hover:scale-[1.05] hover:bg-gradient-to-r hover:from-white/50 hover:via-white/45 hover:to-white/50 hover:shadow-2xl hover:shadow-black/40 hover:border-white/60 active:scale-[0.98] flex items-center justify-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 overflow-hidden no-underline"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Play className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]" />
            <span className="relative z-10 font-extrabold text-white text-base sm:text-lg md:text-xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              Watch Demo
            </span>
          </Link>
        </div>

        {/* Stats - Subtle & Informational - Less Prominent */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-2xl mx-auto w-full px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-3 py-2"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [text-shadow:_0_1px_6px_rgba(0,0,0,0.7)]">{stat.number}</div>
              <div className="text-white/80 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] [text-shadow:_0_1px_3px_rgba(0,0,0,0.7)] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection

import React, { useEffect, useState } from "react"
import { ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"

const HeroSection: React.FC = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-20 md:py-28">
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background image - Restore previous opacity for better text visibility */}
        <div
          className="absolute mt-5 lg:mt-25 inset-0 opacity-85 md:opacity-70 lg:opacity-65"
          style={{
            backgroundImage: "url('/hero_img.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Secondary overlay image - Restore previous opacity */}
        <div
          className="absolute inset-0 opacity-40 md:opacity-30 lg:opacity-25"
          style={{
            backgroundImage: "url('/download.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Restore previous gradient overlay for better text contrast - Darker on desktop */}
        <div
          className="absolute inset-0 opacity-100 md:opacity-80 lg:opacity-85"
          style={{
            background: "linear-gradient(135deg, rgba(106,13,173,0.25) 0%, rgba(124,58,237,0.18) 30%, rgba(26,188,156,0.15) 70%, rgba(99,102,241,0.08) 100%)",
          }}
        />
        {/* Additional dark overlay on desktop to reduce white appearance */}
        <div className="absolute inset-0 bg-black/10 lg:bg-black/15"></div>
        {/* Animated blur orbs */}
        <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/15 blur-3xl animate-pulse-slow"></div>
        <div className="absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-gradient-to-br from-teal-300/20 to-teal-500/15 blur-[140px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-amber-300/10 to-yellow-400/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center space-y-8 md:space-y-10 lg:space-y-12">
          
          {/* Hero Headline - The Star - Reduced sizes with better visibility */}
          <h1 className="max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="block text-3xl mt-8 lg:mt-0 sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-3 sm:mb-4 mt-5 tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_20px_rgba(0,0,0,0.9),_0_0_40px_rgba(0,0,0,0.5)]">
              Transform Your Vision Into
            </span>
            <span className="relative inline-block mt-2 group">
              {/* Decorative sparkles - Ping animations only */}
              <span className="absolute -top-2 -left-2 h-3 w-3 rounded-full bg-yellow-400 animate-ping opacity-75 z-10"></span>
              <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-amber-300 animate-ping opacity-75 z-10" style={{ animationDelay: '0.5s' }}></span>
              <span className="absolute top-1/2 -right-3 h-2.5 w-2.5 rounded-full bg-yellow-300 animate-ping opacity-60 z-10" style={{ animationDelay: '1s' }}></span>
              
              {/* Main "Stride" text with stunning gradient - Reduced size on desktop, darkened */}
              <span className="relative block">
                {/* Darkening backdrop to reduce brightness */}
                <span className="absolute inset-0 bg-black/15 lg:bg-black/20 rounded-lg blur-md -z-0"></span>
                <span className="relative block bg-gradient-to-r from-amber-300 via-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-extrabold tracking-tight [text-shadow:_0_0_40px_rgba(255,215,0,0.5),_0_0_60px_rgba(255,193,7,0.3),_0_0_80px_rgba(255,152,0,0.2)] group-hover:scale-105 transition-transform duration-300">
                  Stride
                </span>
              </span>
            </span>
          </h1>

          {/* Refined Description - Reduced size with backdrop for visibility */}
          <div className="relative mb-5 sm:mb-6 md:mb-7 max-w-2xl mx-auto px-2 py-2 sm:py-4 rounded-2xl backdrop-blur-md bg-black/30 md:bg-black/25 border border-white/20 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-[0_3px_15px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_10px_rgba(0,0,0,0.95)] font-semibold">
              A productivity platform that combines{" "}
              <span className="font-bold bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.8)]">vision planning</span>
              {", "}
              <span className="font-bold bg-gradient-to-r from-teal-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(20,184,166,0.8)]">goal setting</span>
              {", "}
              <span className="font-bold bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">task management</span>
              {", idea capture, journaling, "}
              <span className="font-bold bg-gradient-to-r from-cyan-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(6,182,212,0.8)]">community chat</span>
              {", and analytics in one place."}
            </p>
          </div>

          {/* Premium CTA Buttons - Matching App Design */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 w-full px-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/register"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-100 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Start Your Journey Free
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/demo"
              className="group relative overflow-hidden rounded-xl border-2 border-white/50 bg-white/20 backdrop-blur-xl text-white shadow-lg shadow-black/20 hover:bg-white/30 hover:border-white/60 hover:shadow-xl hover:shadow-black/30 hover:scale-105 hover:-translate-y-0.5 active:scale-100 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection

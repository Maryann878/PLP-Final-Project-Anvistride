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
      {/* Background layers */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero_img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          inset: 150,
          zIndex: 0,
          opacity: loaded ? 0.7 : 0,
          transition: "opacity 700ms ease-out",
        }}
      />
      <div 
        className="absolute inset-0 overflow-hidden z-[1] pointer-events-none"
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat md:bg-[length:135%_130%] md:bg-[center_-40px] bg-[length:135%_160%] bg-[center_-100px]"
          style={{
            backgroundImage: "url('/download.jpeg')",
            opacity: loaded ? 0.6 : 0,
            inset: 0,
            transition: "opacity 100ms ease-out",
          }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(106,13,173,0.15) 0%, rgba(106,13,173,0.25) 50%, rgba(26,188,156,0.2) 100%)",
          zIndex: 1,
          pointerEvents: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 900ms ease-out",
        }}
      />
      {/* Additional lighting effects */}
      <div className="absolute -right-10 top-10 h-96 w-96 rounded-full bg-purple-300/15 blur-3xl z-[1]" />
      <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-teal-300/15 blur-[140px] z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-yellow-200/10 blur-3xl z-[1]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-2 sm:gap-3 px-4 sm:px-6 text-center pt-14 md:pt-0 justify-center h-full py-4 sm:py-6">
        <div className="inline-flex items-center justify-center rounded-full border-2 border-purple-200/80 bg-white/90 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.3em] text-purple-700 shadow-xl shadow-purple-200/50 leading-tight w-auto max-w-[95vw] sm:max-w-none sm:whitespace-nowrap -mt-5">
          All-in-One Productivity Platform
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-3 mt-0 sm:mt-2 leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]">
          Transform Your Vision Into{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] block drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] [text-shadow:_0_0_0px_rgba(255,215,0,0.6),_0_2px_10px_rgba(0,0,0,0.7)]">
            Stride
          </span>
        </h1>

        <p className="text-white/95 mb-3 sm:mb-4 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] [text-shadow:_0_1px_5px_rgba(0,0,0,0.8)] px-2 font-medium">
          A productivity platform that combines vision planning, goal setting, task management, idea capture, journaling, and analytics in one place.
        </p>

        {/* CTA Buttons - Made more prominent */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 mb-4 sm:mb-6 w-full px-2">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-2xl shadow-purple-600/60 hover:shadow-purple-600/80 hover:scale-110 active:scale-105 transition-all duration-300 w-full sm:w-auto border-0 ring-4 ring-white/40 hover:ring-white/60 backdrop-blur-sm group relative overflow-hidden"
            asChild
          >
            <Link to="/register" className="flex items-center justify-center gap-3 relative z-10">
              <span className="font-extrabold">Start Your Journey Free</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white/95 bg-white/30 backdrop-blur-xl text-white hover:bg-white/50 hover:text-white hover:border-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-2xl shadow-white/40 hover:shadow-white/60 hover:scale-110 active:scale-105 transition-all duration-300 w-full sm:w-auto ring-2 ring-white/30 hover:ring-white/50 group"
            asChild
          >
            <Link to="/demo" className="flex items-center justify-center gap-3">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-extrabold">Watch Demo</span>
            </Link>
          </Button>
        </div>

        {/* Stats - Made less prominent */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto w-full px-7 opacity-90">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-lg border border-purple-100/40 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-300/30 hover:border-purple-200/60"
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent mb-0.5">{stat.number}</div>
              <div className="text-gray-600 font-semibold text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-wider leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection

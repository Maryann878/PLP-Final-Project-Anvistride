import React from "react";
import { Sparkles, Zap, Rocket } from "lucide-react";

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 via-indigo-950 to-slate-950 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/30 to-transparent blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-teal-600/30 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with glow effect */}
        <div className="relative group">
          {/* Outer glow rings */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-teal-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl blur-xl opacity-30 animate-pulse scale-105" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Logo container */}
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/20 ring-4 ring-purple-500/20 transform transition-all duration-500 group-hover:scale-105">
            <img
              src="/Anvistride_logo.png"
              alt="Anvistride"
              className="h-20 w-auto drop-shadow-2xl animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </div>
          
          {/* Sparkle effects */}
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-ping" />
          <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-purple-400 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Animated spinner with multiple rings */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-teal-500 rounded-full animate-spin"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 border-4 border-teal-500/20 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-teal-400 border-r-yellow-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
          
          {/* Inner ring */}
          <div className="absolute inset-4 border-4 border-yellow-400/20 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-transparent border-t-yellow-400 border-r-orange-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="h-8 w-8 text-yellow-400 animate-bounce" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>

        {/* Loading text with gradient */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-teal-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Loading Anvistride
          </h2>
          <p className="text-sm md:text-base text-gray-300 font-medium">
            Preparing your productivity journey...
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-64 md:w-80 h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 via-teal-500 to-yellow-400 rounded-full animate-progress"
            style={{
              animation: 'progress 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Feature highlights */}
        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span>Real-time Sync</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span>Fast Loading</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;


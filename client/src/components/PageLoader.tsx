import React from "react";
import Spinner from "./Spinner";

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-violet-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-fade-in">
        {/* Logo container - Animated */}
        <div className="relative animate-scale-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-purple-500/20 border-2 border-purple-100/50 hover:scale-105 transition-transform duration-300">
            <img
              src="/Anvistride_logo.png"
              alt="Anvistride"
              className="h-16 w-auto"
            />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-2xl blur-xl animate-pulse-slow"></div>
        </div>

        {/* Playful spinner with logo */}
        <Spinner size="lg" />

        {/* Loading text - Animated */}
        <div className="text-center space-y-2 animate-slide-up">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
            Loading Anvistride
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Preparing your workspace...
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-72 h-1.5 bg-purple-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#6A0DAD] via-[#8B5CF6] to-[#A78BFA] rounded-full animate-progress shadow-lg"
            style={{
              animation: 'progress 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
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


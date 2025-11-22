import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const logoSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} animate-float`}>
      {/* Outer ring - animated and playful */}
      <div className="absolute inset-0 border-[3px] border-purple-200 rounded-2xl"></div>
      <div className="absolute inset-0 border-[3px] border-transparent border-t-[#6A0DAD] border-r-[#8B5CF6] rounded-2xl animate-spin" style={{ animationDuration: '1s' }}></div>
      <div className="absolute inset-1 border-2 border-transparent border-b-[#A78BFA] border-l-[#C4B5FD] rounded-xl animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
      
      {/* Logo in center - pulsing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <img
            src="/Anvistride_logo.png"
            alt="Anvistride"
            className={`${logoSizes[size]} object-contain opacity-95 animate-pulse-slow`}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-md animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;


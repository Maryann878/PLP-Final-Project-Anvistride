import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const badges = [
  "Your data stays safe and private",
  "Works great on your phone, tablet, or computer",
  "Start right away, no payment needed",
  "Join thousands of users already achieving their goals",
];

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-teal-500 py-20 sm:py-24 md:py-28">
      {/* Enhanced background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-teal-400/25 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center justify-center rounded-full border-2 border-white/50 bg-white/15 backdrop-blur-xl px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-xl mb-8 animate-fade-in-down">
          Get Started Today
        </div>
        
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Ready to transform your vision into{" "}
          <span className="relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] [text-shadow:_0_0_20px_rgba(255,215,0,0.6)]">
              Stride
            </span>
          </span>
          ?
        </h2>
        
        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/95 leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Plan, execute, and celebrate your journey—all in one powerful platform. Start your free account today and see what you can achieve.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center mb-16">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-white text-purple-700 hover:bg-white/95 hover:scale-105 hover:-translate-y-0.5 active:scale-100 shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-900/50 font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 transition-all duration-300 rounded-xl focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600"
            asChild
          >
            <Link to="/register" className="flex items-center gap-2">
              <span className="relative z-10">Start Your Free Account</span>
              <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="group relative overflow-hidden text-white border-2 border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60 hover:scale-105 hover:-translate-y-0.5 active:scale-100 font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 transition-all duration-300 rounded-xl focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600"
            asChild
          >
            <Link to="/login" className="flex items-center gap-2">
              <span className="relative z-10">Already have an account? Sign in</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </Button>
        </div>

        {/* Badges Grid */}
        <div className="grid gap-4 sm:gap-5 text-left sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {badges.map((label, idx) => (
            <div
              key={label}
              className="group flex items-start gap-4 rounded-2xl border-2 border-white/30 bg-white/15 backdrop-blur-xl px-5 sm:px-6 py-4 sm:py-5 shadow-xl transition-all duration-300 hover:bg-white/25 hover:border-white/50 hover:scale-105 hover:shadow-2xl hover:-translate-y-1"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700]/40 to-[#FFA500]/40 group-hover:from-[#FFD700]/50 group-hover:to-[#FFA500]/50 transition-all duration-300 group-hover:scale-110 shadow-lg ring-2 ring-white/20 mt-0.5">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
              </span>
              <span className="text-sm sm:text-base font-semibold text-white leading-relaxed pt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;

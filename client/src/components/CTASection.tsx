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
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-teal-500 py-28">
      {/* Enhanced background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center text-white">
        <div className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-white shadow-lg mb-8">
          Get Started Today
        </div>
        
        <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight drop-shadow-2xl mb-6">
          Ready to transform your vision into{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] [text-shadow:_0_0_20px_rgba(255,215,0,0.6)]">
            Stride
          </span>
          ?
        </h2>
        
        <p className="max-w-2xl mx-auto text-base text-white/95 md:text-lg lg:text-xl leading-relaxed mb-12">
          Plan, execute, and celebrate your journey—all in one powerful platform. Start your free account today and see what you can achieve.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center mb-16">
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-white/95 hover:scale-105 shadow-2xl shadow-purple-900/40 font-bold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 transition-all duration-300 rounded-xl"
            asChild
          >
            <Link to="/register" className="flex items-center gap-2">
              Start Your Free Account <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border-2 border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60 font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 transition-all duration-300 rounded-xl"
            asChild
          >
            <Link to="/login" className="flex items-center gap-2">
              Already have an account? Sign in
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {badges.map((label, idx) => (
            <div
              key={label}
              className="group flex items-start gap-4 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-md px-6 py-5 shadow-xl transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700]/30 to-[#FFA500]/30 group-hover:from-[#FFD700]/40 group-hover:to-[#FFA500]/40 transition-all duration-300 group-hover:scale-110 mt-0.5">
                <CheckCircle className="h-6 w-6 text-white drop-shadow-lg" />
              </span>
              <span className="text-sm md:text-base font-semibold text-white leading-relaxed pt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;

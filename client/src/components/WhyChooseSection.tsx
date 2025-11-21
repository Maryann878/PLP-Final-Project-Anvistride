import React, { useRef, useEffect, useState } from "react";
import { Rocket, Shield, Smartphone, CheckCircle } from "lucide-react";
import useScrollAnimation from "../hooks/useScrollAnimation";

const benefits = [
  {
    icon: <Rocket className="h-7 w-7" />,
    title: "All-in-One Platform",
    desc: "Everything you need for productivity in one place – no more switching between multiple apps",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Privacy First",
    desc: "Your data stays secure with encryption and privacy protection",
  },
  {
    icon: <Smartphone className="h-7 w-7" />,
    title: "Cross-Platform",
    desc: "Access your productivity system from any device with synchronization",
  },
];

const trustLabels = [
  "Secure & Private",
  "Mobile Optimized",
  "Real-time Sync",
  "Data Privacy",
];

const WhyChooseSection: React.FC = () => {
  useScrollAnimation();

  // Scroll animation for trust indicators
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const trustRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      trustRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !visibleIndexes.includes(idx)) {
          setVisibleIndexes((prev) => [...prev, idx]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleIndexes]);

  return (
    <section id="why-choose" className="relative overflow-hidden bg-gray-50 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex justify-end">
        <div className="h-80 w-80 rounded-full bg-teal-100/25 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="inline-flex items-center justify-center rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm mb-6">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight mb-5">
            Built for people who want to achieve more
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 md:text-lg leading-relaxed">
            Experience the difference of a platform designed with your success in mind. Simple, powerful, and always improving.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="group relative bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/80 shadow-xl shadow-purple-100/30 p-8 lg:p-10 min-h-[320px] flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:border-purple-300/50 hover:bg-white hover:shadow-2xl hover:shadow-purple-200/50"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-teal-400 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-300 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-200/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {b.icon}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                {b.title}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-md">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
          {trustLabels.map((label, idx) => (
            <div
              key={idx}
              ref={(el) => {
                trustRefs.current[idx] = el;
              }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 shadow-md transform transition-all duration-700 hover:scale-105 hover:border-purple-300 hover:bg-white hover:shadow-lg ${
                visibleIndexes.includes(idx)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-gray-700 font-semibold text-sm lg:text-base whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

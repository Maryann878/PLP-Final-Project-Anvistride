import React from "react";
import { MessageCircle, Wifi, RotateCcw, Sliders, User, HelpCircle, Shield, Zap, Search, Keyboard } from "lucide-react";

const features = [
  { 
    icon: <MessageCircle className="h-5 w-5" />, 
    title: "Real-time Chat", 
    desc: "Connect with the community in group chat or find accountability partners through private messaging with FamzStride. Stay motivated together." 
  },
  { 
    icon: <Wifi className="h-5 w-5" />, 
    title: "Multi-Device Sync", 
    desc: "Your data syncs instantly across all devices. Start on your phone, continue on your laptop—seamlessly." 
  },
  { 
    icon: <Search className="h-5 w-5" />, 
    title: "Global Search", 
    desc: "Find anything instantly with our powerful command palette. Press Cmd+K to search across all your content." 
  },
  { 
    icon: <Keyboard className="h-5 w-5" />, 
    title: "Keyboard Shortcuts", 
    desc: "Power users love our keyboard shortcuts. Navigate faster and work more efficiently with hotkeys." 
  },
  { 
    icon: <Zap className="h-5 w-5" />, 
    title: "Real-time Notifications", 
    desc: "Get instant updates on achievements, milestones, and important events. Never miss a celebration." 
  },
  { 
    icon: <RotateCcw className="h-5 w-5" />, 
    title: "Recycle Bin", 
    desc: "Deleted something by mistake? Get it back. Everything you delete is saved so you can restore it anytime." 
  },
  { 
    icon: <Sliders className="h-5 w-5" />, 
    title: "Customizable Settings", 
    desc: "Personalize your experience. Adjust preferences, toggle features, and make Anvistride work exactly how you want." 
  },
  { 
    icon: <Shield className="h-5 w-5" />, 
    title: "Enterprise-Grade Security", 
    desc: "Your data is encrypted and protected. We use industry-standard security practices to keep your information safe." 
  },
];

const Features: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-96 w-96 rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <p className="inline-flex items-center justify-center rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm mb-6">
            Power Features
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight">
            Everything you need to stay connected and productive
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-gray-600 md:text-lg leading-relaxed">
            Advanced features that make Anvistride more than just a productivity app—it's your complete productivity ecosystem.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group relative flex items-start gap-5 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-6 shadow-md shadow-purple-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/50 hover:bg-white hover:shadow-xl hover:shadow-purple-200/40"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-300 text-white shadow-lg shadow-purple-200/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

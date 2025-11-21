import React from "react";
import { Target, Trophy, CheckCircle, Lightbulb, BookOpen, BarChart2, Upload, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "Vision Planning",
    desc: "Define your long-term vision and track your progress.",
    tags: ["Visual Boards", "Priority Setting"],
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Smart Goals",
    desc: "Break down your vision into achievable milestones.",
    tags: ["Milestone Tracking", "Deadline Management"],
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Smart Tasks",
    desc: "Organize your daily tasks with priorities and due dates.",
    tags: ["Priority Levels", "Due Date Tracking"],
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Community Chat",
    desc: "Connect with others in group chat or find accountability partners.",
    tags: ["Group Chat", "Private Messaging"],
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Ideas Capture",
    desc: "Never lose a brilliant idea. Capture and organize your thoughts.",
    tags: ["Quick Capture", "Tag Organization"],
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Notes & Journaling",
    desc: "Document your progress with notes and reflective journaling.",
    tags: ["Rich Text Editor", "Reflection Prompts"],
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Analytics & Insights",
    desc: "Understand your productivity patterns and track your progress.",
    tags: ["Progress Analytics", "Productivity Insights"],
  },
  {
    icon: <Upload className="h-6 w-6" />,
    title: "Achievement Portfolio",
    desc: "Showcase your certificates, awards, and accomplishments.",
    tags: ["Document Upload", "Portfolio Building"],
  },
];

const EverythingYouNeedToSucceed: React.FC = () => {
  return (
    <section id="features" className="relative overflow-hidden bg-gray-50 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <p className="inline-flex items-center justify-center rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm mb-6">
            Core Features
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight">
            Your complete productivity toolkit
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-gray-600 md:text-lg leading-relaxed">
            From vision to achievement—everything you need to plan, execute, and celebrate your journey in one powerful platform.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group relative flex flex-col gap-5 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-6 shadow-md shadow-purple-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/50 hover:bg-white hover:shadow-xl hover:shadow-purple-200/40"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div className="flex items-start gap-5">
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
              
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-purple-200/60 bg-purple-50/80 px-3 py-1 text-xs font-medium text-purple-700 transition-all duration-300 hover:border-purple-300 hover:bg-purple-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverythingYouNeedToSucceed;

import React from "react";
import FeatureCard from "./FeaturePreviewItem";
import { FaBullseye, FaTasks, FaBook, FaChartLine } from "react-icons/fa";

const features = [
  {
    icon: <FaBullseye />,
    title: "Vision Board",
    description: "Create, visualize and organize your long-term aspirations.",
    highlights: ["Picture Upload", "Goal Mapping", "Focus Mode"],
  },
  {
    icon: <FaTasks />,
    title: "Smart Task Manager",
    description: "Organize your day with intelligent planning tools.",
    highlights: ["Auto Scheduling", "Daily Planner", "Progress Tracking"],
  },
  {
    icon: <FaBook />,
    title: "Journal & Notes",
    description: "Reflect, document and grow with guided journaling.",
    highlights: ["Prompts", "Categories", "Mood Tracking"],
  },
  {
    icon: <FaChartLine />,
    title: "Analytics",
    description: "Track your habits, progress and productivity trends.",
    highlights: ["Graphs", "Success Rate", "Weekly Summary"],
  },
];

const FeaturesShowcaseSection: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-bold scroll-animate">Core Features</h2>
        <p className="text-gray-600 scroll-animate">Everything you need to stay consistent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesShowcaseSection;

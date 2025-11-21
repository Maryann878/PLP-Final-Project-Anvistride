import React from "react";

interface FeatureCardProps {
  icon: JSX.Element;          // ✅ Keep JSX.Element for passed icon
  title: string;
  description: string;
  highlights: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, highlights }) => {
  return (
    <div className="p-6 rounded-xl bg-white shadow hover:shadow-lg border scroll-animate-scale">
      <div className="text-purple-600 text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <ul className="space-y-2">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-700">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureCard;

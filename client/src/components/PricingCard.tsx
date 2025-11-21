import React from "react";
import { FaCheck, FaUsers, FaBell, FaChartBar, FaCloudUploadAlt, FaCrown, FaShieldAlt, FaTasks, FaLightbulb, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Shadcn button import

interface PricingCardProps {
  label?: string;
  title: string;
  price: string;
  priceNote?: string;
  features: string[];
  highlighted?: boolean;
  button?: { text: string; color: "purple" | "teal" };
}

const featureIcons: Record<string, React.ReactNode> = {
  "All 7 Core Features": <FaTasks className="text-green-500" />,
  "Vision Planning": <FaLightbulb className="text-green-500" />,
  "Smart Goals & Tasks": <FaChartBar className="text-green-500" />,
  "Ideas & Notes": <FaBook className="text-green-500" />,
  "Journaling": <FaBook className="text-green-500" />,
  "Basic Analytics": <FaChartBar className="text-green-500" />,
  "Community Support": <FaUsers className="text-green-500" />,
  "Everything in Free": <FaCheck className="text-green-500" />,
  "Advanced Analytics": <FaChartBar className="text-green-500" />,
  "Smart Notifications": <FaBell className="text-green-500" />,
  "Data Export/Import": <FaCloudUploadAlt className="text-green-500" />,
  "Priority Support": <FaCrown className="text-green-500" />,
  "Advanced Features": <FaCrown className="text-green-500" />,
  "Enhanced Security": <FaShieldAlt className="text-green-500" />,
  "Everything in Pro": <FaCheck className="text-green-500" />,
  "Team Collaboration": <FaUsers className="text-green-500" />,
  "Advanced Reporting": <FaChartBar className="text-green-500" />,
  "Custom Integrations": <FaCloudUploadAlt className="text-green-500" />,
  "Dedicated Support": <FaCrown className="text-green-500" />,
  "Enterprise Security": <FaShieldAlt className="text-green-500" />,
  "Custom Deployment": <FaCloudUploadAlt className="text-green-500" />,
};

const PricingCard: React.FC<PricingCardProps> = ({
  label,
  title,
  price,
  priceNote,
  features,
  highlighted,
  button,
}) => {
  return (
    <div
      className={`group relative p-8 lg:p-10 rounded-3xl border-2 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 ${
        highlighted
          ? "bg-white border-purple-500 shadow-2xl shadow-purple-200/50 scale-105 z-10"
          : "bg-white/90 border-gray-200 shadow-lg shadow-purple-100/30 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-200/40"
      }`}
    >
      {/* Gradient accent line for highlighted card */}
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-purple-400 to-teal-400 rounded-t-3xl" />
      )}

      {label && (
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all duration-300 ${
            highlighted
              ? "bg-gradient-to-r from-purple-600 via-purple-500 to-teal-400 text-white"
              : label === "For Teams"
              ? "bg-gradient-to-r from-purple-600 to-teal-400 text-white"
              : "bg-purple-600 text-white"
          }`}
        >
          {label}
        </div>
      )}

      <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900 mt-6 group-hover:text-purple-600 transition-colors duration-300">
        {title}
      </h3>
      
      <div className="mb-2">
        <span className={`text-5xl lg:text-6xl font-extrabold ${highlighted ? "text-purple-600" : "text-purple-700"}`}>
          {price}
        </span>
      </div>
      
      {priceNote && (
        <div className="text-sm text-gray-500 mb-8 font-medium">
          {priceNote}
        </div>
      )}

      <ul className="space-y-3.5 mb-8 text-left w-full max-w-xs mx-auto flex-1">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-gray-700 text-sm lg:text-base leading-relaxed"
          >
            <span className="flex-shrink-0 mt-0.5">
              {featureIcons[f] || <FaCheck className="text-green-500 w-5 h-5" />}
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {button && (
        <Button
          size="lg"
          className={`w-full font-semibold transition-all duration-300 ${
            highlighted
              ? "bg-gradient-to-r from-purple-600 via-purple-500 to-teal-400 text-white hover:shadow-xl hover:shadow-purple-300/50 hover:scale-105"
              : button.color === "teal"
              ? "bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:shadow-xl hover:shadow-teal-300/50 hover:scale-105"
              : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-300/50 hover:scale-105"
          }`}
          asChild
        >
          {button.text === "Start Free Now" ? (
            <Link to="/register">{button.text}</Link>
          ) : button.text === "Upgrade to Pro" ? (
            <Link to="/upgrade">{button.text}</Link>
          ) : button.text === "Contact Sales" ? (
            <Link to="/contact">{button.text}</Link>
          ) : (
            <Link to="/">{button.text}</Link>
          )}
        </Button>
      )}
    </div>
  );
};

export default PricingCard;

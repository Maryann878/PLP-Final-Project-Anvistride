import React from "react";
import AdditionalCard from "./AdditionalCard";
import { FaShieldAlt, FaCloud, FaMobileAlt } from "react-icons/fa";

const extra = [
  {
    icon: <FaShieldAlt />,
    title: "Secure Data",
    text: "End-to-end encryption for all your notes and journals.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Sync",
    text: "Your data stays updated across all your devices.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile First",
    text: "Optimized layouts for smaller screens.",
  },
];

const AdditionalFeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-bold scroll-animate">More Features</h2>
        <p className="text-gray-600 scroll-animate">
          Designed to support your daily workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {extra.map((e, i) => (
          <AdditionalCard key={i} {...e} />
        ))}
      </div>
    </section>
  );
};

export default AdditionalFeaturesSection;

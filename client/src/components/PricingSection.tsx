import React from "react";
import PricingCard from "./PricingCard";

const plans = [
  {
    label: "Perfect for Getting Started",
    title: "Free Forever",
    price: "$0",
    priceNote: "forever",
    features: [
      "All 7 Core Features",
      "Vision Planning",
      "Smart Goals & Tasks",
      "Ideas & Notes",
      "Journaling",
      "Basic Analytics",
      "Community Support",
    ],
    button: { text: "Start Free Now", color: "purple" as const },
  },
  {
    label: "Most Popular",
    title: "Pro",
    price: "$9",
    priceNote: "per month",
    features: [
      "Everything in Free",
      "Advanced Analytics",
      "Smart Notifications",
      "Data Export/Import",
      "Priority Support",
      "Advanced Features",
      "Enhanced Security",
    ],
    highlighted: true,
    button: { text: "Upgrade to Pro", color: "purple" as const },
  },
  {
    label: "For Teams",
    title: "Enterprise",
    price: "Custom",
    priceNote: "contact us",
    features: [
      "Everything in Pro",
      "Team Collaboration",
      "Advanced Reporting",
      "Custom Integrations",
      "Dedicated Support",
      "Enterprise Security",
      "Custom Deployment",
    ],
    button: { text: "Contact Sales", color: "teal" as const },
  },
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="relative overflow-hidden bg-white py-24">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-96 w-96 rounded-full bg-purple-100/25 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex justify-end">
        <div className="h-80 w-80 rounded-full bg-teal-100/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="inline-flex items-center justify-center rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm mb-6">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight mb-5">
            Choose Your Plan
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600 md:text-lg leading-relaxed">
            Pick the plan that fits your productivity needs — all features included!
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((p, i) => (
            <PricingCard key={i} {...p} />
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="relative max-w-3xl mx-auto mt-16 bg-white/80 backdrop-blur-md rounded-2xl border border-purple-100/50 py-6 px-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-base text-gray-700 font-medium shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 text-white shadow-md">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C7.03 2 3 6.03 3 11c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7 0-3.86 3.14-7 7-7 3.86 0 7 3.14 7 7 0 3.86-3.14 7-7 7zm-1-7V7h2v4h-2zm0 4h2v2h-2v-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-center sm:text-left">
            30-day money-back guarantee on all paid plans
          </span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

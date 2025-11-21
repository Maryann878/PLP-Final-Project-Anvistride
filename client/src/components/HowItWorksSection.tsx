import { Target, Check, BarChart } from "lucide-react";

const steps = [
  { icon: Target, title: "Define your vision", desc: "Clarify the long-term story, focus areas, and success markers before anything else." },
  { icon: Check, title: "Design goals & tasks", desc: "Break vision into milestones, then daily strides with priorities and accountability." },
  { icon: BarChart, title: "Track, reflect, adjust", desc: "Review dashboards, capture journal entries, and celebrate achievements to stay in stride." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gray-50 py-20">
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="inline-flex items-center justify-center rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm mb-6">Simple Process</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight">How it works</h2>
          <p className="mt-4 text-base text-gray-500 md:text-lg">
            Three simple steps to transform your vision into reality. Start today, see results tomorrow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {/* Connector between steps (hidden on mobile) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-0 left-full w-6 h-6 -translate-x-1/2 z-10 rounded-lg bg-white shadow-md border border-gray-100" />
                )}
                <div
                  className="group relative rounded-3xl border border-white bg-white/90 p-8 text-center shadow-xl shadow-purple-100/60 transition hover:-translate-y-1"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-300 text-white shadow-lg shadow-purple-200/70">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
                    Step {idx + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-gray-500 md:text-base">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

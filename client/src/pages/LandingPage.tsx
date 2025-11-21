import WhyChooseUs from "@/components/WhyChooseSection";
import PricingSection from "@/components/PricingSection";
import CallToAction from "@/components/CTASection";
import FooterSection from "@/components/Footer";
import HowItWorksSection from "@/components/HowItWorksSection";
import Features from "@/components/Features";
import EverythingYouNeedToSucceed from "@/components/EverythingYouNeedToSucceed";
import ScrollButtons from "@/components/ScrollButtons";
import Navbar from "../components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";
import HeroSection from "@/components/HeroSection";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const { isOpen: isCommandPaletteOpen, setIsOpen: setCommandPaletteOpen } = useCommandPalette();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Handle Cmd+/ for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <NavbarMobile />
      <main className="flex flex-col gap-0">
        <HeroSection />
        <EverythingYouNeedToSucceed />
        <Features />
        <HowItWorksSection />
        <WhyChooseUs />
        <PricingSection />
        <CallToAction />
      </main>
      <FooterSection />
      <ScrollButtons />
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <KeyboardShortcuts open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}














// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Navbar from "../components/Navbar";
// import NavbarMobile from "@/components/NavbarMobile";

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
//       {/* Navbar */}
//       <Navbar/>
//       <NavbarMobile />

//       {/* Hero Section */}
//       <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-8 py-16 gap-10">
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-xl text-center md:text-left"
//         >
//           <h1 className="text-5xl font-bold mb-4 leading-tight text-gray-900">
//             Vision into <span className="text-primary">Stride</span>, One Step at a Time.
//           </h1>
//           <p className="text-lg text-gray-600 mb-6">
//             Turn your long-term goals into actionable steps. Stay motivated, track progress, and celebrate your wins — all in one place.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
//             <Link to="/register">
//               <Button size="lg" className="px-6">Get Started</Button>
//             </Link>
//             <Link to="/login">
//               <Button variant="outline" size="lg" className="px-6">
//                 Sign In
//               </Button>
//             </Link>
//           </div>
//         </motion.div>

//         <motion.img
//           src="https://illustrations.popsy.co/white/task-done.svg"
//           alt="Productivity Illustration"
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="w-full max-w-md"
//         />
//       </main>

//       {/* Features Section */}
//       <section className="px-8 py-16 bg-white border-t">
//         <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
//           Why Choose <span className="text-primary">Anvistride</span>?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           {[
//             {
//               title: "Plan Visions",
//               desc: "Break down your dreams into structured, achievable milestones.",
//               icon: "🌟",
//             },
//             {
//               title: "Track Progress",
//               desc: "Visualize your journey and measure how far you've come.",
//               icon: "📊",
//             },
//             {
//               title: "Stay Motivated",
//               desc: "Celebrate every stride with built-in motivation boosters.",
//               icon: "🔥",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: i * 0.2 }}
//               viewport={{ once: true }}
//               className="text-center p-6 border rounded-2xl shadow-sm hover:shadow-md transition"
//             >
//               <div className="text-4xl mb-4">{item.icon}</div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">
//                 {item.title}
//               </h3>
//               <p className="text-gray-600">{item.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-6 text-center border-t text-sm text-gray-500">
//         © {new Date().getFullYear()} Anvistride. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

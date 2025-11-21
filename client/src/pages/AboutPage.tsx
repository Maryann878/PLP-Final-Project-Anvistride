// client/src/pages/AboutPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, Zap, Shield, Heart, Rocket, Award, Eye, Quote, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";
import Footer from "@/components/Footer";

const AboutPage: React.FC = () => {
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Purpose-Driven",
      description: "We believe everyone has a vision worth pursuing. Our mission is to make goal achievement accessible and enjoyable.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community-Focused",
      description: "Building a supportive community where users can connect, share, and grow together through accountability partnerships.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Innovation",
      description: "Leveraging cutting-edge technology like real-time sync and AI-ready architecture to enhance productivity.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description: "Your data is yours. We prioritize security and privacy, ensuring your visions and goals remain confidential.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "User-Centric",
      description: "Every feature is designed with the user in mind, focusing on simplicity, beauty, and effectiveness.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Continuous Growth",
      description: "We're constantly improving based on user feedback, adding features that truly matter to your journey.",
    },
  ];

  const stats = [
    { label: "SDG Aligned", value: "3 Goals", description: "Supporting UN Sustainable Development Goals" },
    { label: "Built With", value: "MERN Stack", description: "Modern, scalable technology" },
    { label: "Real-time", value: "100% Sync", description: "Multi-device synchronization" },
    { label: "Community", value: "Growing", description: "Building together" },
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />
      <NavbarMobile />
      
      <main className="pt-20 md:pt-24">
        {/* Back to Home Button */}
        <div className="absolute top-24 left-4 md:left-6 z-10">
          <Button
            variant="ghost"
            asChild
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50/50"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </Button>
        </div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-teal-50 py-20 md:py-28">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-purple-50/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.4em] text-purple-600 shadow-sm">
              <Award className="h-4 w-4" />
              About Anvistride
            </div>
            
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Vision into</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] [text-shadow:_0_0_0px_rgba(255,215,0,0.6),_0_2px_10px_rgba(0,0,0,0.3)]">
                Stride
              </span>
              , One Step at a Time
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
              Anvistride is more than a productivity app—it's your partner in turning dreams into reality. 
              Built with purpose, designed for impact, and aligned with the UN Sustainable Development Goals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild className="bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:from-purple-700 hover:to-teal-600">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What is Anvistride */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6 space-y-8">
            {/* Main Description */}
            <Card className={`${glassClass} p-8 md:p-12`}>
              <CardHeader className="p-0 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
                  What is <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Anvistride</span>?
                </h2>
              </CardHeader>
              <CardContent className="p-0 space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Anvistride</strong> (A <strong>N</strong>ew <strong>V</strong>ision <strong>I</strong>n <strong>S</strong>tride) 
                  is a comprehensive goal-setting and productivity platform designed to help individuals transform their long-term visions 
                  into actionable, achievable steps.
                </p>
                <p>
                  Turn your dreams into <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">unstoppable momentum</span> with our comprehensive productivity platform. 
                  From vision clarity to daily execution, we help you build the confidence and consistency 
                  needed to achieve your most ambitious goals through structured planning and purposeful action.
                </p>
                <p>
                  Built with the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js) and enhanced with <strong>Socket.IO</strong> 
                  for real-time features, Anvistride represents a modern approach to personal development and goal achievement.
                </p>
              </CardContent>
            </Card>

            {/* Acronym Breakdown */}
            <Card className={`${glassClass} p-8 md:p-12`}>
              <CardHeader className="p-0 mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-6 tracking-tight">
                  What does <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Anvistride</span> mean?
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap justify-center items-center gap-4 text-xl font-bold">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <span className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">A</span>
                    <span className="text-purple-700">new</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <span className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">V</span>
                    <span className="text-purple-700">ision</span>
                  </div>
                  <div className="p-4">
                    <span className="text-gray-600 font-semibold">in</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <span className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center text-lg font-extrabold shadow-lg">S</span>
                    <span className="text-amber-700">tride</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inspiration Quote */}
            <Card className={`${glassClass} p-8 md:p-12 bg-gradient-to-br from-purple-50 via-teal-50/50 to-purple-50/50 border-2 border-purple-200/60`}>
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 mb-4 shadow-lg">
                    <Quote className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-purple-700 tracking-tight">Our Inspiration</h3>
                </div>
                <blockquote className="relative bg-white p-8 rounded-2xl border-l-4 border-purple-600 shadow-lg mb-6">
                  <span className="absolute -top-6 left-6 text-7xl text-purple-200 font-serif leading-none">"</span>
                  <p className="text-2xl italic text-gray-900 font-semibold mb-6 pl-8 leading-relaxed tracking-wide">
                    Write the vision and make it plain on tablets, that he may run who reads it.
                  </p>
                  <cite className="text-purple-700 font-bold not-italic text-lg pl-8">— Habakkuk 2:2</cite>
                </blockquote>
                <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-800 font-medium">
                  This powerful verse inspired the creation of Anvistride. Just as the prophet Habakkuk was instructed to write down the vision clearly so others could run with it, we believe that writing down your personal vision and making it plain through structured planning enables you to <span className="text-purple-700 font-bold">run with purpose</span> and <span className="text-teal-700 font-bold">achieve your goals</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-gray-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className={`${glassClass} p-8 text-center bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200/60`}>
                <div className="inline-block p-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 mb-4 shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-purple-700 font-extrabold text-2xl mb-4 tracking-tight">Our Vision</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-lg">
                  Empowering individuals to transform their aspirations into meaningful action through structured planning and consistent execution.
                </p>
              </Card>
              <Card className={`${glassClass} p-8 text-center bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200/60`}>
                <div className="inline-block p-4 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-teal-700 font-extrabold text-2xl mb-4 tracking-tight">Our Mission</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-lg">
                  Help you turn your <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">vision</span> into <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">stride</span> by providing the tools, structure, and motivation needed to achieve your long-term goals.
                </p>
              </Card>
            </div>

            {/* Core Values */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value, idx) => (
                <Card key={idx} className={`${glassClass} p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-teal-500 text-white shadow-lg">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SDG Alignment */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Card className={`${glassClass} p-8 md:p-12`}>
              <CardHeader className="p-0 mb-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/50 bg-teal-50/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.4em] text-teal-600">
                  Impact
                </div>
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
                  Aligned with UN Sustainable Development Goals
                </h2>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Anvistride is built as a final project for PLP Academy, aligned with the United Nations Sustainable Development Goals (SDGs):
                </p>
                
                <div className="grid gap-6 md:grid-cols-3 mt-8">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">SDG 4</div>
                    <h3 className="font-bold text-gray-900 mb-2">Quality Education</h3>
                    <p className="text-sm text-gray-700">
                      Developing goal-setting and productivity skills essential for personal and professional growth.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">SDG 8</div>
                    <h3 className="font-bold text-gray-900 mb-2">Decent Work & Economic Growth</h3>
                    <p className="text-sm text-gray-700">
                      Enabling career goal achievement, entrepreneurship, and professional skill development.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">SDG 17</div>
                    <h3 className="font-bold text-gray-900 mb-2">Partnerships for Goals</h3>
                    <p className="text-sm text-gray-700">
                      Fostering collaboration and mutual support through community features and accountability partnerships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Card className={`${glassClass} p-8 md:p-12`}>
              <CardHeader className="p-0 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">Core Features</h2>
                <p className="text-lg text-gray-600">
                  Everything you need to plan, execute, and achieve your goals
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Vision & Planning", items: ["Vision Board", "Goal Setting", "Progress Tracking", "Milestones"] },
                    { title: "Productivity", items: ["Task Management", "Daily Planning", "Priorities", "Deadlines"] },
                    { title: "Capture & Organize", items: ["Ideas", "Notes", "Journaling", "Achievements", "Search"] },
                    { title: "Connect & Sync", items: ["Real-time Chat", "Multi-device Sync", "Community", "Notifications"] },
                  ].map((category, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                      <h5 className="font-semibold text-purple-600 mb-3">{category.title}</h5>
                      <ul className="space-y-1">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-teal-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-br from-purple-50 to-teal-50 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className={`${glassClass} p-6 text-center`}>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.description}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Card className={`${glassClass} p-12`}>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join Anvistride today and turn your vision into stride, one step at a time.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:from-purple-700 hover:to-teal-600">
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;


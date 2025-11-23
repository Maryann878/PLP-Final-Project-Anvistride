import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Target,
  CheckSquare,
  Lightbulb,
  StickyNote,
  ArrowRight,
  ArrowLeft,
  Check,
  SkipForward,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addVision, addGoal, addTask, addIdea, addNote } = useAppContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Steps configuration
  const steps = [
    {
      id: 0,
      title: "Welcome to Anvistride!",
      subtitle: "Let's get you started on your journey",
      content: (
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-white/50 animate-pulse">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Hi <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">{user?.username}</span>!
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-8">
            Anvistride helps you transform <span className="font-bold text-purple-600">clarity</span> into <span className="font-bold text-teal-600">action</span> and reflection. Let's take a quick tour to show you how it works.
          </p>
          <div className="flex gap-6 justify-center mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-105">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">5</p>
              <p className="text-sm text-gray-700 font-semibold">Quick Steps</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white border-2 border-teal-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-105">
              <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-purple-500 bg-clip-text text-transparent">2</p>
              <p className="text-sm text-gray-700 font-semibold">Minutes</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Eye, title: "Define your vision", desc: "Your big picture goals", delay: 0, color: "purple" },
              { icon: Target, title: "Set clear goals", desc: "Measurable milestones", delay: 100, color: "teal" },
              { icon: CheckSquare, title: "Track your tasks", desc: "Daily actions", delay: 200, color: "amber" },
              { icon: Lightbulb, title: "Capture ideas", desc: "Never lose inspiration", delay: 300, color: "purple" },
              { icon: StickyNote, title: "Take notes", desc: "Document learnings", delay: 400, color: "teal" },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                purple: "from-purple-600 to-purple-700 border-purple-200",
                teal: "from-teal-600 to-teal-700 border-teal-200",
                amber: "from-amber-600 to-amber-700 border-amber-200",
              };
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-white to-gray-50/50 border-2 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-xl p-5 flex items-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[feature.color as keyof typeof colorClasses].split(' ')[1]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-base">{feature.title}</p>
                    <p className="text-sm text-gray-600 font-medium">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      action: "Get Started",
      onAction: () => markStepComplete(0),
    },
    {
      id: 1,
      title: "Create Your First Vision",
      subtitle: "Start with your biggest dream or aspiration",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Card className={`${glassClass} w-full max-w-md border-purple-200/50 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white p-5 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">My Vision</h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-gradient-to-br from-white to-purple-50/30">
                <p className="text-gray-800 italic text-lg font-medium leading-relaxed">
                  "Build a successful tech startup that solves real-world problems"
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">5 years</Badge>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-gray-700 font-semibold">
                    <span>Progress:</span>
                    <span className="text-purple-600">25%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-teal-500 rounded-full shadow-sm" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">What is a Vision?</h4>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-gray-700 leading-relaxed">
              A vision is your long-term aspiration - the big picture of what you want to achieve. It should inspire and motivate you.
            </p>
            <div className="space-y-3">
              {[
                { icon: "⏰", text: "Think 5-10 years ahead", colorClass: "purple" },
                { icon: "🎨", text: "Be specific but not limiting", colorClass: "teal" },
                { icon: "❤️", text: "Make it personally meaningful", colorClass: "purple" },
              ].map((tip, index) => {
                const colorMap = {
                  purple: "bg-gradient-purple-50 border-purple-200",
                  teal: "bg-gradient-teal-50 border-teal-200",
                };
                return (
                  <div key={index} className={`flex items-center gap-4 p-4 ${colorMap[tip.colorClass as keyof typeof colorMap]} rounded-xl hover:shadow-lg hover:translate-x-2 transition-all duration-300`}>
                    <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                    <span className="text-gray-800 font-semibold">{tip.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
      action: "Create Sample Vision",
      onAction: () => {
        (addVision as any)({
          id: Date.now().toString(),
          title: "Build a Successful Tech Startup",
          description: "Create a technology company that solves real-world problems and makes a positive impact on people's lives",
          timeframe: "5 years",
          status: "Active",
          priority: "High",
          progress: 25,
          createdAt: new Date().toISOString(),
        });
        markStepComplete(1);
      },
    },
    {
      id: 2,
      title: "Set Your First Goal",
      subtitle: "Break down your vision into achievable milestones",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Card className={`${glassClass} w-full max-w-md border-teal-200/50 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 text-white p-5 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">My Goal</h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-gradient-to-br from-white to-teal-50/30">
                <p className="text-gray-800 font-medium text-lg">"Launch MVP of my app within 6 months"</p>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-gray-700 font-semibold">
                    <span>Progress:</span>
                    <span className="text-teal-600">30% Complete</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-purple-600 rounded-full shadow-sm" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">What is a Goal?</h4>
            <p className="text-gray-700 leading-relaxed">
              Goals are specific milestones that move you toward your vision. They should be measurable and time-bound.
            </p>
            <ul className="space-y-2">
              {["Set clear deadlines", "Make them measurable", "Link them to your vision"].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      action: "Create Sample Goal",
      onAction: () => {
        const id = Date.now().toString();
        (addGoal as any)({
          id,
          title: "Launch MVP of My App",
          description: "Develop and launch the minimum viable product of my startup idea",
          deadline: "2025-06-30",
          progress: 30,
          status: "In Progress",
          linkedVisionId: "1",
          createdAt: new Date().toISOString(),
        });
        window.sessionStorage.setItem("onboardingGoalId", id);
        markStepComplete(2);
      },
    },
    {
      id: 3,
      title: "Add Your First Task",
      subtitle: "Turn goals into daily actions",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Card className={`${glassClass} w-full max-w-md border-amber-200/50 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-purple-500 text-white p-5 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">My Task</h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-gradient-to-br from-white to-amber-50/30">
                <p className="text-gray-800 font-medium text-lg">"Research target market and competitors"</p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <Badge className="bg-red-100 text-red-700 border-red-200">High Priority</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">What is a Task?</h4>
            <p className="text-gray-700 leading-relaxed">
              Tasks are the daily actions that move you toward your goals. They should be specific and actionable.
            </p>
            <ul className="space-y-2">
              {["Be specific and actionable", "Set priorities (High, Medium, Low)", "Track your progress"].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      action: "Create Sample Task",
      onAction: () => {
        const goalId = window.sessionStorage.getItem("onboardingGoalId");
        (addTask as any)({
          id: Date.now().toString(),
          title: "Research Target Market",
          description: "Conduct market research to understand customer needs and competitive landscape",
          priority: "High",
          status: "In Progress",
          goalId: goalId || undefined,
          createdAt: new Date().toISOString(),
        });
        markStepComplete(3);
      },
    },
    {
      id: 4,
      title: "Capture Your First Idea",
      subtitle: "Never lose a spark of inspiration",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Card className={`${glassClass} w-full max-w-md border-purple-200/50 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white p-5 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">My Idea</h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-gradient-to-br from-white to-purple-50/30">
                <p className="text-gray-800 font-medium text-lg italic">"What if we could use AI to personalize user experiences?"</p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Innovation</Badge>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">AI</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">What is an Idea?</h4>
            <p className="text-gray-700 leading-relaxed">
              Ideas are your creative thoughts and insights. Capture them whenever inspiration strikes!
            </p>
            <ul className="space-y-2">
              {["Write down everything", "Link ideas to visions/goals", "Review and develop them later"].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      action: "Create Sample Idea",
      onAction: () => {
        (addIdea as any)({
          id: Date.now().toString(),
          title: "AI-Powered Personalization",
          description: "Use artificial intelligence to create personalized user experiences",
          category: "Innovation",
          status: "Draft",
          linkedVisionId: "1",
          createdAt: new Date().toISOString(),
        });
        markStepComplete(4);
      },
    },
    {
      id: 5,
      title: "Take Your First Note",
      subtitle: "Document your thoughts and learnings",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Card className={`${glassClass} w-full max-w-md border-teal-200/50 shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
              <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-purple-500 text-white p-5 flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <StickyNote className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">My Note</h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-gradient-to-br from-white to-teal-50/30">
                <p className="text-gray-800 font-medium text-lg">"Key insights from today's market research session..."</p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <Badge className="bg-teal-100 text-teal-700 border-teal-200">Today</Badge>
                  <Badge className="bg-teal-100 text-teal-700 border-teal-200">Research</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-900">What are Notes?</h4>
            <p className="text-gray-700 leading-relaxed">
              Notes help you document important information, insights, and learnings as you work toward your goals.
            </p>
            <ul className="space-y-2">
              {["Document key learnings", "Record important information", "Link notes to related items"].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      action: "Create Sample Note",
      onAction: () => {
        (addNote as any)({
          id: Date.now().toString(),
          title: "Market Research Insights",
          content: "Key findings from today's market research:\n\n1. Target audience prefers mobile-first solutions\n2. Competitors lack personalization features\n3. Users want faster response times\n\nNext steps: Validate these insights with user interviews.",
          category: "Research",
          linkedGoalId: "1",
          createdAt: new Date().toISOString(),
        });
        markStepComplete(5);
      },
    },
    {
      id: 6,
      title: "You're All Set!",
      subtitle: "Ready to start your journey",
      content: (
        <div className="text-center space-y-8">
          <div className="relative mb-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-purple-600 flex items-center justify-center shadow-2xl animate-bounce">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-amber-500 to-teal-500 bg-clip-text text-transparent">Congratulations!</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-8">
            You've created your first vision, goal, task, idea, and note. You're ready to start your journey with <span className="font-bold text-purple-600">Anvistride</span>!
          </p>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <Trophy className="h-6 w-6" />
            <span>Onboarding Complete!</span>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
            {[
              { icon: Eye, label: "Vision Created", count: 1 },
              { icon: Target, label: "Goal Set", count: 1 },
              { icon: CheckSquare, label: "Task Added", count: 1 },
              { icon: Lightbulb, label: "Idea Captured", count: 1 },
              { icon: StickyNote, label: "Note Taken", count: 1 },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:-translate-y-1 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{stat.count}</p>
                  <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
          <Card className={`${glassClass} max-w-3xl mx-auto mt-8 border-purple-200/50`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Next?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "📊", title: "Explore Dashboard", desc: "See your progress at a glance", colorClass: "purple" },
                  { icon: "➕", title: "Add More Content", desc: "Create more visions, goals, and tasks", colorClass: "teal" },
                  { icon: "🔍", title: "Use Search", desc: "Find your content quickly", colorClass: "purple" },
                  { icon: "⚙️", title: "Customize Settings", desc: "Personalize your experience", colorClass: "teal" },
                ].map((step, index) => {
                  const colorMap = {
                    purple: "bg-gradient-purple-50 border-purple-200",
                    teal: "bg-gradient-teal-50 border-teal-200",
                  };
                  return (
                    <div key={index} className={`flex items-center gap-4 p-4 ${colorMap[step.colorClass as keyof typeof colorMap]} rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                      <span className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-md">{step.icon}</span>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 text-base mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      action: "Go to Dashboard",
      onAction: () => {
        window.sessionStorage.removeItem("onboardingGoalId");
        markStepComplete(6);
      },
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/app");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/app");
  };

  const handleAction = () => {
    const step = steps[currentStep];
    if (step.onAction) {
      step.onAction();
    }
    handleNext();
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex flex-col relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className={`${glassClass} m-4 mb-0 border-purple-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-white/95 shadow-lg flex items-center justify-center p-2">
            <img src="/Anvistride_logo.png" alt="Anvistride" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Onboarding</h2>
            <p className="text-xs text-gray-600">Welcome to Anvistride</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 max-w-sm">
          <div className="w-full h-3 bg-gray-200/80 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 rounded-full transition-all duration-500 shadow-lg" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700 font-semibold">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSkip} 
          className="flex items-center gap-2 border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition-all"
        >
          <SkipForward className="h-4 w-4" />
          <span className="hidden sm:inline">Skip Tour</span>
          <span className="sm:hidden">Skip</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16 max-w-6xl mx-auto w-full relative z-10">
        <div className={`${glassClass} w-full p-8 md:p-12 mb-8 border-purple-200/50`}>
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              {currentStepData.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">{currentStepData.subtitle}</p>
          </div>

          <div className="w-full mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {currentStepData.content}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2 w-full sm:w-auto border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            
            <Button
              onClick={handleAction}
              className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8 py-6 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg w-full sm:w-auto"
            >
              {currentStepData.action}
              {currentStep < steps.length - 1 && <ArrowRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer - Step Indicators */}
      <div className={`${glassClass} m-4 mt-0 border-purple-200/50 p-6 flex justify-center relative z-10`}>
        <div className="flex gap-3 flex-wrap justify-center">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index === currentStep
                  ? 'bg-gradient-to-br from-purple-600 to-teal-500 text-white scale-110 shadow-xl ring-2 ring-white'
                  : completedSteps.includes(index)
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105'
              }`}
              title={`Step ${index + 1}: ${step.title}`}
            >
              {completedSteps.includes(index) ? <Check className="h-6 w-6" /> : index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

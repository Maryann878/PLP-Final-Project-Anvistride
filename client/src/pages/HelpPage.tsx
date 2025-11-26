import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Book, Video, Mail, Phone, Clock, ExternalLink, CheckCircle } from "lucide-react";
import { getGlobalToast } from "@/lib/toast";

const faqData = [
  {
    id: "1",
    question: "How do I create my first vision?",
    answer: "To create your first vision, go to the Vision page and click the 'Create Vision' button. Enter a title and description for your long-term aspiration. Visions should be 5-10 year goals that inspire and motivate you.",
    category: "getting-started"
  },
  {
    id: "2",
    question: "What's the difference between a vision, goal, and task?",
    answer: "A vision is your long-term aspiration (5-10 years), goals are specific milestones toward that vision (months to years), and tasks are daily actions that move you toward your goals. Think of it as: Vision → Goals → Tasks.",
    category: "concepts"
  },
  {
    id: "3",
    question: "How do I link tasks to goals and visions?",
    answer: "When creating or editing a task, you can select which goal or vision it relates to from the dropdown menus. This helps you see how your daily actions connect to your bigger picture.",
    category: "features"
  },
  {
    id: "4",
    question: "Can I export my data?",
    answer: "Yes! Go to Settings > Data Management to export your visions, goals, tasks, ideas, and notes. You can export as JSON format for backup or migration purposes.",
    category: "data"
  },
  {
    id: "5",
    question: "How do I recover deleted items?",
    answer: "Deleted items go to the Recycle Bin where they can be restored. Go to the Recycle Bin page to view deleted items and restore them.",
    category: "data"
  },
  {
    id: "6",
    question: "Is my data secure?",
    answer: "Yes, your data is stored locally in your browser and is not sent to our servers. For cloud backup, you can export your data and store it securely elsewhere.",
    category: "privacy"
  },
  {
    id: "7",
    question: "How do I use the search feature?",
    answer: "Use the search bar in each page to find content across visions, goals, tasks, ideas, and notes. The search looks through titles, descriptions, and content.",
    category: "features"
  },
  {
    id: "8",
    question: "Can I customize the app appearance?",
    answer: "Yes! Go to Settings > Display Preferences to customize themes and layout options.",
    category: "customization"
  }
];

const tutorials = [
  {
    id: 1,
    title: "Getting Started with Anvistride",
    description: "Learn the basics of setting up your first vision and goals",
    duration: "5 min",
    type: "video" as const,
  },
  {
    id: 2,
    title: "Creating Effective Goals",
    description: "Best practices for setting SMART goals that drive results",
    duration: "8 min",
    type: "article" as const,
  },
  {
    id: 3,
    title: "Task Management Tips",
    description: "How to break down goals into actionable daily tasks",
    duration: "6 min",
    type: "video" as const,
  },
  {
    id: 4,
    title: "Using the Dashboard",
    description: "Navigate and customize your dashboard for maximum productivity",
    duration: "4 min",
    type: "video" as const,
  }
];

export default function HelpPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-gray-600">Find answers, learn features, and get support</p>
          </div>
        </div>
      </div>


      {/* Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <Card className={`${glassClass} border-purple-200/50 p-2 sm:p-3`}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 gap-2 h-auto">
            <TabsTrigger 
              value="faq" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tutorials" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <Book className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Tutorials</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:hover:scale-[1.01] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>
        </Card>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <Card className={glassClass}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Video Tutorials & Guides</h2>
            <p className="text-sm text-gray-600 mb-6">Learn how to use Anvistride effectively</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className={`${glassClass} hover:shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      {tutorial.type === 'video' ? (
                        <Video className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Book className="h-4 w-4 text-teal-600" />
                      )}
                      <span className="text-gray-600 font-medium capitalize">{tutorial.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{tutorial.title}</CardTitle>
                  <p className="text-sm text-gray-600">{tutorial.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    {tutorial.type === 'video' ? 'Watch Video' : 'Read Article'}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <Card className={glassClass}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Email Support</h4>
                    <a 
                      href="mailto:anvistride@gmail.com" 
                      className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
                    >
                      anvistride@gmail.com
                    </a>
                    <p className="text-xs text-gray-600 mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-teal-50 border border-teal-200">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Phone Support</h4>
                    <p className="text-teal-600 font-medium">+2348163684000</p>
                    <p className="text-xs text-gray-600 mt-1">Mon-Fri, 9 AM - 6 PM WAT</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className={glassClass}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitSuccess ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <Button
                      onClick={() => setSubmitSuccess(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="billing">Billing Issue</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        placeholder="What do you need help with?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="Describe your issue or question..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

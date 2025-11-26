import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, CheckCircle, Send, MessageSquare, ArrowLeft } from "lucide-react";
import { getGlobalToast } from "@/lib/toast";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      
      const toast = getGlobalToast();
      if (toast) {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
          variant: "success",
          duration: 4000,
        });
      }
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      const toast = getGlobalToast();
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      <NavbarMobile />
      <div className="pt-20 md:pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* Back to Home Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              asChild
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-all duration-200"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Link>
            </Button>
          </div>
          
          {/* Header */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 ring-4 ring-purple-200/50 dark:ring-purple-800/50 hover:scale-105 transition-transform duration-300">
                <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent leading-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Info */}
          <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-teal-500 rounded-full"></div>
                Get in Touch
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base">Choose the best way to reach us</p>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6">
              <div className="flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30 ring-2 ring-white/50 dark:ring-purple-800/50 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Email Support</h4>
                  <a 
                    href="mailto:anvistride@gmail.com" 
                    className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-base sm:text-lg no-underline hover:underline"
                  >
                    anvistride@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 border border-teal-200/50 dark:border-teal-700/50 hover:shadow-xl hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30 ring-2 ring-white/50 dark:ring-teal-800/50 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Phone Support</h4>
                  <a 
                    href="tel:+2348163684000" 
                    className="text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors text-base sm:text-lg no-underline hover:underline"
                  >
                    +234 816 368 4000
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Mon-Fri, 9 AM - 6 PM WAT</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 border border-gray-200/50 dark:border-gray-700/50">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Why Contact Us?</h4>
                <ul className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Get help with your account or features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Report bugs or technical issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Share feedback and suggestions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Ask questions about our platform</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className={`${glassClass} border-teal-200/50 dark:border-teal-800/50`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-purple-500 rounded-full"></div>
                Send a Message
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base">Fill out the form below and we'll get back to you</p>
            </CardHeader>
            <CardContent>
              {submitSuccess ? (
                <div className="text-center space-y-6 py-8 sm:py-12">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 ring-4 ring-green-200/50 dark:ring-green-800/50 animate-pulse-slow">
                    <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-md mx-auto">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                  <Button
                    onClick={() => setSubmitSuccess(false)}
                    variant="outline"
                    className="mt-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Your name"
                        required
                        className="h-11 sm:h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="your@email.com"
                        required
                        className="h-11 sm:h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Category</Label>
                    <Select
                      value={contactForm.category}
                      onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                    >
                      <SelectTrigger className="h-11 sm:h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400">
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
                    <Label htmlFor="subject" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      placeholder="What do you need help with?"
                      required
                      className="h-11 sm:h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="Describe your issue or question..."
                      rows={6}
                      required
                      className="resize-none border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 text-white shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-12 sm:h-14 font-bold text-base sm:text-lg focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}


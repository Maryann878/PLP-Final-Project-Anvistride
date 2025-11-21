import React, { useState } from "react";
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
import { Mail, Phone, CheckCircle, Send, MessageSquare } from "lucide-react";
import { getGlobalToast } from "@/lib/toast";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20">
              <MessageSquare className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card className={`${glassClass} border-purple-200/50`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Get in Touch</CardTitle>
              <p className="text-gray-600 mt-2">Choose the best way to reach us</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30 ring-2 ring-white/50">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1.5">Email Support</h4>
                  <a 
                    href="mailto:anvistride@gmail.com" 
                    className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors text-lg"
                  >
                    anvistride@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30 ring-2 ring-white/50">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1.5">Phone Support</h4>
                  <a 
                    href="tel:+2348163684000" 
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors text-lg"
                  >
                    +234 816 368 4000
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Mon-Fri, 9 AM - 6 PM WAT</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50">
                <h4 className="font-bold text-gray-900 mb-2">Why Contact Us?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Get help with your account or features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Report bugs or technical issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Share feedback and suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ask questions about our platform</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className={`${glassClass} border-teal-200/50`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Send a Message</CardTitle>
              <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you</p>
            </CardHeader>
            <CardContent>
              {submitSuccess ? (
                <div className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-green-500/30 ring-2 ring-white/50">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
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
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Your name"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="your@email.com"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                    <Select
                      value={contactForm.category}
                      onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                    >
                      <SelectTrigger className="h-11">
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
                    <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      placeholder="What do you need help with?"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      placeholder="Describe your issue or question..."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 text-white shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] transition-all duration-300 h-12 font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
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
  );
}


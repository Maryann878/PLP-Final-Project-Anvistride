import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, UserCheck, Lock, Eye, Database, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";

export default function PrivacyPolicyPage() {
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      <NavbarMobile />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="space-y-6 sm:space-y-8 p-4 md:p-6 max-w-5xl mx-auto relative">
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 ring-4 ring-purple-200/50 dark:ring-purple-800/50 hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent leading-tight">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Last updated: January 2025</p>
          </div>

      {/* Content */}
      <div className="space-y-5 sm:space-y-6">
        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              At Anvistride ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            <p>
              By using Anvistride, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our application.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Database className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Personal Information</h3>
              <p className="mb-3">We may collect the following types of personal information:</p>
              <ul className="space-y-2.5 list-disc list-inside ml-4">
                <li><strong className="text-gray-900 dark:text-gray-100">Account Information:</strong> Username, email address, and password</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Profile Information:</strong> Name, profile picture, and other optional details you choose to provide</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Usage Data:</strong> Information about how you interact with our application</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Device Information:</strong> Device type, operating system, and browser information</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Content Data</h3>
              <p className="mb-3">We store the content you create within Anvistride, including:</p>
              <ul className="space-y-2.5 list-disc list-inside ml-4">
                <li>Visions, goals, tasks, ideas, and notes</li>
                <li>Progress tracking data and completion status</li>
                <li>Custom settings and preferences</li>
                <li>Search queries and interaction patterns</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>We use the collected information for the following purposes:</p>
            <ul className="space-y-2.5 list-disc list-inside ml-4">
              <li><strong className="text-gray-900 dark:text-gray-100">Service Provision:</strong> To provide and maintain our application functionality</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Account Management:</strong> To create and manage your user account</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Personalization:</strong> To customize your experience and provide relevant features</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Analytics:</strong> To understand usage patterns and improve our services</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Communication:</strong> To send important updates and notifications</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Security:</strong> To protect against fraud and unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Data Storage and Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Local Storage:</strong> Your data is primarily stored locally on your device using browser storage mechanisms. This means your personal information and content remain on your device and are not transmitted to our servers unless you explicitly choose to sync or backup your data.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Data Encryption:</strong> When data is transmitted or stored, we use industry-standard encryption protocols to protect your information.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Access Controls:</strong> We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="space-y-2.5 list-disc list-inside ml-4">
              <li><strong className="text-gray-900 dark:text-gray-100">Access:</strong> Request access to your personal data</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Deletion:</strong> Request deletion of your personal data</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Restriction:</strong> Request restriction of processing of your data</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Objection:</strong> Object to processing of your data for certain purposes</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 rounded-xl p-5 sm:p-6 space-y-3">
              <p><strong className="text-gray-900 dark:text-gray-100">Email:</strong> <a href="mailto:privacy@anvistride.app" className="text-purple-600 dark:text-purple-400 hover:underline">privacy@anvistride.app</a></p>
              <p><strong className="text-gray-900 dark:text-gray-100">Address:</strong> Anvistride Privacy Team, 123 Innovation Drive, Tech City, TC 12345</p>
              <p><strong className="text-gray-900 dark:text-gray-100">Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>

        </div>
      </div>
    </div>
  );
}


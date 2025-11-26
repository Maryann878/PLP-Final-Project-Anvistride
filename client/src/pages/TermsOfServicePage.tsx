import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FileText, Handshake, UserCheck, AlertTriangle, Gavel, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import NavbarMobile from "@/components/NavbarMobile";

export default function TermsOfServicePage() {
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
                <FileText className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent leading-tight">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">Last updated: January 2025</p>
          </div>

      {/* Content */}
      <div className="space-y-5 sm:space-y-6">
        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Handshake className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              These Terms of Service ("Terms") govern your use of the Anvistride application ("Service") operated by Anvistride ("us," "we," or "our"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p>
              If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
            <ul className="space-y-2.5 list-disc list-inside ml-4">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>
            <p>
              We reserve the right to terminate accounts that are inactive for an extended period or violate these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="space-y-2.5 list-disc list-inside ml-4">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Transmit or procure the sending of any advertising or promotional material without our prior written consent</li>
              <li>Impersonate or attempt to impersonate another person or entity</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>Use any automated system or software to extract data from the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service or related systems</li>
              <li>Upload or transmit any malicious code, viruses, or other harmful components</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Content and Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Your Content:</strong> You retain ownership of all content you create, upload, or store using our Service, including visions, goals, tasks, ideas, and notes. By using the Service, you grant us a limited, non-exclusive license to store, process, and display your content solely for the purpose of providing the Service.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Our Content:</strong> The Service and its original content, features, and functionality are owned by Anvistride and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Third-Party Content:</strong> The Service may contain content from third parties. We are not responsible for the accuracy, completeness, or reliability of such content.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              </div>
              Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Service "As Is":</strong> The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the Service's availability, accuracy, reliability, or suitability for your purposes.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">No Professional Advice:</strong> The Service is designed for personal productivity and goal management. It does not provide professional advice, and you should consult with qualified professionals for important decisions.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Gavel className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in the United States.
            </p>
          </CardContent>
        </Card>

        <Card className={`${glassClass} border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 flex items-center justify-center">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 rounded-xl p-5 sm:p-6 space-y-3">
              <p><strong className="text-gray-900 dark:text-gray-100">Email:</strong> <a href="mailto:legal@anvistride.app" className="text-purple-600 dark:text-purple-400 hover:underline">legal@anvistride.app</a></p>
              <p><strong className="text-gray-900 dark:text-gray-100">Address:</strong> Anvistride Legal Department, 123 Innovation Drive, Tech City, TC 12345</p>
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


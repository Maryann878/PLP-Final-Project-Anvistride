import { FileText, Handshake, UserCheck, AlertTriangle, Gavel, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <FileText className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-600">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Handshake className="h-5 w-5 text-purple-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              These Terms of Service ("Terms") govern your use of the Anvistride application ("Service") operated by Anvistride ("us," "we," or "our"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p>
              If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="h-5 w-5 text-purple-600" />
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
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

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="text-xl">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
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

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="text-xl">Content and Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Your Content:</strong> You retain ownership of all content you create, upload, or store using our Service, including visions, goals, tasks, ideas, and notes. By using the Service, you grant us a limited, non-exclusive license to store, process, and display your content solely for the purpose of providing the Service.
            </p>
            <p>
              <strong className="text-gray-900">Our Content:</strong> The Service and its original content, features, and functionality are owned by Anvistride and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              <strong className="text-gray-900">Third-Party Content:</strong> The Service may contain content from third parties. We are not responsible for the accuracy, completeness, or reliability of such content.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Service "As Is":</strong> The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the Service's availability, accuracy, reliability, or suitability for your purposes.
            </p>
            <p>
              <strong className="text-gray-900">No Professional Advice:</strong> The Service is designed for personal productivity and goal management. It does not provide professional advice, and you should consult with qualified professionals for important decisions.
            </p>
            <p>
              <strong className="text-gray-900">Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Gavel className="h-5 w-5 text-purple-600" />
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in the United States.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-purple-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <p><strong className="text-gray-900">Email:</strong> legal@anvistride.app</p>
              <p><strong className="text-gray-900">Address:</strong> Anvistride Legal Department, 123 Innovation Drive, Tech City, TC 12345</p>
              <p><strong className="text-gray-900">Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          © 2025 Anvistride by Annaura. All rights reserved.
        </p>
      </div>
    </div>
  );
}


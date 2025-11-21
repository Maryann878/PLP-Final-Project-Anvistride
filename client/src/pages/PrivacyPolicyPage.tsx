import { Shield, UserCheck, Lock, Eye, Database, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Shield className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-600">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              At Anvistride ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            <p>
              By using Anvistride, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our application.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Database className="h-5 w-5 text-purple-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li><strong>Account Information:</strong> Username, email address, and password</li>
              <li><strong>Profile Information:</strong> Name, profile picture, and other optional details you choose to provide</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our application</li>
              <li><strong>Device Information:</strong> Device type, operating system, and browser information</li>
            </ul>

            <h3 className="font-semibold text-gray-900 mt-6">Content Data</h3>
            <p>We store the content you create within Anvistride, including:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>Visions, goals, tasks, ideas, and notes</li>
              <li>Progress tracking data and completion status</li>
              <li>Custom settings and preferences</li>
              <li>Search queries and interaction patterns</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-5 w-5 text-purple-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>We use the collected information for the following purposes:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li><strong>Service Provision:</strong> To provide and maintain our application functionality</li>
              <li><strong>Account Management:</strong> To create and manage your user account</li>
              <li><strong>Personalization:</strong> To customize your experience and provide relevant features</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our services</li>
              <li><strong>Communication:</strong> To send important updates and notifications</li>
              <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-purple-600" />
              Data Storage and Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Local Storage:</strong> Your data is primarily stored locally on your device using browser storage mechanisms. This means your personal information and content remain on your device and are not transmitted to our servers unless you explicitly choose to sync or backup your data.
            </p>
            <p>
              <strong className="text-gray-900">Data Encryption:</strong> When data is transmitted or stored, we use industry-standard encryption protocols to protect your information.
            </p>
            <p>
              <strong className="text-gray-900">Access Controls:</strong> We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="text-xl">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>You have the following rights regarding your personal information:</p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing of your data</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </CardContent>
        </Card>

        <Card className={glassClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-purple-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <p><strong className="text-gray-900">Email:</strong> privacy@anvistride.app</p>
              <p><strong className="text-gray-900">Address:</strong> Anvistride Privacy Team, 123 Innovation Drive, Tech City, TC 12345</p>
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


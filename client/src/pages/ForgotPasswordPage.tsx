import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { forgotPassword } from "@/api/auth";
import { getGlobalToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      
      const toast = getGlobalToast();
      toast?.({
        title: "Email Sent",
        description: "If an account exists with this email, a password reset link has been sent.",
        variant: "default",
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to send reset instructions. Please try again.';
      setError(errorMessage);
      
      const toast = getGlobalToast();
      toast?.({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Focus email field on error for better UX
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/95 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  if (isSuccess) {
    return (
      <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
        {/* Background matching login/register */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/hero_img.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/download.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.1,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(106,13,173,0.35) 0%, rgba(124,58,237,0.25) 30%, rgba(26,188,156,0.20) 70%, rgba(99,102,241,0.10) 100%)",
            }}
          />
          <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-teal-200/15 blur-[140px]" />
        </div>
        
        <Card className={`${glassClass} w-full max-w-md relative z-10 rounded-2xl p-8 sm:p-10`}>
          <CardHeader className="text-center space-y-6 pb-8">
            <Link to="/" className="flex justify-center group">
              <img src="/Anvistride_logo.png" alt="Anvistride" className="w-20 h-20 rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer" />
            </Link>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-600 mt-2">We've sent password reset instructions to your email address</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">1.</span>
                  Check your email inbox (and spam folder)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">2.</span>
                  Click the reset link in the email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">3.</span>
                  Create a new password
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">4.</span>
                  Sign in with your new password
                </li>
              </ol>
              <p className="text-xs text-gray-600 mt-3 italic">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
            </div>

            <Link to="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">

      {/* Background matching login/register */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero_img.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/download.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(106,13,173,0.35) 0%, rgba(124,58,237,0.25) 30%, rgba(26,188,156,0.20) 70%, rgba(99,102,241,0.10) 100%)",
          }}
        />
        <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-teal-200/15 blur-[140px]" />
      </div>
      
      <Card className={`${glassClass} w-full max-w-md relative z-10 rounded-2xl p-8 sm:p-10`}>
        <CardHeader className="text-center space-y-6 pb-6 p-0">
          <div className="flex justify-center">
            <Link to="/" className="flex justify-center group">
              <img src="/Anvistride_logo.png" alt="Anvistride" className="h-20 w-auto rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer" />
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-base text-gray-600">No worries! Enter your email address and we'll send you reset instructions</p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div 
                id="forgot-password-error"
                role="alert" 
                aria-live="polite"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in fade-in-0"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="h-12 text-base pl-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                  autoFocus
                  aria-describedby={error ? "forgot-password-error" : undefined}
                  aria-invalid={!!error}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Send Reset Instructions
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


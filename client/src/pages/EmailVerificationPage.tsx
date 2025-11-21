import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, Loader2, Key, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getGlobalToast } from "@/lib/toast";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const userData = location.state as { email: string; username: string } | null;
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits.');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (/^\d+$/.test(verificationCode)) {
        setVerificationStatus('success');
        
        if (userData) {
          setTimeout(() => {
            navigate('/app');
          }, 2000);
        } else {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setVerificationStatus('error');
        setError('Please enter a valid 6-digit verification code.');
      }
    } catch {
      setVerificationStatus('error');
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendCooldown(60);
      const toast = getGlobalToast();
      toast?.({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
        variant: "success",
      });
    } catch {
      setError('Failed to send verification code. Please try again.');
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/95 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-teal-100/20"></div>
        
        <Card className={`${glassClass} w-full max-w-md relative z-10 rounded-2xl`}>
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <img src="/Anvistride_logo.png" alt="Anvistride" className="w-20 h-20 rounded-xl" />
            </div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Verified Successfully!</h1>
              <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Redirecting in 2 seconds...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-teal-100/20"></div>
      
      <Card className={`${glassClass} w-full max-w-md relative z-10 rounded-2xl`}>
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img src="/Anvistride_logo.png" alt="Anvistride" className="w-20 h-20 rounded-xl" />
          </div>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${verificationStatus === 'error' ? 'bg-red-100' : 'bg-purple-100'}`}>
            {isVerifying ? <Loader2 className="h-8 w-8 animate-spin text-purple-600" /> : <Mail className="h-8 w-8 text-purple-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit verification code to{' '}
              <span className="font-semibold text-purple-600">{userData?.email || 'your email address'}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="flex items-center gap-2">
                <Key className="h-4 w-4 text-purple-600" />
                Enter Verification Code
              </Label>
              <Input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className={`text-center text-2xl tracking-widest font-mono ${verificationStatus === 'error' ? 'border-red-500' : ''}`}
                maxLength={6}
                disabled={isVerifying}
                autoComplete="off"
                autoFocus
              />
              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Email
                </>
              )}
            </Button>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  onClick={handleResendCode}
                  variant="outline"
                  disabled={resendCooldown > 0}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </Button>
              </div>

              <div className="text-center">
                <Link to="/signup">
                  <Button variant="ghost" type="button" className="text-sm">
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Signup
                  </Button>
                </Link>
              </div>
            </div>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Need help? <Link to="/help" className="text-purple-600 hover:text-purple-700 font-semibold">Contact Support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


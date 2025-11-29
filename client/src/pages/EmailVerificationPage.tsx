import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, Loader2, Key, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getGlobalToast } from "@/lib/toast";
import { verifyEmail, resendVerificationEmail } from "@/api/auth";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const userData = location.state as { email: string; username: string } | null;
  const tokenFromUrl = searchParams.get('token');
  
  const [verificationToken, setVerificationToken] = useState(tokenFromUrl || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');

  // Auto-verify if token is in URL
  useEffect(() => {
    if (tokenFromUrl && !isVerifying && verificationStatus === 'pending') {
      const verify = async () => {
        setIsVerifying(true);
        setError('');
        
        try {
          const response = await verifyEmail({ token: tokenFromUrl });
          
          if (response.token && response.user) {
            await login(response.token);
            setVerificationStatus('success');
            
            const toast = getGlobalToast();
            toast?.({
              title: "Email Verified!",
              description: "Your email has been successfully verified.",
              variant: "success",
            });
            
            setTimeout(() => {
              navigate('/app');
            }, 2000);
          } else {
            setVerificationStatus('error');
            setError('Verification failed. Please check your token and try again.');
          }
        } catch (err: any) {
          setVerificationStatus('error');
          const errorMessage = err?.response?.data?.message || 'An error occurred during verification. Please try again.';
          setError(errorMessage);
        } finally {
          setIsVerifying(false);
        }
      };
      
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerificationSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!verificationToken.trim()) {
      setError('Please enter the verification token.');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      const response = await verifyEmail({ token: verificationToken });
      
      if (response.token && response.user) {
        await login(response.token);
        
        setVerificationStatus('success');
        
        const toast = getGlobalToast();
        toast?.({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
          variant: "success",
        });
        
        setTimeout(() => {
          navigate('/app');
        }, 2000);
      } else {
        setVerificationStatus('error');
        setError('Verification failed. Please check your token and try again.');
      }
    } catch (err: any) {
      setVerificationStatus('error');
      const errorMessage = err?.response?.data?.message || 'An error occurred during verification. Please try again.';
      setError(errorMessage);
      
      const toast = getGlobalToast();
      toast?.({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!userData?.email) {
      setError('Email address is required to resend verification email.');
      return;
    }

    try {
      setResendCooldown(60);
      setError('');
      
      await resendVerificationEmail({ email: userData.email });
      
      const toast = getGlobalToast();
      toast?.({
        title: "Email Sent",
        description: "A new verification email has been sent to your inbox.",
        variant: "success",
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to send verification email. Please try again.';
      setError(errorMessage);
      
      const toast = getGlobalToast();
      toast?.({
        title: "Failed to Send Email",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Success state
  if (verificationStatus === 'success') {
    return (
      <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
        {/* Background matching other auth pages */}
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

        <div className="relative z-10 w-full max-w-md animate-scale-in">
          <Card className="bg-white rounded-2xl shadow-2xl shadow-purple-500/10 border-2 border-purple-100/50 p-8 sm:p-10">
            <CardHeader className="p-0">
              <Link to="/" className="flex justify-center mb-8 group">
                <img
                  src="/Anvistride_logo.png"
                  alt="Anvistride Logo"
                  className="h-20 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
              </Link>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  Email Verified!
                </h1>
                <p className="text-base text-gray-600 leading-relaxed">
                  Your email has been successfully verified. Redirecting to dashboard...
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting in 2 seconds...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Background matching other auth pages */}
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

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Card className="bg-white rounded-2xl shadow-2xl shadow-purple-500/10 border-2 border-purple-100/50 p-8 sm:p-10">
          <CardHeader className="p-0">
            {/* Logo - Clickable to go to landing page */}
            <Link to="/" className="flex justify-center mb-8 group">
              <img
                src="/Anvistride_logo.png"
                alt="Anvistride Logo"
                className="h-20 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              />
            </Link>

            {/* Header */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${verificationStatus === 'error' ? 'bg-red-100' : 'bg-purple-100'}`}>
                {isVerifying ? <Loader2 className="h-8 w-8 animate-spin text-purple-600" /> : <Mail className="h-8 w-8 text-purple-600" />}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Verify Your Email
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                {tokenFromUrl 
                  ? 'Verifying your email address...' 
                  : `We've sent a verification link to ${userData?.email || 'your email address'}. Click the link in the email or enter the token below.`}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Form */}
            <form onSubmit={handleVerificationSubmit} className="space-y-5">
              {error && (
                <div 
                  id="verify-email-error"
                  role="alert" 
                  aria-live="polite"
                  className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in fade-in-0"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="verificationToken" className="text-sm font-semibold text-gray-700">
                  Verification Token
                </Label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    id="verificationToken"
                    value={verificationToken}
                    onChange={(e) => {
                      setVerificationToken(e.target.value.trim());
                      if (error) setError('');
                    }}
                    placeholder="Paste verification token from email"
                    className={`h-12 text-base pl-11 rounded-xl font-mono text-sm ${verificationStatus === 'error' ? 'border-red-500' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isVerifying || !!tokenFromUrl}
                    autoComplete="off"
                    autoFocus={!tokenFromUrl}
                    aria-describedby={error ? "verify-email-error" : undefined}
                    aria-invalid={!!error}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {tokenFromUrl 
                    ? 'Verifying automatically...' 
                    : 'Enter the verification token from your email, or click the link in the email'}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isVerifying || !verificationToken.trim() || !!tokenFromUrl}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>

              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the email?
                  </p>
                  <Button
                    type="button"
                    onClick={handleResendCode}
                    variant="outline"
                    disabled={resendCooldown > 0}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Remember your password?{' '}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Back to Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


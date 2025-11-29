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
        // Store token and update auth context
        localStorage.setItem('token', response.token);
        login(response.user);
        
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
              <Label htmlFor="verificationToken" className="flex items-center gap-2">
                <Key className="h-4 w-4 text-purple-600" />
                Enter Verification Token
              </Label>
              <Input
                type="text"
                id="verificationToken"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value.trim())}
                placeholder="Paste verification token from email"
                className={`text-center font-mono text-sm ${verificationStatus === 'error' ? 'border-red-500' : ''}`}
                disabled={isVerifying || !!tokenFromUrl}
                autoComplete="off"
                autoFocus={!tokenFromUrl}
              />
              <p className="text-xs text-gray-500 text-center">
                {tokenFromUrl 
                  ? 'Verifying automatically...' 
                  : 'Enter the verification token from your email, or click the link in the email'}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={isVerifying || !verificationToken.trim() || !!tokenFromUrl}
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


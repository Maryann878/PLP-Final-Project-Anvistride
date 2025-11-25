import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        setIsValidToken(false);
        return;
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsValidToken(true);
      } catch {
        setError('Invalid or expired reset token');
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch {
      setError('Failed to reset password. Please try again.');
      // Focus password field on error for better UX
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const glassClass = "backdrop-blur-xl bg-white/95 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  // Loading state
  if (isValidToken === null) {
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Validating Reset Link</h1>
              <p className="text-gray-600 mt-2">Please wait while we verify your reset link...</p>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token
  if (isValidToken === false) {
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
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h1>
              <p className="text-gray-600 mt-2">The password reset link is invalid or has expired</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div 
                id="reset-password-error"
                role="alert" 
                aria-live="polite"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-in fade-in-0"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button variant="outline" className="w-full">
                  Request a new reset link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
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
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Password Reset Successfully!</h1>
              <p className="text-gray-600 mt-2">Your password has been updated. You can now sign in with your new password.</p>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
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
          <Link to="/" className="flex justify-center group">
            <img src="/Anvistride_logo.png" alt="Anvistride" className="h-20 w-auto rounded-xl transition-transform duration-300 group-hover:scale-105 cursor-pointer" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-base text-gray-600">Enter a strong password to secure your account</p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="h-12 text-base pl-11 pr-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                  aria-describedby={error ? "reset-password-error" : undefined}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-red-500'}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs font-medium ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                  </p>
                </div>
              )}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                <ul className="space-y-1 text-xs">
                  <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                    <CheckCircle className={`h-3 w-3 ${formData.password.length >= 8 ? '' : 'opacity-30'}`} />
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                    <CheckCircle className={`h-3 w-3 ${/(?=.*[a-z])/.test(formData.password) ? '' : 'opacity-30'}`} />
                    One lowercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                    <CheckCircle className={`h-3 w-3 ${/(?=.*[A-Z])/.test(formData.password) ? '' : 'opacity-30'}`} />
                    One uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}`}>
                    <CheckCircle className={`h-3 w-3 ${/(?=.*\d)/.test(formData.password) ? '' : 'opacity-30'}`} />
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={confirmPasswordInputRef}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className="h-12 text-base pl-11 pr-11 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                  aria-describedby={error ? "reset-password-error" : undefined}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
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


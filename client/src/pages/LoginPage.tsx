import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginUser } from "@/api/auth";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { getGlobalToast } from "@/lib/toast";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Load saved email if remember me was previously checked
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("anvistride_rememberedEmail");
    const rememberMePreference = localStorage.getItem("anvistride_rememberMe") === "true";
    
    if (rememberMePreference && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    
    // Focus email input after a short delay to allow state to update
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  }, []);

  // Email validation
  const isValidEmail = (email: string) => {
    if (!email) return true; // Don't show error when empty
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const isFormValid = email.trim().length > 0 && isValidEmail(email) && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if form is invalid
    if (!isFormValid) {
      const toast = getGlobalToast();
      if (toast) {
        toast({
          title: "Please fix form errors",
          description: "Ensure email and password are valid before submitting.",
          variant: "destructive",
        });
      }
      return;
    }

    // Handle remember me functionality
    if (rememberMe) {
      localStorage.setItem("anvistride_rememberedEmail", email);
      localStorage.setItem("anvistride_rememberMe", "true");
    } else {
      localStorage.removeItem("anvistride_rememberedEmail");
      localStorage.removeItem("anvistride_rememberMe");
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      console.log("Sending login request with:", { email, password });

      // localStorage.setItem("token", data.token); // Moved to AuthContext
      await login(data.token); // Call the login function from AuthContext
      const toast = getGlobalToast(); // Get the global toast instance
      if (toast) {
        toast({
          title: "Login successful",
          variant: "success",
        });
      }
      // Don't clear email if remember me is checked
      if (!rememberMe) {
        setEmail("");
      }
      setPassword(""); // Always clear password on successful login
      navigate("/app"); // redirect after login
    } catch (error: any) {
      console.error(error);
      // The Axios interceptor will now handle the toast for errors.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/90 backdrop-blur-md hover:bg-white border border-gray-200/60 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-gray-900 group"
        aria-label="Go to home"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="text-xs sm:text-sm font-medium">Home</span>
      </Link>

      {/* Background matching Forgot Password Page */}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-base text-gray-600">
                Log in to your account
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 pl-11 rounded-xl bg-white ${
                    email && !isValidEmail(email) ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
              </div>
              {email && !isValidEmail(email) && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Please enter a valid email address</span>
                </div>
              )}
              {email && isValidEmail(email) && (
                <div className="flex items-center gap-1.5 text-xs text-green-600 mt-1">
                  <Check className="h-3 w-3" />
                  <span>Email looks good!</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 pl-11 pr-11 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-purple-600 transition-colors duration-200 p-1 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 hover:from-purple-700 hover:via-purple-600 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-200 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/80 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-medium text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg shadow-sm hover:shadow"
            >
              <svg className="mr-2.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700">Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-medium text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg shadow-sm hover:shadow"
            >
              <svg className="mr-2.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="#181717">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-gray-700">Continue with GitHub</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-10 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-medium text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg shadow-sm hover:shadow"
            >
              <svg className="mr-2.5 h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="#F25022">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
              </svg>
              <span className="text-gray-700">Continue with Microsoft</span>
            </Button>
          </div>

          {/* Sign up link */}
          <p className="mt-5 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

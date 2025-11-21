import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Clock, ArrowLeft, Bell, Settings, Hammer, Wrench, User, Mail, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGlobalToast } from "@/lib/toast";

const ComingSoonPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [socialHandle, setSocialHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get page name from path
  const getPageName = (path: string): string => {
    const pathSegments = path.split("/").filter(Boolean);
    const pageName = pathSegments[pathSegments.length - 1];

    // Handle social media pages
    if (path.includes("/social/")) {
      const socialPlatform = pageName;
      const socialNames: { [key: string]: string } = {
        twitter: "Twitter",
        linkedin: "LinkedIn",
        instagram: "Instagram",
        youtube: "YouTube",
        facebook: "Facebook",
        email: "Email",
      };
      return socialNames[socialPlatform] || "Social Media";
    }

    // Handle specific pages
    const pageNames: { [key: string]: string } = {
      demo: "Demo",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      payment: "Payment",
      contact: "Contact",
      about: "About",
    };

    return pageNames[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");
  };

  const pageName = getPageName(currentPath);

  // Check if this is a social media page
  const isSocialMediaPage = currentPath.includes("/social/");
  const socialPlatform = isSocialMediaPage ? currentPath.split("/").pop() : "";

  // Get platform-specific input placeholder and label
  const getSocialInputInfo = (platform: string) => {
    switch (platform) {
      case "twitter":
        return {
          placeholder: "@your_twitter_handle",
          label: "Twitter Handle",
          icon: <Hash className="h-4 w-4" />,
        };
      case "linkedin":
        return {
          placeholder: "your-linkedin-profile",
          label: "LinkedIn Profile",
          icon: <User className="h-4 w-4" />,
        };
      case "instagram":
        return {
          placeholder: "@your_instagram_handle",
          label: "Instagram Handle",
          icon: <Hash className="h-4 w-4" />,
        };
      case "youtube":
        return {
          placeholder: "your-youtube-channel",
          label: "YouTube Channel",
          icon: <User className="h-4 w-4" />,
        };
      case "facebook":
        return {
          placeholder: "your-facebook-profile",
          label: "Facebook Profile",
          icon: <User className="h-4 w-4" />,
        };
      case "email":
        return {
          placeholder: "your-email@example.com",
          label: "Email Address",
          icon: <Mail className="h-4 w-4" />,
        };
      default:
        return {
          placeholder: "your-handle",
          label: "Social Handle",
          icon: <User className="h-4 w-4" />,
        };
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialHandle.trim()) {
      const toast = getGlobalToast();
      if (toast) {
        toast({
          title: "Error",
          description: "Please enter your social media handle",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const toast = getGlobalToast();
      if (toast) {
        toast({
          title: "Handle Submitted!",
          description: `We'll notify you when we launch our ${pageName} page!`,
        });
      }
      setSocialHandle("");
      setIsSubmitting(false);
    }, 1000);
  };

  // Determine icon based on path
  const getIcon = () => {
    if (currentPath.includes("/social/")) {
      return <Settings className="h-16 w-16" />;
    } else if (currentPath.includes("/demo")) {
      return <Wrench className="h-16 w-16" />;
    } else if (currentPath.includes("/payment")) {
      return <Wrench className="h-16 w-16" />;
    } else {
      return <Hammer className="h-16 w-16" />;
    }
  };

  // Determine back button destination
  const getBackPath = () => {
    if (
      currentPath.includes("/demo") ||
      currentPath.includes("/payment") ||
      currentPath.includes("/contact") ||
      currentPath.includes("/social/") ||
      currentPath.includes("/privacy") ||
      currentPath.includes("/terms")
    ) {
      return "/";
    } else {
      return "/app";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-600 via-purple-500 to-teal-400 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl p-8 md:p-12">
          <div className="relative z-10">
            {/* Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-400 text-white shadow-lg mb-8">
              {getIcon()}
            </div>

            {/* Title - Platform name in purple, "Coming Soon" in teal */}
            <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {isSocialMediaPage ? (
                <>
                  <span className="text-purple-600">{pageName}</span>{" "}
                  <span className="text-teal-500">Coming Soon</span>
                </>
              ) : (
                <>
                  <span className="text-gray-900">{pageName}</span>{" "}
                  <span className="text-teal-500">Coming Soon</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-center text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
              {isSocialMediaPage
                ? `We're setting up our ${pageName} presence. Drop your handle below and we'll notify you when we launch!`
                : "We're working hard to bring you this feature. Stay tuned for updates!"}
            </p>

            {/* Social Media Input Form */}
            {isSocialMediaPage && (
              <div className="mb-8">
                <form onSubmit={handleSocialSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="social-handle" className="flex items-center gap-2 text-gray-800 font-semibold text-base">
                      <span className="text-purple-600 font-bold">@</span>
                      {getSocialInputInfo(socialPlatform || "").label}
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        id="social-handle"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        placeholder={getSocialInputInfo(socialPlatform || "").placeholder}
                        disabled={isSubmitting}
                        className="flex-1 h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting || !socialHandle.trim()}
                        className="bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-700 hover:to-teal-500 text-white h-12 px-8 font-semibold shadow-lg rounded-lg"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Status Badges - at bottom of card */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-400 text-white shadow-md">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">In Development</span>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 via-purple-400 to-teal-400 text-white shadow-md">
                  <Bell className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">Notifications Enabled</span>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg"
                asChild
              >
                <Link to={getBackPath()} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {getBackPath() === "/" ? "Back to Home" : "Back to Dashboard"}
                </Link>
              </Button>
            </div>

            {/* Footer message */}
            {isSocialMediaPage && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Want to be notified when this feature is ready? Drop your handle above!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;


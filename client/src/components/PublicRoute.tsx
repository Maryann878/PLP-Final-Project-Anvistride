// client/src/components/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./Spinner";

/**
 * PublicRoute - Redirects authenticated users away from public pages (like login/register)
 * Use this for pages that should only be accessible when NOT logged in
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
        <div className="flex flex-col items-center gap-5 animate-fade-in">
          <Spinner size="md" />
          <p className="text-sm text-purple-600 font-semibold animate-pulse-slow">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to app
  return user ? <Navigate to="/app" replace /> : <>{children}</>;
};

export default PublicRoute;


import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import PageLoader from "@/components/PageLoader";
import RootLayout from "@/components/RootLayout";

// Lazy load pages for code splitting
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const EmailVerificationPage = lazy(() => import("@/pages/EmailVerificationPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const VisionPage = lazy(() => import("@/pages/VisionPage"));
const GoalsPage = lazy(() => import("@/pages/GoalsPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const IdeasPage = lazy(() => import("@/pages/IdeasPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));
const JournalPage = lazy(() => import("@/pages/JournalPage"));
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const RecycleBinPage = lazy(() => import("@/pages/RecycleBinPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const ComingSoonPage = lazy(() => import("@/pages/ComingSoonPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));

// Wrapper component for Suspense
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        path: "/",
        element: (
          <LazyWrapper>
            <LandingPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
  {
    path: "/login",
    element: (
      <LazyWrapper>
        <LoginPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <LazyWrapper>
        <RegisterPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <LazyWrapper>
        <ForgotPasswordPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <LazyWrapper>
        <ResetPasswordPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/verify-email",
    element: (
      <LazyWrapper>
        <EmailVerificationPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/terms-of-service",
    element: (
      <LazyWrapper>
        <TermsOfServicePage />
      </LazyWrapper>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <LazyWrapper>
        <PrivacyPolicyPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/terms",
    element: (
      <LazyWrapper>
        <TermsOfServicePage />
      </LazyWrapper>
    ), // Alias
  },
  {
    path: "/privacy",
    element: (
      <LazyWrapper>
        <PrivacyPolicyPage />
      </LazyWrapper>
    ), // Alias
  },
  {
    path: "/contact",
    element: (
      <LazyWrapper>
        <ContactPage />
      </LazyWrapper>
    ),
    errorElement: (
      <LazyWrapper>
        <ErrorPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/about",
    element: (
      <LazyWrapper>
        <AboutPage />
      </LazyWrapper>
    ),
    errorElement: (
      <LazyWrapper>
        <ErrorPage />
      </LazyWrapper>
    ),
  },
  
  // Protected Routes - App
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <LazyWrapper>
        <ErrorPage />
      </LazyWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <DashboardPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "vision",
        element: (
          <LazyWrapper>
            <VisionPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "goals",
        element: (
          <LazyWrapper>
            <GoalsPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "tasks",
        element: (
          <LazyWrapper>
            <TasksPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "ideas",
        element: (
          <LazyWrapper>
            <IdeasPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "notes",
        element: (
          <LazyWrapper>
            <NotesPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "journal",
        element: (
          <LazyWrapper>
            <JournalPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "achievements",
        element: (
          <LazyWrapper>
            <AchievementsPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "chat",
        element: (
          <LazyWrapper>
            <ChatPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "analytics",
        element: (
          <LazyWrapper>
            <AnalyticsPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <LazyWrapper>
            <ProfilePage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <LazyWrapper>
            <SettingsPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "help",
        element: (
          <LazyWrapper>
            <HelpPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "recycle-bin",
        element: (
          <LazyWrapper>
            <RecycleBinPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
      {
        path: "notifications",
        element: (
          <LazyWrapper>
            <NotificationsPage />
          </LazyWrapper>
        ),
        errorElement: (
          <LazyWrapper>
            <ErrorPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <OnboardingPage />
        </LazyWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <LazyWrapper>
        <ErrorPage />
      </LazyWrapper>
    ),
  },
  
  // Coming Soon / Placeholder Routes
  {
    path: "/demo",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/upgrade",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/social/twitter",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/social/linkedin",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/social/instagram",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/social/facebook",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/social/email",
    element: (
      <LazyWrapper>
        <ComingSoonPage />
      </LazyWrapper>
    ),
  },
    ],
  },
]);

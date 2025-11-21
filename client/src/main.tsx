import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext"; // <- import AppProvider
import { NotificationProvider } from "@/context/NotificationContext"; // <- import NotificationProvider
import { ThemeProvider } from "@/context/ThemeContext";
import { SocketProvider } from "@/context/SocketContext";
import { ActivityProvider } from "@/context/ActivityContext";
import { ChatProvider } from "@/context/ChatContext";
import { Toaster } from "@/components/ui/toast"; // <- Import Toaster
import { useToast } from "@/components/ui/use-toast"; // <- Import useToast
import { setGlobalToast } from "@/lib/toast"; // <- Import setGlobalToast
import ErrorBoundary from "@/components/ErrorBoundary";
import SocketStatus from "@/components/SocketStatus";
import "./index.css";

function MainWrapper() {
  const { toast } = useToast();

  useEffect(() => {
    setGlobalToast(toast);
  }, [toast]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ChatProvider>
              <ActivityProvider>
                <AppProvider>
                  <NotificationProvider>
                  <MainWrapper /> {/* Use MainWrapper to provide toast context */}
                  <Toaster /> {/* <- Add Toaster here */}
                  <SocketStatus /> {/* Socket connection status indicator */}
                </NotificationProvider>
              </AppProvider>
            </ActivityProvider>
            </ChatProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

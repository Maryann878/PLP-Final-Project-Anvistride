import axios from "axios";
import { getGlobalToast } from "@/lib/toast"; // Import getGlobalToast

// Helper function to normalize API base URL
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return "http://localhost:5000/api";
  }
  
  // If URL doesn't start with http:// or https://, add https://
  let baseURL = envUrl.trim();
  if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
    baseURL = `https://${baseURL}`;
  }
  
  // Ensure it ends with /api
  if (!baseURL.endsWith('/api')) {
    baseURL = baseURL.endsWith('/') ? `${baseURL}api` : `${baseURL}/api`;
  }
  
  return baseURL;
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds timeout
});

// Automatically attach token if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiUrl = getApiBaseUrl();
    const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
    
    const hasToken = !!localStorage.getItem("token");
    
    // Pages with inline error display (don't show toast here - inline errors are better)
    const pagesWithInlineErrors = ['/login', '/register', '/forgot-password', '/reset-password'];
    const hasInlineErrorDisplay = pagesWithInlineErrors.some(path => window.location.pathname === path);
    
    // Public pages where we DON'T want to show errors
    const publicPaths = ['/', '/about', '/contact', '/terms', '/privacy'];
    const isPublicPage = publicPaths.some(path => window.location.pathname === path);
    
    // Suppress CORS errors
    const isCorsError = error.code === 'ERR_NETWORK' || 
                       error.message?.includes('CORS') || 
                       error.message?.includes('blocked') ||
                       (!error.response && error.code !== 'ECONNABORTED'); // Timeout errors should be shown
    
    // Show toast errors on protected pages (not on login/register where we have inline errors)
    const shouldShowError = !isLocalhost && 
                           !isCorsError && 
                           !hasInlineErrorDisplay && // Don't show toast if page has inline errors
                           (!isPublicPage && hasToken);
    
    const toast = getGlobalToast();
    if (toast && shouldShowError && error.response) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
      // Show user-friendly messages
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (error.code === 'ECONNABORTED') {
        toast({
          title: "Request Timeout",
          description: "The request took too long. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default API;

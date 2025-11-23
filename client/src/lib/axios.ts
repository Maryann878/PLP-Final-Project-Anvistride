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
    // Skip error handling if API URL is localhost (development only, backend not available)
    const apiUrl = getApiBaseUrl();
    const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
    
    // Check if user has a token (might be expired/invalid)
    const hasToken = !!localStorage.getItem("token");
    
    // Don't show toast for 401 errors on public pages or when no token exists
    const publicPaths = ['/login', '/register', '/', '/about', '/contact', '/terms', '/privacy'];
    const isPublicPage = publicPaths.some(path => window.location.pathname === path);
    
    // Suppress errors if:
    // - CORS error (ERR_NETWORK or CORS in message)
    // - 401 on public page or when no token
    // - Network errors when not authenticated
    const isCorsError = error.code === 'ERR_NETWORK' || 
                       error.message?.includes('CORS') || 
                       error.message?.includes('blocked') ||
                       !error.response; // No response usually means CORS or network error
    
    const isUnauthenticated401 = error.response?.status === 401 && (!hasToken || isPublicPage);
    const shouldSuppress = isCorsError || isUnauthenticated401 || (isPublicPage && !hasToken);
    
    // Only show error toast if:
    // 1. Not using localhost (production with configured API), AND
    // 2. Not a suppressed error, AND
    // 3. (Not a 401 error OR it's a 401 on a protected page with a token)
    const shouldShowError = !isLocalhost && !shouldSuppress && (error.response?.status !== 401 || !isPublicPage);
    
    const toast = getGlobalToast();
    if (toast && shouldShowError) {
      // For 401 errors on protected pages, show a more specific message
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error!",
          description: error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default API;

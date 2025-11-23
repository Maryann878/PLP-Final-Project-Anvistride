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
    
    // Don't show toast for 401 errors on public pages (login, register, landing, about, contact)
    const publicPaths = ['/login', '/register', '/', '/about', '/contact', '/terms', '/privacy'];
    const isPublicPage = publicPaths.some(path => window.location.pathname === path);
    
    // Only show error toast if:
    // 1. Not using localhost (production with configured API), AND
    // 2. (Not a 401 error OR it's a 401 on a protected page)
    const shouldShowError = !isLocalhost && (error.response?.status !== 401 || !isPublicPage);
    
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

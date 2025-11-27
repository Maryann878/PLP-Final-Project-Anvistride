import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that scrolls to the top of the page
 * whenever the route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure the page has rendered
    const timer = setTimeout(() => {
      // Scroll to top when pathname changes
      // Use instant scroll for better UX (no animation delay)
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      
      // For mobile browsers and better compatibility
      if (document.body) {
        document.body.scrollTo(0, 0);
      }

      // Also try scrolling any scrollable containers
      const scrollableElements = document.querySelectorAll('[data-scroll-container]');
      scrollableElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.scrollTo(0, 0);
        }
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


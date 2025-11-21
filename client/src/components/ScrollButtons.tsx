import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ScrollButtonsProps {
  containerRef?: React.RefObject<HTMLElement>;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

const ScrollButtons = ({ 
  containerRef, 
  showOnMobile = true, 
  showOnDesktop = true 
}: ScrollButtonsProps = {}) => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = containerRef?.current || window;
      const scrollTop = containerRef?.current 
        ? containerRef.current.scrollTop 
        : window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = containerRef?.current 
        ? containerRef.current.scrollHeight 
        : document.documentElement.scrollHeight;
      const clientHeight = containerRef?.current 
        ? containerRef.current.clientHeight 
        : document.documentElement.clientHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      // Show top button when scrolled down more than 300px
      setShowTop(scrollTop > 300);
      // Show bottom button when not at bottom (more than 100px from bottom)
      setShowBottom(scrollBottom > 100);
    };

    const scrollElement = containerRef?.current || window;
    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ 
        top: containerRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    } else {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: "smooth" 
      });
    }
  };

  const mobileClass = showOnMobile ? "md:hidden" : "hidden";
  const desktopClass = showOnDesktop ? "hidden md:flex" : "hidden";

  return (
    <>
      {/* Mobile - Fixed bottom right, above bottom bar */}
      <div className={`fixed bottom-24 right-4 z-40 flex flex-col gap-3 ${mobileClass}`}>
        {showTop && (
          <button
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white shadow-2xl shadow-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/60 active:scale-95 ring-2 ring-white/20"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
        {showBottom && (
          <button
            onClick={scrollToBottom}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white shadow-2xl shadow-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/60 active:scale-95 ring-2 ring-white/20"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Desktop - Fixed bottom right */}
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 ${desktopClass}`}>
        {showTop && (
          <button
            onClick={scrollToTop}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white shadow-2xl shadow-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/60 active:scale-95 ring-2 ring-white/20 backdrop-blur-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}
        {showBottom && (
          <button
            onClick={scrollToBottom}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white shadow-2xl shadow-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/60 active:scale-95 ring-2 ring-white/20 backdrop-blur-sm"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  );
};

export default ScrollButtons;


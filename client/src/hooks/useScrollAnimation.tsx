import { useEffect } from "react";

export default function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains("scroll-animate-left")) {
              entry.target.classList.add("animate-slide-in-left");
            } else if (entry.target.classList.contains("scroll-animate-right")) {
              entry.target.classList.add("animate-slide-in-right");
            } else {
              entry.target.classList.add("animate-fade-in");
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

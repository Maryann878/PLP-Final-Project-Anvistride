import { useEffect } from "react";

export default function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
    );

    const reveal = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible = rect.top < window.innerHeight - 100;

        if (visible) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", reveal);
    reveal();

    return () => window.removeEventListener("scroll", reveal);
  }, []);
}

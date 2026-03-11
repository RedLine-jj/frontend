import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    // 300px 이상 스크롤되면 버튼 표시
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="icon"
            className="rounded-full h-11 w-11 shadow-lg"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
            <span className="sr-only">맨 위로 이동</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

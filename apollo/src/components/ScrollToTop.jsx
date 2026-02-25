import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll main window
    window.scrollTo(0, 0);

    // Scroll admin layout container (if exists)
    const adminContent = document.querySelector(".admin-content");
    if (adminContent) {
      adminContent.scrollTo(0, 0);
    }

  }, [pathname]);

  return null;
}
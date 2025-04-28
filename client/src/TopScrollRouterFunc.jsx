import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { projectsRoutes } from "./components/Projects/index.js";

/** Utillity Component for Overriding the React Router Default Page
 * Location (Changes Default to the top of the page)
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    
    requestAnimationFrame(() => {
      // The actual scroll feature (set to 80px from the actual top of the pg)
      window.scrollTo({ top: 80, left: 0, behavior: "smooth" });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

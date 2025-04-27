import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Utillity Component for Overriding the React Router Default Page  
 * Location (Changes Default to the top of the page)
*/
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
        // Delay the scroll to ensure the new component has mounted
        requestAnimationFrame(() => {
          window.scrollTo({ top: 1, left: 0, behavior: "smooth" });
        });
      }, [pathname]);

  return null;
};

export default ScrollToTop;
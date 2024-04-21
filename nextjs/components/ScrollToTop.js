"use client";
import { useEffect } from "react";

const ScrollToTopOnMount = () => {
  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return null; // This component doesn't render anything, it just triggers the scroll effect
};

export default ScrollToTopOnMount;

import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

/**
 * RootLayout component that wraps all routes and includes ScrollToTop
 * to ensure pages scroll to top on navigation
 */
const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default RootLayout;


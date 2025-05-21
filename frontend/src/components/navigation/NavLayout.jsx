/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const NavLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Close sidebar when changing routes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile unless toggled, and toggleable on desktop */}
        <AnimatePresence mode="wait">
          {(sidebarOpen || (!isMobile && sidebarOpen !== false)) && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`${
                isMobile ? "fixed inset-y-0 left-0 z-50" : "sticky top-0 h-screen"
              }`}
            >
              <Sidebar isLoggedIn={!!user} setSidebarOpen={setSidebarOpen} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Desktop Navbar */}
          {!isMobile && (
            <Navbar
              isLoggedIn={!!user}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          {/* Page Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default NavLayout;

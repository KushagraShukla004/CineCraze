/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Logo } from "../ui/logo";

const Navbar = ({ isLoggedIn, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 mx-auto my-2 max-w-7xl">
        {/* Left Side - Toggle Button & Logo */}
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="p-1 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 hidden md:flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </motion.button>
              <Logo className="hidden md:flex" />
            </>
          )}
        </div>

        {/* Right Side - Theme & User */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {isLoggedIn && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AV
                </AvatarFallback>
              </Avatar>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

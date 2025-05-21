/* eslint-disable no-unused-vars */
import { useTheme } from "./theme-provider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Shell, Sun, Moon, SwatchBook, Crown } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    {
      value: "light",
      label: "Soft Pastel",
      icon: <Sun className="h-4 w-4" />,
      colors: {
        primary: "#6246ea",
        secondary: "#e45858",
        background: "#f8f9fc",
        text: "#1c1c28",
      },
    },
    {
      value: "dark",
      label: "Vibrant Neon",
      icon: <Moon className="h-4 w-4" />,
      colors: {
        primary: "#7f5af0",
        secondary: "#2cb67d",
        background: "#0f0f1a",
        text: "#f0f0ff",
      },
    },
    {
      value: "royal",
      label: "Cosmic Royal",
      icon: <Crown className="h-4 w-4" />,
      colors: {
        primary: "#9d4edd",
        secondary: "#c77dff",
        background: "#10002b",
        text: "#e0e0ff",
      },
    },
    {
      value: "emerald",
      label: "Ocean Breeze",
      icon: <Shell className="h-4 w-4" />,
      colors: {
        primary: "#00b4d8",
        secondary: "#f0c808",
        background: "#004e64",
        text: "#f0f4f8",
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-primary/50 transition-colors"
        aria-label="Select theme"
      >
        <SwatchBook className="h-5 w-5 text-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute right-0 mt-2 w-64 p-3 rounded-lg bg-card/80 backdrop-blur-md shadow-lg z-50 border-muted"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <SwatchBook className="h-4 w-4" />
                <span>Select Theme</span>
              </div>

              {themeOptions.map((option) => (
                <ThemeOption
                  key={option.value}
                  option={option}
                  isSelected={theme === option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeOption({ option, isSelected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-2 rounded-md transition-colors",
        isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
      )}
    >
      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden border border-border">
        <div className="h-full w-full grid grid-cols-2 grid-rows-2">
          <div style={{ backgroundColor: option.colors.primary }} />
          <div style={{ backgroundColor: option.colors.secondary }} />
          <div style={{ backgroundColor: option.colors.background }} />
          <div style={{ backgroundColor: option.colors.text }} />
        </div>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{option.label}</span>
        <span className="text-xs text-muted-fg">
          {isSelected ? "Active" : "Click to activate"}
        </span>
      </div>

      {option.icon && <div className="ml-auto">{option.icon}</div>}

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto h-2 w-2 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
}

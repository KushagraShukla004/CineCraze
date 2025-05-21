/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Logo } from "../ui/logo";

const MobileNav = ({ sidebarOpen, setSidebarOpen}) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </Button>

          {!isSearching && <Logo />}
        </div>

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.form
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              className="absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-background px-4"
              onSubmit={handleSearchSubmit}
            >
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setIsSearching(false)}
              >
                <X size={24} />
              </Button>
            </motion.form>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearching(true)}
                aria-label="Search"
              >
                <Search size={24} />
              </Button>

              <ThemeSwitcher />
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default MobileNav;

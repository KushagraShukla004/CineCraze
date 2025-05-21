/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, ChevronRight } from "lucide-react";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDebounce } from "@/hooks/use-debounce";
import { Logo } from "../ui/logo";

const Navbar = ({ isLoggedIn, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Extracting search query from URL on initial load when we search a movie and then navigate to another page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Update URL when search query changes 
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
      navigate(`/movies?search=${encodeURIComponent(debouncedSearchQuery)}`, {
        replace: true,
      });
    }
  }, [debouncedSearchQuery, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    navigate("/movies");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
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

        {/* Search Bar */}
        <div className="flex-1 ml-4">
          {isSearching ? (
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="text-muted-foreground"
              onClick={() => setIsSearching(true)}
            >
              <Search size={16} className="mr-2" />
              <span>Search movies...</span>
            </Button>
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

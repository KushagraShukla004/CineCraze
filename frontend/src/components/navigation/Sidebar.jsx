/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Film,
  Heart,
  LogIn,
  UserPlus,
  LogOut,
  Flame,
  ChevronLeft,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "../ui/logo";

const Sidebar = ({ isLoggedIn, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card relative">
      {/* Mobile close button (X) */}
      <button
        onClick={() => setSidebarOpen?.(false)}
        className="absolute right-2 top-4 p-2 rounded-full hover:bg-accent block md:hidden"
      >
        <X size={20} />
      </button>
      {/* Desktop close button (<) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(false)}
        className="p-1 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 absolute right-2 top-4 hidden md:block"
      >
        <ChevronLeft size={18} />
      </motion.button>
      {/* Logo */}
      <div className="flex h-16 items-center px-4">
        <Logo />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors 
            ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          <Home size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors 
            ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          <Film size={18} />
          <span>Movies</span>
        </NavLink>

        <NavLink
          to="/movies?filter=trending"
          className={({ isActive, isPending }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors 
            ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          <Flame size={18} />
          <span>Trending</span>
        </NavLink>

        {isLoggedIn && (
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors 
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`
            }
          >
            <Heart size={18} />
            <span>Favorites</span>
          </NavLink>
        )}
      </nav>

      {/* Auth Links */}
      <div className="border-t p-4">
        {isLoggedIn ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="sidebar-link w-full justify-start text-red-400 hover:bg-destructive/50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        ) : (
          <div className="space-y-1">
            <NavLink
              to="/auth"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>

            <NavLink
              to="/auth?tab=register"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <UserPlus size={18} />
              <span>Register</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <motion.div
        whileHover={{ rotate: 10, scale: 1.05 }}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg"
      >
        <Film className="h-5 w-5 text-primary-foreground" />
      </motion.div>
      <span className="text-xl font-heading font-bold tracking-tight">
        Cine<span className="text-primary">Craze</span>
      </span>
    </Link>
  );
}

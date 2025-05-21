/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <motion.div
        whileHover={{ rotate: 10 }}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-primary"
      >
        <Film className="h-5 w-5 text-primary-foreground" />
      </motion.div>
      <span className="text-xl font-bold tracking-tight">
        Cine<span className="text-primary">Craze</span>
      </span>
    </Link>
  );
}

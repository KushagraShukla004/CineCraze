/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Film } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="flex flex-col items-center"
      >
        <Film className="mb-4 h-16 w-16 text-primary" />
        <h2 className="text-xl font-bold">Loading...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

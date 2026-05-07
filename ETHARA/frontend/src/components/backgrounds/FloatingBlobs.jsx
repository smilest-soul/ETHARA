import React from 'react';
import { motion } from 'framer-motion';

const FloatingBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Blob */}
      <motion.div
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]"
      />
      
      {/* Bottom Right Blob */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"
      />

      {/* Center ambient Blob */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
        className="absolute top-[30%] left-[40%] w-[20%] h-[30%] rounded-full bg-purple-500/5 blur-[100px]"
      />
    </div>
  );
};

export default FloatingBlobs;

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Fading Mask so it disappears smoothly at the edges */}
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)] z-10" />
      
      {/* Static Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-foreground) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Animated Highlight Line (Horizontal) */}
      <motion.div
        animate={{
          y: [0, 800, 0],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        style={{ top: '0px' }}
      />
      
      {/* Animated Highlight Line (Vertical) */}
      <motion.div
        animate={{
          x: [0, 1200, 0],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
        style={{ left: '0px' }}
      />
    </div>
  );
};

export default AnimatedGrid;

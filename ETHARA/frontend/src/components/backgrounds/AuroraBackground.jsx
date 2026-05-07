import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-950">
      {/* Deep base layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950"></div>
      
      {/* Aurora glow 1 */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 40%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Aurora glow 2 */}
      <motion.div
        animate={{
          backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute -top-[30%] -right-[50%] w-[200%] h-[200%] opacity-20 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 40%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Stars/Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default AuroraBackground;

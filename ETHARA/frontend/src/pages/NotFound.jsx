import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import AnimatedGrid from '../components/backgrounds/AnimatedGrid';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <AnimatedGrid />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center p-8 max-w-md"
      >
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-8 ring-1 ring-destructive/20 shadow-lg shadow-destructive/10">
          <AlertTriangle size={40} className="text-destructive" />
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Check the URL or navigate back to the dashboard.
        </p>
        
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

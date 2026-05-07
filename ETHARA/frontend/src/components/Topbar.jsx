import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import GlobalSearchModal from './GlobalSearchModal';

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center">
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="relative w-full group cursor-pointer"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" size={18} />
            <div className="w-full bg-muted/50 border border-transparent group-hover:border-border hover:bg-muted rounded-full pl-10 pr-4 py-2 text-sm text-muted-foreground transition-all flex items-center justify-between">
              <span>Search projects, tasks...</span>
              <div className="flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded shadow-sm opacity-70">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded shadow-sm opacity-70">K</kbd>
              </div>
            </div>
          </div>
        </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
          <Bell size={20} />
        </button>
        
        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
        
        <button className="flex items-center gap-2 hover:bg-muted/50 p-1.5 rounded-full transition-colors pl-2">
          <div className="flex flex-col items-end hidden sm:flex mr-1">
            <span className="text-sm font-medium leading-none mb-1 text-foreground">{user?.name?.split(' ')[0]}</span>
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{user?.role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-background">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
        </button>
      </div>
      </header>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Topbar;

import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User, Layers, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      className="bg-card border-r border-border h-full flex flex-col justify-between shrink-0 relative z-50 transition-all duration-300 ease-in-out shadow-sm"
    >
      <div className="flex flex-col h-full">
        <div className={cn("p-6 flex items-center", isCollapsed ? "justify-center px-0" : "justify-between")}>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-tr from-primary to-blue-400 p-1.5 rounded-lg shadow-sm">
                <Layers size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">ETHARA</h2>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="bg-gradient-to-tr from-primary to-blue-400 p-2 rounded-xl shadow-sm">
              <Layers size={24} className="text-white" />
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted absolute -right-3 top-7 bg-card border border-border shadow-sm z-50 hidden md:block"
          >
            <Menu size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden text-sm"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 w-full py-2.5 rounded-xl transition-colors duration-200 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group relative",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

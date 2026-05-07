import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AnimatedGrid from './backgrounds/AnimatedGrid';
import FloatingBlobs from './backgrounds/FloatingBlobs';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AnimatedGrid />
        <FloatingBlobs />

        
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 z-10 relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

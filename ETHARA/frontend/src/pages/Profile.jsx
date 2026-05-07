import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and security settings</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        {/* Header Card */}
        <motion.div variants={item} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden relative">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 pointer-events-none" />
          <div className="p-8 sm:p-12 relative z-10 flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}
              className="relative mb-6"
            >
              <div className="h-28 w-28 bg-gradient-to-tr from-primary to-blue-400 rounded-full p-1 shadow-xl shadow-primary/20">
                <div className="h-full w-full bg-card rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-primary to-blue-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {user.role === 'admin' && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg ring-4 ring-card">
                  <ShieldCheck size={18} />
                </div>
              )}
            </motion.div>

            <h2 className="text-3xl font-bold text-foreground tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
              <Mail size={16} />
              <span className="font-medium">{user.email}</span>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30 text-primary bg-primary/10 shadow-sm">
                {user.role} Account
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-border text-foreground bg-muted shadow-sm flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-500" /> Active Status
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Account Details</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Full Name</span>
                <span className="block font-medium text-foreground">{user.name}</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email Address</span>
                <span className="block font-medium text-foreground">{user.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Account ID</span>
                <span className="block font-mono text-xs text-muted-foreground">{user._id}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Access Permissions</h3>
            </div>
            
            <ul className="space-y-3">
              {[
                { name: 'View assigned tasks', active: true },
                { name: 'Update task statuses', active: true },
                { name: 'Create and edit projects', active: user.role === 'admin' },
                { name: 'Assign tasks to members', active: user.role === 'admin' },
                { name: 'Delete workspace content', active: user.role === 'admin' },
              ].map((perm, idx) => (
                <li key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${perm.active ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-muted/50 border-border/50'}`}>
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${perm.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`} />
                  <span className={`text-sm font-medium ${perm.active ? 'text-foreground' : 'text-muted-foreground line-through opacity-70'}`}>
                    {perm.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;

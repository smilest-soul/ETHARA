import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Activity, FolderKanban, CheckSquare, Clock, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
        ]);
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        const now = new Date();
        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
          pendingTasks: tasks.filter(t => t.status === 'pending').length,
          overdueTasks: tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now).length,
        });
      } catch {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User size={32} className="text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Profile not available</h3>
        <p className="text-muted-foreground text-sm mt-1">Please log in to view your profile.</p>
      </div>
    );
  }

  const permissions = [
    { name: 'View assigned projects & tasks', active: true },
    { name: 'Update task statuses (drag & drop)', active: true },
    { name: 'Create and manage projects', active: user.role === 'admin' },
    { name: 'Assign tasks to team members', active: user.role === 'admin' },
    { name: 'Delete workspace content', active: user.role === 'admin' },
    { name: 'Manage workspace members', active: user.role === 'admin' },
  ];

  const statCards = stats
    ? [
        { label: 'Projects', value: stats.totalProjects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Completed', value: stats.completedTasks, icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'In Progress', value: stats.inProgressTasks, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Pending', value: stats.pendingTasks, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
      ]
    : [];

  return (
    <div className="pb-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Your personal information, stats, and workspace permissions</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* ── Hero Card ── */}
        <motion.div variants={item} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden relative">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 pointer-events-none" />
          <div className="p-8 sm:p-12 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative shrink-0"
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

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">{user.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-muted-foreground">
                <Mail size={15} />
                <span className="font-medium text-sm">{user.email}</span>
              </div>

              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30 text-primary bg-primary/10 shadow-sm">
                  {user.role} Account
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30 text-emerald-600 bg-emerald-500/10 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                <Calendar size={13} />
                <span>Account ID: <span className="font-mono">{user._id}</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div variants={item}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Workspace Stats</h3>
          {loadingStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {statCards.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                >
                  <div className={`p-2 rounded-xl ${s.bg}`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                  <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">{s.label}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 text-center text-muted-foreground text-sm">
              Could not load stats — backend may be unavailable.
            </div>
          )}
        </motion.div>

        {/* ── Account Details + Permissions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Account Details */}
          <motion.div variants={item} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Account Details</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email Address', value: user.email },
                { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                { label: 'Account ID', value: user._id, mono: true },
              ].map((field, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{field.label}</span>
                  <span className={`block font-medium text-foreground ${field.mono ? 'font-mono text-xs text-muted-foreground break-all' : ''}`}>
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Permissions */}
          <motion.div variants={item} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Access Permissions</h3>
            </div>
            <ul className="space-y-2.5">
              {permissions.map((perm, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    perm.active
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-muted/50 border-border/50'
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      perm.active
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      perm.active ? 'text-foreground' : 'text-muted-foreground line-through opacity-60'
                    }`}
                  >
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

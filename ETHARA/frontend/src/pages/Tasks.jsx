import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckSquare, Clock, CalendarX2, Loader, ArrowUpDown, Filter } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const statusColors = {
    pending: 'bg-orange-500/10 text-orange-600 border border-orange-500/20 dark:text-orange-400',
    'in-progress': 'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400',
    completed: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
  };

  const priorityColors = {
    low: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
    medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></div>
          <div className="relative inline-flex rounded-full h-10 w-10 bg-primary shadow-lg shadow-primary/50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assigned tasks across all projects</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors shadow-sm">
             <Filter size={16} className="text-muted-foreground" /> Filter
           </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">Task <ArrowUpDown size={14} /></div>
                </th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Project</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Priority</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                   <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">Due Date <ArrowUpDown size={14} /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task, index) => {
                const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed' && !isToday(new Date(task.dueDate));
                
                return (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={task._id} 
                  className={cn("hover:bg-muted/30 transition-colors group", isOverdue && "bg-destructive/5 hover:bg-destructive/10")}
                >
                  <td className="py-4 px-6">
                    <div className={cn("font-semibold", isOverdue ? "text-destructive" : "text-foreground")}>{task.title}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">{task.description}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      {task.project?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn("text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold", statusColors[task.status])}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn("text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold", priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {task.dueDate ? (
                      <div className={cn("flex items-center gap-1.5 text-sm font-medium", isOverdue ? "text-destructive" : "text-muted-foreground group-hover:text-foreground transition-colors")}>
                        {isOverdue ? <CalendarX2 size={16} /> : <Clock size={16} />}
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">No date</span>
                    )}
                  </td>
                </motion.tr>
              )})}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 ring-1 ring-border shadow-sm">
                      <CheckSquare size={32} className="text-muted-foreground/60" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Inbox Zero!</h3>
                    <p className="text-muted-foreground mt-1 text-sm">You have no tasks assigned to you right now.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Tasks;

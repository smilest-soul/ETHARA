import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FolderKanban, CheckSquare, Clock, AlertCircle, CalendarX2, Activity as ActivityIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="flex items-center gap-3 relative z-10">
      <div className="p-2.5 rounded-xl bg-muted text-foreground ring-1 ring-border shadow-sm">
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-bold text-foreground">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes, activitiesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/activities')
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;
        setActivities(activitiesRes.data);

        const now = new Date();
        const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now);

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === 'completed').length,
          pendingTasks: tasks.filter((t) => t.status === 'pending').length,
          inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
          overdueTasks: overdue.length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const pieData = [
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
  ];

  // Dummy data for bar chart since we don't have historical data in backend
  const barData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 9 },
    { name: 'Fri', tasks: 3 },
    { name: 'Sat', tasks: 2 },
    { name: 'Sun', tasks: 1 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your workspace today.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderKanban} delay={0.1} />
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} delay={0.2} />
        <StatCard title="Completed" value={stats.completedTasks} icon={Clock} delay={0.3} />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={CalendarX2} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-6">Task Velocity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--popover-foreground)' }}
                  />
                  <Bar dataKey="tasks" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-6">Task Distribution</h3>
            <div className="flex items-center justify-between h-48">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'var(--popover-foreground)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-4">
                {pieData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
                      <span className="text-sm font-medium text-muted-foreground">{data.name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{data.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-card rounded-2xl border border-border shadow-sm flex flex-col h-full"
        >
          <div className="p-6 border-b border-border flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ActivityIcon size={18} />
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Activity Log</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {activities.length > 0 ? (
              <ul className="relative ml-6 mt-4 border-l border-border/60 pb-4">
                {activities.map((activity, index) => (
                  <li key={activity._id} className="mb-6 ml-6 last:mb-0">
                    <div className="absolute -left-2.5 mt-1.5 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm text-foreground leading-snug">
                          <span className="font-semibold">{activity.user?.name}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </span>
                          {activity.project && (
                            <>
                              <span className="text-border">•</span>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {activity.project.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ActivityIcon size={32} className="text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground font-medium text-sm">No recent activity detected.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

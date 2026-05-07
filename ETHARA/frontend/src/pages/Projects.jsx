import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, FolderKanban, Lock, Users, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateProjectModal from '../components/CreateProjectModal';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (error) {
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProjectClick = () => {
    if (user.role !== 'admin') {
      toast.error('Access Denied: Only Admins can create projects.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track your active workspaces</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          onClick={handleCreateProjectClick}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 font-medium ${
            user?.role === 'admin' 
              ? 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-md' 
              : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
          }`}
          title={user?.role !== 'admin' ? "Only Admins can create projects" : ""}
        >
          {user?.role === 'admin' ? <Plus size={18} /> : <Lock size={16} />}
          <span>New Project</span>
        </motion.button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <motion.div key={project._id} variants={item}>
            <Link
              to={`/projects/${project._id}`}
              className="group block bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <FolderKanban size={20} />
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300">
                  <ArrowRight size={18} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="flex justify-between items-center text-xs pt-5 border-t border-border">
                <div className="flex items-center gap-1.5 font-medium text-foreground bg-muted px-2.5 py-1 rounded-md">
                  <Users size={14} className="text-muted-foreground" />
                  <span>{project.members?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Calendar size={14} />
                  <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        
        {projects.length === 0 && (
          <motion.div variants={item} className="col-span-full">
            <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-dashed border-border">
              <div className="p-4 rounded-full bg-muted/50 mb-4 ring-1 ring-border shadow-sm">
                <FolderKanban size={48} className="text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground max-w-sm text-center mb-6 text-sm">
                You haven't been assigned to any projects. Check back later or ask your administrator.
              </p>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} /> Create your first project
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleProjectCreated} 
      />
    </div>
  );
};

export default Projects;

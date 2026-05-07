import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, FolderKanban, CheckSquare, X, Command, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      if (query.trim()) {
         handleSearch(query);
      } else {
         setResults({ projects: [], tasks: [] });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle Cmd+K globally and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ projects: [], tasks: [] });
      return;
    }

    setLoading(true);
    try {
      // Fetch both projects and tasks
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);

      const lowerQuery = searchQuery.toLowerCase();
      
      const filteredProjects = projectsRes.data.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );

      const filteredTasks = tasksRes.data.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        (t.description && t.description.toLowerCase().includes(lowerQuery))
      );

      setResults({ projects: filteredProjects, tasks: filteredTasks });
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
      else setResults({ projects: [], tasks: [] });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProject = (projectId) => {
    navigate(`/projects/${projectId}`);
    onClose();
    setQuery('');
  };

  const handleSelectTask = (projectId) => {
    // Navigate to the project where the task lives
    navigate(`/projects/${projectId}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  const totalResults = results.projects.length + results.tasks.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-32">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }} 
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden flex flex-col relative z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-4 py-4 border-b border-border gap-3">
              <Search className="text-muted-foreground shrink-0" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tasks, or members..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
              />
              {loading && <Loader2 className="animate-spin text-muted-foreground shrink-0" size={18} />}
              <button 
                onClick={onClose}
                className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-semibold hover:bg-muted/80 transition-colors hidden sm:block shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {!query.trim() && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Command size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Type something to search...</p>
                  <p className="text-xs opacity-60 mt-1">Search across all your projects and tasks.</p>
                </div>
              )}

              {query.trim() && !loading && totalResults === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Search size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium text-foreground">No results found for "{query}"</p>
                  <p className="text-xs opacity-60 mt-1">Try searching for a different keyword.</p>
                </div>
              )}

              {query.trim() && (results.projects.length > 0 || results.tasks.length > 0) && (
                <div className="p-2 space-y-4">
                  {results.projects.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Projects
                      </div>
                      <div className="space-y-1">
                        {results.projects.map(project => (
                          <button
                            key={project._id}
                            onClick={() => handleSelectProject(project._id)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                          >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                              <FolderKanban size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="text-sm font-semibold text-foreground truncate">{project.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.tasks.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tasks
                      </div>
                      <div className="space-y-1">
                        {results.tasks.map(task => (
                          <button
                            key={task._id}
                            onClick={() => handleSelectTask(task.project?._id || task.project)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                          >
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                              <CheckSquare size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-foreground truncate">{task.title}</h4>
                                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0", 
                                  task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                                  task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                                )}>
                                  {task.status.replace('-', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearchModal;

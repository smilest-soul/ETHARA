import React, { useState, useEffect } from 'react';
import { X, Loader2, Users, FileText, Type } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.filter(u => u.role === 'member'));
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/projects', {
        name,
        description,
        members: selectedMembers,
      });
      toast.success('Project created successfully!');
      onSuccess(res.data);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedMembers([]);
    onClose();
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-card rounded-3xl shadow-2xl border border-border w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] relative z-10"
          >
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <div>
                <h2 className="text-xl font-bold text-foreground">Create Project</h2>
                <p className="text-xs text-muted-foreground mt-1">Set up a new workspace for your team.</p>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="create-project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Type size={16} className="text-primary" /> Project Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText size={16} className="text-primary" /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] text-sm resize-none"
                    placeholder="What is the goal of this project?"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users size={16} className="text-primary" /> Assign Members
                    </label>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {selectedMembers.length} selected
                    </span>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-border">
                      <Loader2 className="animate-spin mr-2" size={20} /> <span className="text-sm">Loading users...</span>
                    </div>
                  ) : (
                    <div className="border border-border rounded-xl max-h-48 overflow-y-auto custom-scrollbar divide-y divide-border bg-card">
                      {users.length === 0 ? (
                        <div className="p-6 text-sm text-muted-foreground text-center">No team members available.</div>
                      ) : (
                        users.map(user => {
                          const isSelected = selectedMembers.includes(user._id);
                          return (
                            <label key={user._id} className={cn("flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-muted/50", isSelected && "bg-primary/5")}>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className={cn("text-sm font-semibold transition-colors", isSelected ? "text-primary" : "text-foreground")}>{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                isSelected ? "bg-primary border-primary" : "border-border bg-background"
                              )}>
                                {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckSquare size={14} className="text-white absolute opacity-0" /></motion.div>}
                                {isSelected && <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                              </div>
                              <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleMember(user._id)} />
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted border border-transparent hover:border-border rounded-xl transition-all" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" form="create-project-form" className="px-6 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl shadow-sm hover:bg-foreground/90 transition-all flex items-center gap-2 disabled:opacity-70" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;

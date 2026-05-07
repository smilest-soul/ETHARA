import React, { useState } from 'react';
import { X, Loader2, Calendar, Target, Flag, AlignLeft } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const CreateTaskModal = ({ isOpen, onClose, onSuccess, projectId, projectMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/tasks', {
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        assignedTo: assignedTo || undefined,
        project: projectId,
      });
      toast.success('Task created successfully!');
      onSuccess(res.data);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setAssignedTo('');
    onClose();
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
                <h2 className="text-xl font-bold text-foreground">Add New Task</h2>
                <p className="text-xs text-muted-foreground mt-1">Create an actionable item for this project.</p>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Target size={16} className="text-primary" /> Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="e.g. Design landing page"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlignLeft size={16} className="text-primary" /> Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] text-sm resize-none"
                    placeholder="Add details, links, or context..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Flag size={16} className="text-primary" /> Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Calendar size={16} className="text-primary" /> Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-semibold text-foreground block mb-2">Assign to Member</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={cn("flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all", !assignedTo ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:bg-muted/50")}>
                      <input type="radio" name="assignee" value="" checked={!assignedTo} onChange={() => setAssignedTo('')} className="hidden" />
                      <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50">
                         ?
                      </div>
                      <span className={cn("text-sm font-medium", !assignedTo ? "text-primary" : "text-muted-foreground")}>Unassigned</span>
                    </label>

                    {projectMembers?.map(member => (
                      <label key={member._id} className={cn("flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all", assignedTo === member._id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:bg-muted/50")}>
                        <input type="radio" name="assignee" value={member._id} checked={assignedTo === member._id} onChange={(e) => setAssignedTo(e.target.value)} className="hidden" />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={cn("text-sm font-medium truncate", assignedTo === member._id ? "text-primary" : "text-foreground")}>{member.name}</span>
                      </label>
                    ))}
                  </div>
                  {projectMembers?.length === 0 && (
                     <p className="text-xs text-muted-foreground italic mt-2">No members in this project to assign.</p>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted border border-transparent hover:border-border rounded-xl transition-all" disabled={submitting}>
                Cancel
              </button>
              <button type="submit" form="create-task-form" className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;

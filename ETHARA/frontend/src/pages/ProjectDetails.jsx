import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Clock, Plus, Loader, CalendarX2, Lock, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast, isToday } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateTaskModal from '../components/CreateTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const TaskCard = ({ task, onStatusChange, isUpdating, index }) => {
  const { user } = useContext(AuthContext);
  
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed' && !isToday(new Date(task.dueDate));

  const isAssignedToMe = task.assignedTo?._id === user._id || task.assignedTo === user._id;
  const canEdit = user.role === 'admin' || isAssignedToMe;

  const priorityColors = {
    low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    medium: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <Draggable draggableId={task._id} index={index} isDragDisabled={!canEdit}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={cn(
            "bg-card p-4 rounded-xl border border-border mb-3 relative group transition-all duration-200 select-none",
            isOverdue && "border-destructive/50 shadow-sm shadow-destructive/10",
            snapshot.isDragging ? "shadow-2xl ring-2 ring-primary rotate-2 scale-[1.02] z-50 cursor-grabbing" : "hover:shadow-md cursor-grab"
          )}
        >
          {/* subtle loading overlay */}
          <AnimatePresence>
            {isUpdating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                <Loader className="animate-spin text-primary" size={20} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className={cn("font-semibold text-sm leading-snug text-foreground", isOverdue && "text-destructive")}>{task.title}</h4>
            <button className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              {task.assignedTo && (
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-primary/20" title={task.assignedTo.name}>
                  {task.assignedTo.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider", priorityColors[task.priority])}>
                {task.priority}
              </span>
            </div>
            
            {task.dueDate && (
              <div className={cn("flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-muted/50", isOverdue && "text-destructive bg-destructive/10")}>
                {isOverdue ? <CalendarX2 size={12} /> : <Clock size={12} />}
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks?projectId=${id}`),
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("Access Denied: You are not a member of this project.");
        } else {
          toast.error('Failed to fetch project details');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const taskToMove = tasks.find(t => t._id === draggableId);
      const isAssignedToMe = taskToMove.assignedTo?._id === user._id || taskToMove.assignedTo === user._id;
      const canEdit = user.role === 'admin' || isAssignedToMe;
      
      if (!canEdit) {
         toast.error('Access Denied: You can only move tasks assigned to you.');
         return;
      }

      const newStatus = destination.droppableId;
      const prevTasks = [...tasks];
      setTasks(tasks.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
      
      try {
        await api.put(`/tasks/${draggableId}/status`, { status: newStatus });
        toast.success('Task moved');
      } catch (error) {
         setTasks(prevTasks);
         toast.error('Failed to move task');
      }
    }
  };

  const handleAddTaskClick = () => {
    if (user.role !== 'admin') {
      toast.error('Access Denied: Only Admins can add tasks.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleTaskCreated = () => {
    api.get(`/tasks?projectId=${id}`).then(res => setTasks(res.data));
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></div>
        <div className="relative inline-flex rounded-full h-10 w-10 bg-primary shadow-lg shadow-primary/50"></div>
      </div>
    </div>
  );
  
  if (!project) return <div className="text-center py-20 text-muted-foreground text-lg">Project not found or access denied.</div>;

  return (
    <div className="pb-10 h-full flex flex-col">
      {/* Project Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{project.name}</h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{project.description}</p>
          </div>
          <button 
            onClick={handleAddTaskClick}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200 font-medium text-sm shrink-0",
              user?.role === 'admin' 
                ? 'bg-foreground text-background hover:bg-foreground/90' 
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
            )}
          >
            {user?.role === 'admin' ? <Plus size={16} /> : <Lock size={14} />}
            <span>New Task</span>
          </button>
        </div>

        {/* Team Avatars */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center text-xs font-bold shadow-sm" title={`Admin: ${project.admin?.name}`}>
              {project.admin?.name?.charAt(0).toUpperCase()}
            </div>
            {project.members?.slice(0, 4).map((m, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm" title={m.name}>
                {m.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.members?.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{project.members?.length + 1} Team Members</span>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-[500px]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 h-full items-start">
            {['pending', 'in-progress', 'completed'].map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "bg-card/40 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-border flex flex-col h-full min-h-[500px] transition-colors duration-200 shadow-sm",
                      snapshot.isDraggingOver && "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          status === 'pending' && "bg-orange-500",
                          status === 'in-progress' && "bg-blue-500",
                          status === 'completed' && "bg-emerald-500",
                        )} />
                        {status.replace('-', ' ')}
                      </h3>
                      <span className="bg-background text-muted-foreground px-2 py-0.5 rounded-full text-xs font-bold border border-border shadow-sm">
                        {tasks.filter((t) => t.status === status).length}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-3 min-h-[100px]">
                      {tasks
                        .filter((t) => t.status === status)
                        .map((task, index) => (
                          <TaskCard 
                            key={task._id} 
                            task={task} 
                            index={index}
                            isUpdating={updatingTaskId === task._id}
                          />
                        ))}
                      {provided.placeholder}
                      
                      {tasks.filter((t) => t.status === status).length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">Drop here</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTaskCreated}
        projectId={id}
        projectMembers={project?.members}
      />
    </div>
  );
};

export default ProjectDetails;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTodos } from '@/contexts/TodoContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Flag, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTodo?: Todo | null;
}

const priorityOptions = [
  { value: 'low', label: 'Low', icon: '🟢', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'medium', label: 'Medium', icon: '🟡', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'high', label: 'High', icon: '🔴', color: 'bg-red-100 text-red-800 border-red-200' }
] as const;

export function TodoForm({ isOpen, onClose, editingTodo }: TodoFormProps) {
  const { addTodo, updateTodo } = useTodos();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Todo['priority']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description,
        dueDate: editingTodo.dueDate 
          ? new Date(editingTodo.dueDate.getTime() - editingTodo.dueDate.getTimezoneOffset() * 60000)
              .toISOString().split('T')[0]
          : '',
        priority: editingTodo.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
    }
    setErrors({});
  }, [editingTodo, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate + 'T00:00:00') : null,
      priority: formData.priority,
      status: 'open' as const
    };

    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      toast({
        title: "Task updated!",
        description: "Your task has been successfully updated.",
      });
    } else {
      addTodo(todoData);
      toast({
        title: "Task created!",
        description: "Your new task has been added to your list.",
      });
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {editingTodo ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What needs to be done?"
              className={`h-12 ${errors.title ? 'border-destructive' : ''}`}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className={`h-12 ${errors.dueDate ? 'border-destructive' : ''}`}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priority
            </Label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('priority', option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex-1 p-3 rounded-lg border-2 transition-all duration-200
                    ${formData.priority === option.value 
                      ? option.color + ' border-current' 
                      : 'bg-muted/50 border-border hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-primary hover:opacity-90"
            >
              {editingTodo ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
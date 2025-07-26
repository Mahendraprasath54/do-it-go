import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTodos } from '@/contexts/TodoContext';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flag, 
  Edit3, 
  Trash2,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const priorityConfig = {
  high: { color: 'bg-red-500', label: 'High', icon: '🔴' },
  medium: { color: 'bg-yellow-500', label: 'Medium', icon: '🟡' },
  low: { color: 'bg-green-500', label: 'Low', icon: '🟢' }
};

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { toggleTodo, deleteTodo } = useTodos();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const getDueDateColor = (date: Date, status: string) => {
    if (status === 'completed') return 'text-muted-foreground';
    if (isPast(date) && !isToday(date)) return 'text-destructive';
    if (isToday(date)) return 'text-warning';
    return 'text-muted-foreground';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Add slight delay for animation
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 150);
  };

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: isDeleting ? 0 : 1, 
          y: isDeleting ? -20 : 0,
          scale: isDeleting ? 0.95 : 1 
        }}
        exit={{ opacity: 0, x: -100, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`
          bg-gradient-card rounded-2xl p-4 shadow-card border border-border/50
          ${todo.status === 'completed' ? 'opacity-60' : 'opacity-100'}
          hover:shadow-lg transition-all duration-200
        `}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="p-1 h-auto rounded-full hover:bg-primary/10"
          >
            {todo.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
            )}
          </Button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 
                  className={`
                    font-semibold text-lg leading-tight mb-1
                    ${todo.status === 'completed' 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                    }
                  `}
                >
                  {todo.title}
                </h3>
                
                {todo.description && (
                  <p 
                    className={`
                      text-sm leading-relaxed mb-3
                      ${todo.status === 'completed' 
                        ? 'line-through text-muted-foreground' 
                        : 'text-muted-foreground'
                      }
                    `}
                  >
                    {todo.description}
                  </p>
                )}
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(todo)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Footer with metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Priority Badge */}
                <Badge variant="secondary" className="text-xs font-medium">
                  <span className="mr-1">{priorityConfig[todo.priority].icon}</span>
                  {priorityConfig[todo.priority].label}
                </Badge>

                {/* Due Date */}
                {todo.dueDate && (
                  <div className={`flex items-center gap-1 text-xs ${getDueDateColor(todo.dueDate, todo.status)}`}>
                    <Calendar className="w-3 h-3" />
                    {formatDueDate(todo.dueDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
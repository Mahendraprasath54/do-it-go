import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoCard } from './TodoCard';
import { TodoForm } from './TodoForm';
import { useTodos } from '@/contexts/TodoContext';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function TodoList() {
  const { 
    filteredTodos, 
    filter, 
    setFilter, 
    sort, 
    setSort, 
    searchQuery, 
    setSearchQuery,
    todos,
    isLoading 
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const getFilterCount = (filterType: string) => {
    switch (filterType) {
      case 'active':
        return todos.filter(t => t.status === 'open').length;
      case 'completed':
        return todos.filter(t => t.status === 'completed').length;
      default:
        return todos.length;
    }
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
        <span className="text-4xl">📝</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? 'No matching tasks' : 
         filter === 'completed' ? 'No completed tasks' :
         filter === 'active' ? 'No active tasks' : 'No tasks yet'}
      </h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery ? 'Try adjusting your search terms' :
         filter === 'completed' ? 'Complete some tasks to see them here' :
         'Create your first task to get started!'}
      </p>
      {!searchQuery && (
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      )}
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search and Filters */}
      <div className="p-4 space-y-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-background/50"
          />
        </div>

        {/* Filter Tabs and Sort */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className={`capitalize ${
                  filter === filterType 
                    ? 'bg-gradient-primary' 
                    : 'bg-background/50'
                }`}
              >
                {filterType}
                <Badge 
                  variant="secondary" 
                  className="ml-2 px-1.5 py-0.5 text-xs"
                >
                  {getFilterCount(filterType)}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-background/50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {/* Sort Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/50">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort('dueDate')}>
                  📅 Due Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort('priority')}>
                  🚩 Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort('created')}>
                  🆕 Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort('title')}>
                  🔤 Title
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {filteredTodos.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3"
            >
              <AnimatePresence>
                {filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEdit}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          onClick={() => setIsFormOpen(true)}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-primary shadow-fab hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingTodo={editingTodo}
      />
    </div>
  );
}
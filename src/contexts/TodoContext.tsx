import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo, TodoFilter, TodoSort } from '@/types/todo';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  filter: TodoFilter;
  sort: TodoSort;
  searchQuery: string;
  isLoading: boolean;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: TodoFilter) => void;
  setSort: (sort: TodoSort) => void;
  setSearchQuery: (query: string) => void;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load todos from localStorage
  useEffect(() => {
    if (user) {
      const storedTodos = localStorage.getItem(`todos-${user.id}`);
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
        setTodos(parsedTodos);
      } else {
        // Add some sample todos for demo
        const sampleTodos: Todo[] = [
          {
            id: '1',
            title: 'Welcome to TodoApp!',
            description: 'This is your first task. Tap to edit or swipe to delete.',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            status: 'open',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            title: 'Plan weekend activities',
            description: 'Research local events and make reservations',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            status: 'open',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setTodos(sampleTodos);
        localStorage.setItem(`todos-${user.id}`, JSON.stringify(sampleTodos));
      }
    }
  }, [user]);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (user && todos.length > 0) {
      localStorage.setItem(`todos-${user.id}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            status: todo.status === 'open' ? 'completed' : 'open',
            updatedAt: new Date()
          }
        : todo
    ));
  };

  // Filter and sort todos
  const filteredTodos = React.useMemo(() => {
    let filtered = todos;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => todo.status === 'open');
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.status === 'completed');
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [todos, filter, searchQuery, sort]);

  return (
    <TodoContext.Provider value={{
      todos,
      filter,
      sort,
      searchQuery,
      isLoading,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      setFilter,
      setSort,
      setSearchQuery,
      filteredTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
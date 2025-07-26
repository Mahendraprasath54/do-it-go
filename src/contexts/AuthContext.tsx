import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/todo';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (provider: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUsers: Record<string, User> = {
  google: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
    provider: 'google'
  },
  apple: {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@icloud.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=000&color=fff',
    provider: 'apple'
  },
  facebook: {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@facebook.com',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=1877f2&color=fff',
    provider: 'facebook'
  },
  github: {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@github.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=333&color=fff',
    provider: 'github'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('todo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers[provider];
    if (userData) {
      setUser(userData);
      localStorage.setItem('todo-user', JSON.stringify(userData));
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('todo-user');
    localStorage.removeItem('todos');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
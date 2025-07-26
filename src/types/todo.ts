export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  status: 'open' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple' | 'facebook' | 'github';
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'dueDate' | 'priority' | 'created' | 'title';
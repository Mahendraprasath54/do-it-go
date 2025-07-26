import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import loginBg from '@/assets/login-bg.jpg';

const socialProviders = [
  {
    id: 'google',
    name: 'Continue with Google',
    icon: '🔍',
    className: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
  },
  {
    id: 'apple',
    name: 'Continue with Apple',
    icon: '🍎',
    className: 'bg-black text-white hover:bg-gray-800'
  },
  {
    id: 'facebook',
    name: 'Continue with Facebook',
    icon: '📘',
    className: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  {
    id: 'github',
    name: 'Continue with GitHub',
    icon: '⚡',
    className: 'bg-gray-900 text-white hover:bg-gray-800'
  }
];

export function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    try {
      setLoadingProvider(provider);
      await login(provider);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-6 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-indigo-900/90" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center text-4xl shadow-fab">
              ✅
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-3"
          >
            TodoApp
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-purple-100"
          >
            Organize your life, one task at a time
          </motion.p>
        </div>

        {/* Social Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {socialProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Button
                onClick={() => handleLogin(provider.id)}
                disabled={isLoading}
                className={`w-full h-14 text-base font-medium rounded-xl ${provider.className} 
                  transition-all duration-200 transform hover:scale-[1.02] shadow-lg`}
              >
                {loadingProvider === provider.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    {provider.name}
                  </div>
                )}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-center text-purple-200 text-sm"
        >
          <p>By continuing, you agree to our Terms of Service</p>
          <p className="mt-2">and Privacy Policy</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
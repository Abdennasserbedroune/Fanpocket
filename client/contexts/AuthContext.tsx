'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useCurrentUser, useRefreshToken } from '@/lib/auth';
import { User } from '@fanpocket/shared';

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  error: Error | null;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const refreshTokenMutation = useRefreshToken();

  const refreshAuth = () => {
    refetch();
  };

  // Handle token refresh on 401 errors
  useEffect(() => {
    if (error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
      refreshTokenMutation.mutate();
    }
  }, [error, refreshTokenMutation]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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
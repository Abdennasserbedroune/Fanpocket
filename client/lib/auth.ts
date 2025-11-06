import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, LoginDto, CreateUserDto, AuthResponse } from '@fanpocket/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiError {
  message: string;
  statusCode?: number;
}

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  login: (data: LoginDto): Promise<AuthResponse> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: CreateUserDto): Promise<AuthResponse> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<void> =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: (): Promise<User> =>
    apiRequest('/auth/me'),

  refreshToken: (): Promise<AuthResponse> =>
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      queryClient.setQueryData(['currentUser'], null);
    },
  });
};
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { LoginCredentials } from '../types/auth';
import { clearTokens } from '../lib/api';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearTokens();
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getProfile(),
    retry: false,
    enabled: !!localStorage.getItem('refreshToken'), // Only fetch if refresh token exists
  });
};


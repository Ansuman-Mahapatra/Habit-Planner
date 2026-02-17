import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { useHabitStore } from '../store/habitStore';
import { router } from 'expo-router';

export const useAuth = () => {
  const login = useHabitStore((state) => state.login);
  const logout = useHabitStore((state) => state.logout);

  const registerMutation = useMutation({
    mutationFn: (userData: any) => authAPI.register(userData),
    onSuccess: (data) => {
      login(data.data, data.data.token);
      router.replace('/(tabs)');
    },
  });

  const loginMutation = useMutation({
    mutationFn: (userData: any) => authAPI.login(userData),
    onSuccess: (data) => {
      login(data.data, data.data.token);
      router.replace('/(tabs)');
    },
  });

  const logoutUser = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return {
    register: registerMutation,
    login: loginMutation,
    logout: logoutUser,
  };
};

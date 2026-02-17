import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsAPI } from '../services/api';

export const useHabits = (frequency?: string) => {
  return useQuery({
    queryKey: ['habits', frequency],
    queryFn: async () => {
      const response = await habitsAPI.getAll(frequency);
      return response.data;
    },
  });
};

export const useHabit = (id: string) => {
  return useQuery({
    queryKey: ['habit', id],
    queryFn: async () => {
      const response = await habitsAPI.getById(id);
      return response.data;
    },
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (habitData: any) => habitsAPI.create(habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useUpdateHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => habitsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['habit'] });
        }
    });
};

export const useDeleteHabit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => habitsAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        }
    });
};

export const useToggleComplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => habitsAPI.toggleComplete(id),
        onSuccess: () => {
            // Optimistically update if needed or just invalidate
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['habit'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        }
    });
};

export const useStats = () => {
    return useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const response = await habitsAPI.getStats();
            return response.data;
        },
    });
};

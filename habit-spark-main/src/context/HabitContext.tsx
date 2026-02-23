import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Habit, HabitCompletion } from '@/types/habit';
import { getToday } from '@/lib/habitUtils';
import { api, initializeAuth } from '@/lib/api';

interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date?: string) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      const { habits: backendHabits, completions: backendCompletions } = await api.getHabits();
      setHabits(backendHabits);
      setCompletions(backendCompletions);
    };
    init();
  }, []);

  const addHabit = useCallback(async (habit: Habit) => {
    // API Call
    const createdHabit = await api.createHabit(habit);
    setHabits(prev => [...prev, createdHabit]);
  }, []);

  const updateHabit = useCallback(async (habit: Habit) => {
    // API Call
    const updatedHabit = await api.updateHabit(habit);
    setHabits(prev => prev.map(h => h.id === habit.id ? updatedHabit : h));
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    // API Call
    await api.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setCompletions(prev => prev.filter(c => c.habitId !== id));
  }, []);

  const toggleCompletion = useCallback(async (habitId: string, date?: string) => {
    const d = date || getToday();
    
    // API Call
    await api.toggleCompletion(habitId, d);

    // Optimistic UI Update
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === d);
      if (existing) {
        return prev.map(c => c.habitId === habitId && c.date === d ? { ...c, completed: !c.completed } : c);
      } else {
        return [...prev, { habitId, date: d, completed: true }];
      }
    });
  }, []);

  return (
    <HabitContext.Provider value={{ habits, completions, addHabit, updateHabit, deleteHabit, toggleCompletion }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}

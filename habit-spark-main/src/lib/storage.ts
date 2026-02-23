import { Habit, HabitCompletion } from '@/types/habit';

const HABITS_KEY = 'habits-tracker-habits';
const COMPLETIONS_KEY = 'habits-tracker-completions';

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadCompletions(): HabitCompletion[] {
  try {
    const data = localStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCompletions(completions: HabitCompletion[]) {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

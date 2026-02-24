import { Habit, HabitCompletion } from '@/types/habit';
import { Goal } from '@/types/goal';

const API_URL = 'https://habit-planner.onrender.com/api';

// Simple token storage
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);

// Authenticate dummy user, since there's no auth flow UI
export const initializeAuth = async () => {
  if (getToken()) return;

  try {
    // Try to login with a test account
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      setToken(data.token);
      return;
    }

    // If login fails, register the test account
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' }),
    });

    if (registerRes.ok) {
      const data = await registerRes.json();
      setToken(data.token);
    }
  } catch (error) {
    console.error('Failed to initialize auth', error);
  }
};

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API Error');
  }
  
  return response.json();
};

// Maps backend habit schema to frontend models
const mapBackendHabitToFrontend = (backendHabit: any): Habit => {
  return {
    id: backendHabit._id,
    name: backendHabit.title, // Map 'title' back to 'name'
    category: backendHabit.category,
    frequency: backendHabit.frequency,
    type: backendHabit.type || 'permanent',
    startDate: backendHabit.startDate || backendHabit.createdAt.split('T')[0],
    endDate: backendHabit.endDate,
    weeklyGoal: backendHabit.weeklyGoal || 100,
    note: backendHabit.note,
    createdAt: backendHabit.createdAt,
    timesPerMonth: backendHabit.timesPerMonth,
    goalId: backendHabit.goalId,
    repeatEvery: backendHabit.repeatEvery,
    repeatUnit: backendHabit.repeatUnit,
  };
};

const mapBackendGoalToFrontend = (g: any): Goal => {
  return {
    id: g._id,
    name: g.name,
    description: g.description,
    startDate: g.startDate,
    endDate: g.endDate,
    createdAt: g.createdAt,
  };
};

export const api = {
  getHabits: async () => {
    const backendHabits = await authFetch('/habits');
    
    const habits: Habit[] = [];
    const completions: HabitCompletion[] = [];
    
    backendHabits.forEach((bh: any) => {
      habits.push(mapBackendHabitToFrontend(bh));
      
      if (bh.completions && Array.isArray(bh.completions)) {
        bh.completions.forEach((c: any) => {
          completions.push({
            habitId: bh._id,
            date: c.date,
            completed: c.completed
          });
        });
      }
    });
    
    return { habits, completions };
  },

  createHabit: async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const created = await authFetch('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
    return mapBackendHabitToFrontend(created);
  },

  updateHabit: async (habit: Habit) => {
    const updated = await authFetch(`/habits/${habit.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...habit, title: habit.name }),
    });
    return mapBackendHabitToFrontend(updated);
  },

  deleteHabit: async (id: string) => {
    await authFetch(`/habits/${id}`, { method: 'DELETE' });
  },

  toggleCompletion: async (habitId: string, date: string) => {
    await authFetch(`/habits/${habitId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ date }),
    });
  },

  getGoals: async () => {
    const backendGoals = await authFetch('/goals');
    return backendGoals.map(mapBackendGoalToFrontend);
  },

  createGoal: async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const created = await authFetch('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
    return mapBackendGoalToFrontend(created);
  },

  updateGoal: async (goal: Goal) => {
    const updated = await authFetch(`/goals/${goal.id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
    return mapBackendGoalToFrontend(updated);
  },

  deleteGoal: async (id: string) => {
    await authFetch(`/goals/${id}`, { method: 'DELETE' });
  }
};

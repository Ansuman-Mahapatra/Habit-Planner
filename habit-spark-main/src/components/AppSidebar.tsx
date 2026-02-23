import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Target, Lightbulb } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getTodayCompletionRate } from '@/lib/habitUtils';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habits', icon: ListChecks, label: 'Habits' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
];

export default function AppSidebar() {
  const { habits, completions } = useHabits();
  const location = useLocation();
  const todayRate = getTodayCompletionRate(habits, completions);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-5 pb-3">
        <h1 className="font-display text-xl text-foreground tracking-tight">Habit<span className="text-primary">Flow</span></h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">Track · Build · Grow</p>
      </div>

      {/* Today's progress */}
      <div className="px-5 py-3">
        <div className="text-xs text-muted-foreground mb-1.5 font-mono">Today's Progress</div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${todayRate}%` }}
          />
        </div>
        <div className="text-right text-xs font-mono text-primary mt-1">{todayRate}%</div>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-5 pt-3">
        <div className="text-[10px] text-muted-foreground font-mono text-center">
          {habits.length} habits tracked
        </div>
      </div>
    </aside>
  );
}

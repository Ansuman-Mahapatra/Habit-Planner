import { useState, useMemo } from 'react';
import { useHabits } from '@/context/HabitContext';
import { getHabitStats, generateId, getToday, isExpired } from '@/lib/habitUtils';
import { Habit, HabitCategory, HabitFrequency, HabitType, CATEGORY_CONFIG, FREQUENCY_LABELS } from '@/types/habit';
import { Plus, Check, X, Flame, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const EMPTY_HABIT: Partial<Habit> = { name: '', category: 'health', frequency: 'daily', type: 'permanent', weeklyGoal: 80, timesPerMonth: 1, repeatEvery: 2, repeatUnit: 'days', goalId: null };

export default function Habits() {
  const { habits, goals, completions, addHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const [filterType, setFilterType] = useState<'all' | HabitType>('all');
  const [filterCat, setFilterCat] = useState<'all' | HabitCategory>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Habit>>(EMPTY_HABIT);

  const stats = useMemo(() => habits.map(h => getHabitStats(h, completions)), [habits, completions]);

  const filtered = useMemo(() => {
    return stats.filter(s => {
      if (filterType !== 'all' && s.habit.type !== filterType) return false;
      if (filterCat !== 'all' && s.habit.category !== filterCat) return false;
      return true;
    });
  }, [stats, filterType, filterCat]);

  const permanent = filtered.filter(s => s.habit.type === 'permanent');
  const temporary = filtered.filter(s => s.habit.type === 'temporary');

  const openAdd = () => { setEditing({ ...EMPTY_HABIT, startDate: getToday() }); setModalOpen(true); };
  const openEdit = (h: Habit) => { setEditing({ ...h }); setModalOpen(true); };

  const handleSave = () => {
    if (!editing.name) return;
    if (editing.id) {
      updateHabit(editing as Habit);
    } else {
      addHabit({ ...editing, id: generateId(), createdAt: getToday(), startDate: editing.startDate || getToday() } as Habit);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display mb-1">Habits</h1>
          <p className="text-muted-foreground text-sm">Manage and track your habits</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(['all', 'permanent', 'temporary'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-md text-xs font-mono capitalize transition-all ${filterType === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${filterCat === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterCat(key as HabitCategory)} className={`px-3 py-1.5 rounded-md text-xs transition-all ${filterCat === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {cfg.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Permanent */}
      {permanent.length > 0 && (
        <Section title="Permanent Habits" items={permanent} onToggle={toggleCompletion} onEdit={openEdit} onDelete={deleteHabit} />
      )}

      {/* Temporary */}
      {temporary.length > 0 && (
        <Section title="Temporary Habits" items={temporary} onToggle={toggleCompletion} onEdit={openEdit} onDelete={deleteHabit} />
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No habits found</p>
          <p className="text-sm mt-1">Add your first habit to get started</p>
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editing.id ? 'Edit Habit' : 'New Habit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-muted-foreground font-mono mb-1 block">Name</label>
              <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Morning Run" />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground font-mono mb-1 block">Goal (Optional)</label>
              <select value={editing.goalId || ''} onChange={e => setEditing(p => ({ ...p, goalId: e.target.value || null }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">-- No Goal --</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Category</label>
                <select value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value as HabitCategory }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Frequency</label>
                <select value={editing.frequency} onChange={e => setEditing(p => ({ ...p, frequency: e.target.value as HabitFrequency }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {Object.entries(FREQUENCY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            
            {editing.frequency === 'times_per_month' && (
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground font-mono mb-1 block">Times per month</label>
                  <input type="number" min={1} max={31} value={editing.timesPerMonth || 1} onChange={e => setEditing(p => ({ ...p, timesPerMonth: Number(e.target.value) }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Type</label>
                <select value={editing.type} onChange={e => setEditing(p => ({ ...p, type: e.target.value as HabitType }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Weekly Goal %</label>
                <input type="range" min={10} max={100} step={5} value={editing.weeklyGoal || 80} onChange={e => setEditing(p => ({ ...p, weeklyGoal: Number(e.target.value) }))} className="w-full accent-primary mt-2" />
                <div className="text-xs font-mono text-primary text-right">{editing.weeklyGoal}%</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Start Date</label>
                <input type="date" value={editing.startDate || ''} onChange={e => setEditing(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              {editing.type === 'temporary' && (
                <div>
                  <label className="text-xs text-muted-foreground font-mono mb-1 block">End Date</label>
                  <input type="date" value={editing.endDate || ''} onChange={e => setEditing(p => ({ ...p, endDate: e.target.value }))} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              )}
            </div>
            <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              {editing.id ? 'Update' : 'Create'} Habit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, items, onToggle, onEdit, onDelete }: {
  title: string;
  items: ReturnType<typeof getHabitStats>[];
  onToggle: (id: string) => void;
  onEdit: (h: Habit) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-2 stagger-children">
        {items.map(s => {
          const cfg = CATEGORY_CONFIG[s.habit.category];
          return (
            <div key={s.habit.id} className={`flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3 transition-all ${s.isExpired ? 'opacity-40 pointer-events-none' : 'hover:border-primary/30'}`}>
              {/* Toggle */}
              <button onClick={() => onToggle(s.habit.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${s.todayDone ? 'bg-primary border-primary animate-pulse-glow' : 'border-border hover:border-primary/50'}`}>
                {s.todayDone && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>

              {/* Category dot */}
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 bg-${cfg.color}`} />

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.habit.name}</div>
                {s.isExpired && <div className="text-[10px] text-destructive font-mono">Expired</div>}
              </div>

              {/* Frequency badge */}
              <span className="text-[10px] font-mono bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full shrink-0">
                {s.habit.frequency === 'times_per_month'
                  ? `${s.habit.timesPerMonth}x / month`
                  : FREQUENCY_LABELS[s.habit.frequency]}
              </span>

              {/* 7-day rate */}
              <div className="text-right shrink-0 w-14">
                <div className="text-sm font-mono text-primary">{s.weekRate}%</div>
                <div className="text-[10px] text-muted-foreground">7d</div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1 shrink-0 w-14">
                <Flame className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-mono">{s.streak}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                <button onClick={() => onEdit(s.habit)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => onDelete(s.habit.id)} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

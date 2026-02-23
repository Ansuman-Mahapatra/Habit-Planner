import { useState, useMemo } from 'react';
import { useHabits } from '@/context/HabitContext';
import { getHabitStats } from '@/lib/habitUtils';
import { CATEGORY_CONFIG } from '@/types/habit';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Goals() {
  const { habits, completions, updateHabit } = useHabits();
  const [selected, setSelected] = useState<string | null>(null);

  const stats = useMemo(() => habits.map(h => getHabitStats(h, completions)), [habits, completions]);

  const radarData = useMemo(() =>
    stats.map(s => ({ name: s.habit.name.slice(0, 10), rate: s.weekRate, streak: Math.min(s.streak * 10, 100) })),
    [stats]
  );

  const selectedStat = stats.find(s => s.habit.id === selected);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display mb-1">Goals</h1>
        <p className="text-muted-foreground text-sm">Set targets and track progress per habit</p>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {stats.map(s => {
          const cfg = CATEGORY_CONFIG[s.habit.category];
          const progress = s.habit.weeklyGoal > 0 ? Math.min(100, Math.round((s.weekRate / s.habit.weeklyGoal) * 100)) : 0;
          const circumference = 2 * Math.PI * 40;
          const offset = circumference - (progress / 100) * circumference;

          return (
            <button key={s.habit.id} onClick={() => setSelected(s.habit.id)}
              className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">{cfg.emoji}</span>
                <span className="text-sm font-medium truncate">{s.habit.name}</span>
              </div>
              <div className="flex justify-center">
                <svg width="100" height="100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(240,10%,14%)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(38,92%,50%)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute flex items-center justify-center w-[100px] h-[100px]">
                  <span className="font-mono text-lg text-foreground">{progress}%</span>
                </div>
              </div>
              <div className="text-center mt-3">
                <div className="text-xs text-muted-foreground font-mono">Target: {s.habit.weeklyGoal}%</div>
                <div className="text-xs text-muted-foreground">Current: {s.weekRate}%</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 animate-fade-up">
          <h3 className="font-display text-lg mb-4">Habit Radar — Rate vs Streak</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(240,10%,18%)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(240,5%,50%)', fontSize: 10 }} />
              <Radar name="Rate" dataKey="rate" stroke="hsl(38,92%,50%)" fill="hsl(38,92%,50%)" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Streak" dataKey="streak" stroke="hsl(142,71%,45%)" fill="hsl(142,71%,45%)" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Goal Edit Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Set Goal</DialogTitle>
          </DialogHeader>
          {selectedStat && (
            <div className="space-y-4 mt-2">
              <div className="text-sm">{CATEGORY_CONFIG[selectedStat.habit.category].emoji} {selectedStat.habit.name}</div>
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Weekly Target %</label>
                <input type="range" min={10} max={100} step={5} value={selectedStat.habit.weeklyGoal}
                  onChange={e => updateHabit({ ...selectedStat.habit, weeklyGoal: Number(e.target.value) })}
                  className="w-full accent-primary" />
                <div className="text-xs font-mono text-primary text-right">{selectedStat.habit.weeklyGoal}%</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Personal Note</label>
                <textarea value={selectedStat.habit.note || ''} onChange={e => updateHabit({ ...selectedStat.habit, note: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                  placeholder="Why is this important to you?" />
              </div>
              <button onClick={() => setSelected(null)} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

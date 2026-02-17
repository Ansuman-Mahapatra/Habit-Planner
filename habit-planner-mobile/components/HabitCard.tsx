import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format } from 'date-fns';

interface Habit {
  _id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  longestStreak: number;
  color: string;
  icon: string;
  completions: { date: string; completed: boolean }[];
  reminder?: string;
  completedToday?: boolean;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onPress: () => void;
}

export default function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  // Determine if completed today
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = habit.completions.some(c => c.date === today && c.completed);
  
  // Animation for completion check
  const scaleAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isCompleted ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isCompleted]);

  // Frequency Badge Color
  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'daily': return '#7C6FFF';
      case 'weekly': return '#FF6B9D';
      case 'monthly': return '#FFB443';
      default: return '#7C6FFF';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.cardContainer}>
      <View style={[styles.card, { borderLeftColor: habit.color, borderLeftWidth: 4 }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{habit.title}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: getFrequencyColor(habit.frequency) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getFrequencyColor(habit.frequency) }]}>
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {habit.streak}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]} 
          onPress={() => onToggle(habit._id)}
        >
          {isCompleted && (
            <FontAwesome name="check" size={14} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#16161F',
    overflow: 'hidden', // for shadow/elevation if needed
  },
  card: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#333', // fallback or specific color
    borderRadius: 8,
  },
  streakText: {
    color: '#FFB443',
    fontSize: 12,
    fontWeight: '500',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#7C6FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#7C6FFF',
  },
});

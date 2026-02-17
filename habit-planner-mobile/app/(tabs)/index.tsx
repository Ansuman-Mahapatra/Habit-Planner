import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useStats, useHabits, useToggleComplete } from '../../hooks/useHabits';
import ProgressRing from '../../components/ProgressRing';
import HabitCard from '../../components/HabitCard';
import { useHabitStore } from '../../store/habitStore';

export default function DashboardScreen() {
  const { user } = useHabitStore();
  const statsQuery = useStats();
  const habitsQuery = useHabits('daily'); // Get daily habits for the short list
  const toggleMutation = useToggleComplete();

  const onRefresh = () => {
    statsQuery.refetch();
    habitsQuery.refetch();
  };

  const progress = statsQuery.data ? 
    (statsQuery.data.totalHabits > 0 ? statsQuery.data.completedToday / statsQuery.data.totalHabits : 0) 
    : 0;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentParams}
      refreshControl={
        <RefreshControl refreshing={statsQuery.isLoading} onRefresh={onRefresh} tintColor="#7C6FFF" />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
          <Text style={styles.subtitle}>Your Daily Progress</Text>
        </View>
        <ProgressRing progress={progress} size={80} strokeWidth={8} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statsQuery.data?.totalHabits || 0}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statsQuery.data?.completedToday || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {statsQuery.data?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today's Habits</Text>
      
      {habitsQuery.isLoading ? (
        <Text style={styles.loadingText}>Loading habits...</Text>
      ) : habitsQuery.data?.length === 0 ? (
        <Text style={styles.emptyText}>No daily habits set yet.</Text>
      ) : (
        habitsQuery.data?.map((habit: any) => (
          <HabitCard 
            key={habit._id} 
            habit={habit} 
            onToggle={() => toggleMutation.mutate(habit._id)}
            onPress={() => {}} // navigation to detail
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  contentParams: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#16161F',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  loadingText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#a0a0a0',
    marginTop: 8,
  }
});

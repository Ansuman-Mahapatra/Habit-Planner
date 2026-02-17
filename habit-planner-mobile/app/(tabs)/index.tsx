import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { useStats, useHabits, useToggleComplete } from '../../hooks/useHabits';
import ProgressRing from '../../components/ProgressRing';
import HabitCard from '../../components/HabitCard';
import { useHabitStore } from '../../store/habitStore';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const { user } = useHabitStore();
  const statsQuery = useStats();
  const habitsQuery = useHabits('daily'); // Get daily habits for the short list
  const toggleMutation = useToggleComplete();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for FAB
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fabScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onRefresh = () => {
    statsQuery.refetch();
    habitsQuery.refetch();
  };

  const progress = statsQuery.data ? 
    (statsQuery.data.totalHabits > 0 ? statsQuery.data.completedToday / statsQuery.data.totalHabits : 0) 
    : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0e0d', '#0f1410', '#0a1209', '#0a0e0d']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={statsQuery.isLoading} onRefresh={onRefresh} tintColor="#7C6FFF" />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
              <Text style={styles.subtitle}>Your Daily Progress</Text>
            </View>
            <ProgressRing progress={progress} size={80} strokeWidth={8} />
          </View>

          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#7C6FFF20', '#16161F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statValue}>{statsQuery.data?.totalHabits || 0}</Text>
              <Text style={styles.statLabel}>Total Habits</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#FF6B9D20', '#16161F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statValue}>{statsQuery.data?.completedToday || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#FFB44320', '#16161F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statValue}>🔥 {statsQuery.data?.longestStreak || 0}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </LinearGradient>
          </View>

          <Text style={styles.sectionTitle}>Today's Habits</Text>
        </Animated.View>
        
        {habitsQuery.isLoading ? (
          <Text style={styles.loadingText}>Loading habits...</Text>
        ) : habitsQuery.data?.length === 0 ? (
          <Text style={styles.emptyText}>No daily habits set yet.</Text>
        ) : (
          habitsQuery.data?.map((habit: any, index: number) => (
            <Animated.View
              key={habit._id}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              }}
            >
              <HabitCard 
                habit={habit} 
                onToggle={() => toggleMutation.mutate(habit._id)}
                onPress={() => {}} // navigation to detail
              />
            </Animated.View>
          ))
        )}
      </ScrollView>

      <Link href="/habit/create" asChild>
        <Animated.View style={{ transform: [{ scale: fabScale }] }}>
          <TouchableOpacity style={styles.fab}>
            <LinearGradient
              colors={['#9D7FFF', '#7C6FFF', '#6B5FE8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <Text style={styles.fabText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  contentContainer: {
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#7C6FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2, // Visual adjustment
  }
});

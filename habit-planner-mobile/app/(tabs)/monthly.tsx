import { View, StyleSheet, FlatList } from 'react-native';
import { useHabits, useToggleComplete } from '../../hooks/useHabits';
import HabitCard from '../../components/HabitCard';
import { router } from 'expo-router';

export default function MonthlyHabitsScreen() {
  const { data: habits, isLoading, refetch } = useHabits('monthly');
  const toggleMutation = useToggleComplete();

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={(id) => toggleMutation.mutate(id)}
            onPress={() => router.push(`/habit/${item._id}`)}
          />
        )}
        refreshing={isLoading}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
  },
  listContent: {
    padding: 20,
  },
});

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useHabit, useDeleteHabit } from '../../hooks/useHabits';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams();
    const { data: habit, isLoading } = useHabit(id as string);
    const deleteMutation = useDeleteHabit();

    const handleDelete = () => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => {
                        deleteMutation.mutate(id as string, {
                            onSuccess: () => {
                                router.back();
                            }
                        });
                    } 
                }
            ]
        );
    };

    if (isLoading || !habit) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: habit.color + '20' }]}>
                <Text style={styles.icon}>{habit.icon}</Text>
                <Text style={styles.title}>{habit.title}</Text>
                <Text style={[styles.frequency, { color: habit.color }]}>
                    {habit.frequency.toUpperCase()}
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>🔥 {habit.streak}</Text>
                    <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>🏆 {habit.longestStreak}</Text>
                    <Text style={styles.statLabel}>Longest Streak</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <FontAwesome name="trash" size={20} color="#FF5C5C" />
                <Text style={styles.deleteText}>Delete Habit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0E17',
        padding: 20,
    },
    loadingText: {
        color: '#a0a0a0',
        textAlign: 'center',
        marginTop: 50,
    },
    header: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 24,
        marginBottom: 32,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    frequency: {
        fontSize: 14,
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#16161F',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    statLabel: {
        color: '#a0a0a0',
        fontSize: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#16161F',
        borderRadius: 16,
        marginTop: 'auto',
    },
    deleteText: {
        color: '#FF5C5C',
        marginLeft: 8,
        fontWeight: '600',
    }
});

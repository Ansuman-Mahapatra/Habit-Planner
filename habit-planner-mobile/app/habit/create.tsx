import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useCreateHabit } from '../../hooks/useHabits';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomCalendar from '../../components/CustomCalendar';
import SpotlightBackground from '../../components/SpotlightBackground';

const FREQUENCIES = ['daily', 'weekly', 'monthly', 'custom'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Last Week'];
const COLORS = ['#7C6FFF', '#FF6B9D', '#3ECFA8', '#FFB443', '#FF5C5C', '#333'];
const ICONS = ['📝', '🏃', '💧', '📚', '🧘', '💰', '💤', '🥗'];
const TIMES = ['06:00', '07:00', '08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

export default function CreateHabitScreen() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [frequency, setFrequency] = useState('daily');
    const [targetDays, setTargetDays] = useState<string[]>([]);
    const [targetWeeks, setTargetWeeks] = useState<string[]>([]);
    const [customDates, setCustomDates] = useState<string[]>([]);
    const [enableReminder, setEnableReminder] = useState(false);
    const [reminder, setReminder] = useState('08:00');
    const [color, setColor] = useState(COLORS[0]);
    const [icon, setIcon] = useState(ICONS[0]);

    const createMutation = useCreateHabit();

    const toggleDay = (day: string) => {
        if (targetDays.includes(day)) {
            setTargetDays(targetDays.filter(d => d !== day));
        } else {
            setTargetDays([...targetDays, day]);
        }
    };

    const toggleWeek = (week: string) => {
        if (targetWeeks.includes(week)) {
            setTargetWeeks(targetWeeks.filter(w => w !== week));
        } else {
            setTargetWeeks([...targetWeeks, week]);
        }
    };

    const toggleDate = (date: string) => {
        if (customDates.includes(date)) {
            setCustomDates(customDates.filter(d => d !== date));
        } else {
            setCustomDates([...customDates, date]);
        }
    };

    const handleCreate = () => {
        if (!title) return;

        createMutation.mutate({
            title,
            category,
            frequency,
            targetDays,
            targetWeeks,
            customDates,
            reminder: enableReminder ? reminder : '',
            color,
            icon
        }, {
            onSuccess: () => {
                router.back();
            }
        });
    };

    return (
    <SpotlightBackground>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.label}>Title</Text>
            <TextInput 
                style={styles.input} 
                placeholder="e.g. Read 30 mins" 
                placeholderTextColor="#666" 
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyRow}>
                {FREQUENCIES.map(freq => (
                    <TouchableOpacity
                        key={freq}
                        style={[styles.freqButton, frequency === freq && styles.freqButtonActive]}
                        onPress={() => setFrequency(freq)}
                    >
                        <Text style={[styles.freqText, frequency === freq && styles.freqTextActive]}>{freq}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {frequency === 'weekly' && (
                <>
                    <Text style={styles.label}>Target Days</Text>
                    <View style={styles.daysRow}>
                        {DAYS.map(day => (
                            <TouchableOpacity
                                key={day}
                                style={[styles.dayButton, targetDays.includes(day) && styles.dayButtonActive]}
                                onPress={() => toggleDay(day)}
                            >
                                <Text style={[styles.dayText, targetDays.includes(day) && styles.dayTextActive]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {frequency === 'monthly' && (
                <>
                    <Text style={styles.label}>Target Weeks</Text>
                    <View style={styles.weeksRow}>
                        {WEEKS.map(week => (
                            <TouchableOpacity
                                key={week}
                                style={[styles.freqButton, targetWeeks.includes(week) && styles.freqButtonActive]}
                                onPress={() => toggleWeek(week)}
                            >
                                <Text style={[styles.freqText, targetWeeks.includes(week) && styles.freqTextActive]}>{week}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {frequency === 'custom' && (
                <>
                    <Text style={styles.label}>Select Dates</Text>
                    <CustomCalendar selectedDates={customDates} onToggle={toggleDate} />
                </>
            )}

            <Text style={styles.label}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
                {COLORS.map(c => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.colorButton, { backgroundColor: c }, color === c && styles.colorButtonActive]}
                        onPress={() => setColor(c)}
                    />
                ))}
            </ScrollView>

            <Text style={styles.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
                {ICONS.map(i => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.iconButton, icon === i && styles.iconButtonActive]}
                        onPress={() => setIcon(i)}
                    >
                        <Text style={styles.iconText}>{i}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.reminderSection}>
                <View style={styles.reminderHeader}>
                    <Text style={styles.label}>Set Reminder</Text>
                    <Switch
                        value={enableReminder}
                        onValueChange={setEnableReminder}
                        trackColor={{ false: '#2a2a35', true: '#7C6FFF' }}
                        thumbColor={enableReminder ? '#fff' : '#666'}
                    />
                </View>
                {enableReminder && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRow}>
                        {TIMES.map(time => (
                            <TouchableOpacity
                                key={time}
                                style={[styles.timeButton, reminder === time && styles.timeButtonActive]}
                                onPress={() => setReminder(time)}
                            >
                                <Text style={[styles.timeText, reminder === time && styles.timeTextActive]}>
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            <TouchableOpacity 
                style={styles.createButton} 
                onPress={handleCreate}
                disabled={createMutation.isPending}
            >
                <Text style={styles.createButtonText}>
                    {createMutation.isPending ? 'Creating...' : 'Create Habit'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    </SpotlightBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0E17',
    },
    content: {
        padding: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#16161F',
        color: '#fff',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2a2a35'
    },
    frequencyRow: {
        flexDirection: 'row',
        gap: 12,
    },
    freqButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#16161F',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a35',
    },
    freqButtonActive: {
        backgroundColor: '#7C6FFF',
        borderColor: '#7C6FFF',
    },
    freqText: {
        color: '#a0a0a0',
        textTransform: 'capitalize',
    },
    freqTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    weeksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#16161F',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2a2a35',
    },
    dayButtonActive: {
        backgroundColor: '#7C6FFF',
        borderColor: '#7C6FFF',
    },
    dayText: {
        color: '#a0a0a0',
        fontSize: 12,
    },
    dayTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    colorRow: {
        flexDirection: 'row',
        gap: 12,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    colorButtonActive: {
        borderWidth: 3,
        borderColor: '#fff',
    },
    iconRow: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#16161F',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#2a2a35',
    },
    iconButtonActive: {
        borderColor: '#7C6FFF',
        backgroundColor: '#2a2a35',
    },
    iconText: {
        fontSize: 24,
    },
    reminderSection: {
        marginTop: 16,
    },
    reminderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    timeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#16161F',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#2a2a35',
    },
    timeButtonActive: {
        backgroundColor: '#7C6FFF',
        borderColor: '#7C6FFF',
    },
    timeText: {
        color: '#a0a0a0',
        fontSize: 14,
    },
    timeTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#7C6FFF',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

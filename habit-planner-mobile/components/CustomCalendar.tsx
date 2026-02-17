import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CustomCalendarProps {
    selectedDates: string[];
    onToggle: (date: string) => void;
}

export default function CustomCalendar({ selectedDates, onToggle }: CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
                    <FontAwesome name="chevron-left" size={16} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {format(currentMonth, "MMMM yyyy")}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
                    <FontAwesome name="chevron-right" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderDays = () => {
        return (
            <View style={styles.daysRow}>
                {daysOfWeek.map((day, index) => (
                    <Text key={index} style={styles.dayLabel}>{day}</Text>
                ))}
            </View>
        );
    };

    const renderCells = () => {
        const dayList = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <View style={styles.calendarBody}>
                {dayList.map((d, i) => {
                    const dateString = format(d, 'yyyy-MM-dd');
                    const isSelected = selectedDates.includes(dateString);
                    const isCurrentMonth = isSameMonth(d, monthStart);

                    return (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.cell,
                                isSelected && styles.selectedCell,
                                !isCurrentMonth && styles.disabledCell
                            ]}
                            onPress={() => onToggle(dateString)}
                        >
                            <Text style={[
                                styles.cellText,
                                isSelected && styles.selectedCellText,
                                !isCurrentMonth && styles.disabledCellText
                            ]}>
                                {format(d, 'd')}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#16161F',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2a2a35'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrowButton: {
        padding: 8,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dayLabel: {
        color: '#a0a0a0',
        width: 35,
        textAlign: 'center',
        fontSize: 12,
    },
    calendarBody: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    selectedCell: {
        backgroundColor: '#7C6FFF',
    },
    currentDayCell: {
        borderWidth: 1,
        borderColor: '#7C6FFF',
    },
    disabledCell: {
        opacity: 0.3,
    },
    cellText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedCellText: {
        fontWeight: 'bold',
    },
    disabledCellText: {
        color: '#666',
    },
});

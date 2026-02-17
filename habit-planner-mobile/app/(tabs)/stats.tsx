import { View, Text, StyleSheet, Platform, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { useStats } from '../../hooks/useHabits';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import SpotlightBackground from '../../components/SpotlightBackground';

interface WeeklyActivity {
  day: string;
  count: number;
}

interface MonthlyActivity {
  month: string;
  count: number;
}

export default function StatsScreen() {
  const isWeb = Platform.OS === 'web';
  const { data: statsData, isLoading } = useStats();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  
  const weeklyData: WeeklyActivity[] = statsData?.weeklyActivity || [];
  const monthlyData: MonthlyActivity[] = statsData?.monthlyActivity || [];
  const data = viewMode === 'weekly' ? weeklyData : monthlyData;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [statsData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7C6FFF" />
      </View>
    );
  }

  return (
    <SpotlightBackground>
      <Animated.View style={{ opacity: fadeAnim, flex: 1, width: '100%' }}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'weekly' && styles.toggleButtonActive]} 
            onPress={() => setViewMode('weekly')}
          >
            <Text style={[styles.toggleText, viewMode === 'weekly' && styles.toggleTextActive]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'monthly' && styles.toggleButtonActive]} 
            onPress={() => setViewMode('monthly')}
          >
            <Text style={[styles.toggleText, viewMode === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 300, width: '100%' }}>
          {isWeb ? (
            <View style={styles.webPlaceholder}>
               <Text style={styles.webText}>Charts are optimized for mobile.</Text>
               <Text style={styles.webText}>Please view on Android/iOS to see the graph.</Text>
               {/* Simple visual fallback for web could go here if needed */}
               <View style={styles.simpleBarContainer}>
                  {data.map((d: any, i: number) => (
                      <Animated.View 
                        key={i} 
                        style={[
                          styles.simpleBarWrapper,
                          {
                            opacity: fadeAnim,
                            transform: [{
                              translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                              }),
                            }],
                          }
                        ]}
                      >
                          <LinearGradient
                            colors={['#9D7FFF', '#7C6FFF']}
                            style={[styles.simpleBar, { height: Math.max(d.count * (viewMode === 'weekly' ? 20 : 10), 4) }]}
                          />
                          <Text style={styles.webText}>{viewMode === 'weekly' ? d.day : d.month}</Text>
                      </Animated.View>
                  ))}
               </View>
            </View>
          ) : (
            <CartesianChart
              data={data as any[]}
              xKey={viewMode === 'weekly' ? "day" : "month"}
              yKeys={["count"]}
              domainPadding={{ left: 50, right: 50, top: 30 }}
            >
              {({ points, chartBounds }) => (
                <Bar
                  points={points.count}
                  chartBounds={chartBounds}
                  color="#7C6FFF"
                  roundedCorners={{ topLeft: 5, topRight: 5 }}
                />
              )}
            </CartesianChart>
          )}
        </View>
      </Animated.View>
    </SpotlightBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#16161F',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#7C6FFF',
  },
  toggleText: {
    color: '#a0a0a0',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  webPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  webText: {
    color: '#a0a0a0',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  simpleBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 200,
    marginTop: 20,
    gap: 10,
  },
  simpleBarWrapper: {
    alignItems: 'center',
    gap: 5,
  },
  simpleBar: {
    width: 20,
    backgroundColor: '#7C6FFF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
});

import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

const data = [
  { day: 'Mon', count: 3 },
  { day: 'Tue', count: 4 },
  { day: 'Wed', count: 2 },
  { day: 'Thu', count: 5 },
  { day: 'Fri', count: 3 },
  { day: 'Sat', count: 1 },
  { day: 'Sun', count: 4 },
];

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress</Text>
      <VictoryChart width={screenWidth} theme={VictoryTheme.material} domainPadding={20}>
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: '#fff' },
            tickLabels: { fill: '#fff' },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: '#fff' },
            tickLabels: { fill: '#fff' },
          }}
        />
        <VictoryBar 
            data={data} 
            x="day" 
            y="count" 
            style={{ data: { fill: "#7C6FFF" } }}
            animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
            }}
        />
      </VictoryChart>
    </View>
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
});

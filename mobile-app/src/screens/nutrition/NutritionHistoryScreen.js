import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const screenWidth = Dimensions.get('window').width;

const HistoryItem = ({ date, score }) => (
    <View style={styles.historyRow}>
        <Text style={styles.historyDate}>{date}</Text>
        <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score} kcal</Text>
        </View>
    </View>
);

export default function NutritionHistoryScreen({ navigation }) {
    const chartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            data: [1500, 1800, 1650, 1900, 1400, 2100, 1750]
        }]
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>History</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={globalStyles.sectionLabel}>7-DAY CALORIES</Text>
            <View style={styles.chartCard}>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: COLORS.card,
                        backgroundGradientFrom: COLORS.card,
                        backgroundGradientTo: COLORS.card,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(200, 255, 87, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForBackgroundLines: { stroke: COLORS.cardBorder }
                    }}
                    style={styles.chart}
                    withInnerLines={true}
                    showBarTops={false}
                    flatColor={true}
                />
            </View>

            <Text style={[globalStyles.sectionLabel, { marginTop: 30 }]}>PAST LOGS</Text>
            <View style={styles.historyList}>
                <HistoryItem date="Today, Feb 21" score="1450" />
                <HistoryItem date="Yesterday, Feb 20" score="1800" />
                <HistoryItem date="Monday, Feb 19" score="1650" />
                <HistoryItem date="Sunday, Feb 18" score="1900" />
                <HistoryItem date="Saturday, Feb 17" score="2100" />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        ...globalStyles.heading,
        fontSize: 20,
    },
    chartCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingTop: 15,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    chart: {
        borderRadius: 16,
    },
    historyList: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    historyDate: {
        color: COLORS.white,
        fontSize: 16,
    },
    scoreBadge: {
        backgroundColor: 'rgba(200, 255, 87, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    scoreText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

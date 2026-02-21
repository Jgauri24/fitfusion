import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockPWS, mockTrend } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const ProgressBar = ({ label, score }) => (
    <View style={styles.progressRow}>
        <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{label}</Text>
            <Text style={styles.progressScore}>{score}</Text>
        </View>
        <View style={styles.track}>
            <View style={[styles.fill, { width: `${score}%` }]} />
        </View>
    </View>
);

export default function WellnessInsightScreen({ navigation }) {
    // Mocking 30 day data by repeating trend for visual density
    const thirtyDayData = [...mockTrend, ...mockTrend, ...mockTrend, ...mockTrend, mockTrend[0], mockTrend[1]];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Wellness Insights</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={globalStyles.sectionLabel}>30-DAY TREND</Text>
            <LineChart
                data={{
                    labels: ["1", "5", "10", "15", "20", "25", "30"],
                    datasets: [{ data: thirtyDayData }]
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: COLORS.bg,
                    backgroundGradientFrom: COLORS.bg,
                    backgroundGradientTo: COLORS.bg,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(200, 255, 87, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "0" }, // Hide dots for dense chart
                    propsForBackgroundLines: { stroke: COLORS.cardBorder }
                }}
                bezier
                style={styles.chart}
            />

            <Text style={globalStyles.sectionLabel}>DIMENSIONS</Text>
            <Card style={styles.breakdownCard}>
                <ProgressBar label="🥗 Nutrition" score={mockPWS.nutrition} />
                <ProgressBar label="⚡ Activity" score={mockPWS.activity} />
                <ProgressBar label="😊 Mood" score={mockPWS.mood} />
                <ProgressBar label="🌿 Environment" score={mockPWS.environment} />
            </Card>

            <Text style={globalStyles.sectionLabel}>SUMMARY</Text>
            <Card>
                <Text style={styles.summaryText}>
                    Your mood has been stable this week. Activity needs attention — you've missed 3 sessions.
                </Text>
            </Card>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 50,
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
    chart: {
        marginVertical: 10,
        borderRadius: 16,
        marginLeft: -10, // Adjust chart kit default padding
    },
    breakdownCard: {
        marginBottom: 20,
    },
    progressRow: {
        marginBottom: 15,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        color: COLORS.white,
        fontSize: 14,
    },
    progressScore: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 14,
    },
    track: {
        height: 8,
        backgroundColor: COLORS.bg,
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 4,
    },
    summaryText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 22,
    }
});

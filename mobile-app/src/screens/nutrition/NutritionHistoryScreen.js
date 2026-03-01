import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';

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
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [{ data: [1500, 1800, 1650, 1900, 1400, 2100, 1750] }],
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>History</Text>
                <View style={{ width: 22 }} />
            </View>

            <Text style={globalStyles.sectionLabel}>7-DAY CALORIES</Text>
            <GlassCard noPad style={{ marginBottom: 20 }}>
                <BarChart
                    data={chartData}
                    width={screenWidth - 56}
                    height={210}
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: COLORS.cardSolid,
                        backgroundGradientTo: COLORS.cardSolid,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(45, 127, 249, ${opacity})`,
                        labelColor: () => COLORS.textMuted,
                        propsForBackgroundLines: { stroke: COLORS.border },
                        barPercentage: 0.5,
                    }}
                    style={{ borderRadius: 20, padding: 8 }}
                    withInnerLines={true}
                    showBarTops={false}
                    flatColor={true}
                />
            </GlassCard>

            <Text style={[globalStyles.sectionLabel, { marginTop: 10 }]}>PAST LOGS</Text>
            <GlassCard noPad>
                {[
                    { date: 'Today, Feb 21', score: '1450' },
                    { date: 'Yesterday, Feb 20', score: '1800' },
                    { date: 'Monday, Feb 19', score: '1650' },
                    { date: 'Sunday, Feb 18', score: '1900' },
                    { date: 'Saturday, Feb 17', score: '2100' },
                ].map((item, idx) => (
                    <View key={idx} style={[styles.historyRow, idx < 4 && styles.historyBorder]}>
                        <Text style={styles.historyDate}>{item.date}</Text>
                        <View style={styles.scoreBadge}>
                            <Text style={styles.scoreText}>{item.score} kcal</Text>
                        </View>
                    </View>
                ))}
            </GlassCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18 },
    historyBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    historyDate: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
    scoreBadge: { backgroundColor: COLORS.accentGlow, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: COLORS.accentGlowMed },
    scoreText: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
});

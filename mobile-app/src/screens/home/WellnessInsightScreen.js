import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import { mockPWS, mockTrend } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const ProgressBar = ({ icon, label, score }) => (
    <View style={styles.progressRow}>
        <View style={styles.progressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name={icon} size={14} color={COLORS.textSecondary} />
                <Text style={styles.progressLabel}>{label}</Text>
            </View>
            <Text style={styles.progressScore}>{score}</Text>
        </View>
        <View style={styles.track}>
            <View style={[styles.fill, { width: `${score}%` }]} />
        </View>
    </View>
);

export default function WellnessInsightScreen({ navigation }) {
    const thirtyDayData = [...mockTrend, ...mockTrend, ...mockTrend, ...mockTrend, mockTrend[0], mockTrend[1]];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Wellness Insights</Text>
                <View style={{ width: 22 }} />
            </View>

            <Text style={globalStyles.sectionLabel}>30-DAY TREND</Text>
            <GlassCard noPad style={{ marginBottom: 20 }}>
                <LineChart
                    data={{
                        labels: ["1", "5", "10", "15", "20", "25", "30"],
                        datasets: [{ data: thirtyDayData }],
                    }}
                    width={screenWidth - 56}
                    height={210}
                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: COLORS.cardSolid,
                        backgroundGradientTo: COLORS.cardSolid,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(163, 230, 53, ${opacity})`,
                        labelColor: () => COLORS.textMuted,
                        style: { borderRadius: 20 },
                        propsForDots: { r: '0' },
                        propsForBackgroundLines: { stroke: COLORS.border },
                    }}
                    bezier
                    style={{ borderRadius: 20, padding: 8 }}
                />
            </GlassCard>

            <Text style={globalStyles.sectionLabel}>DIMENSIONS</Text>
            <GlassCard style={{ marginBottom: 20 }}>
                <ProgressBar icon="heart" label="Nutrition" score={mockPWS.nutrition} />
                <ProgressBar icon="zap" label="Activity" score={mockPWS.activity} />
                <ProgressBar icon="smile" label="Mood" score={mockPWS.mood} />
                <ProgressBar icon="wind" label="Environment" score={mockPWS.environment} />
            </GlassCard>

            <Text style={globalStyles.sectionLabel}>SUMMARY</Text>
            <GlassCard>
                <Text style={styles.summaryText}>
                    Your mood has been stable this week. Activity needs attention — you've missed 3 sessions.
                </Text>
            </GlassCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    progressRow: { marginBottom: 16 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
    progressLabel: { color: COLORS.white, fontSize: 14, fontWeight: '500' },
    progressScore: { color: COLORS.accent, fontWeight: '700', fontSize: 14 },
    track: { height: 5, backgroundColor: COLORS.border, borderRadius: 3 },
    fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
    summaryText: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 23 },
});

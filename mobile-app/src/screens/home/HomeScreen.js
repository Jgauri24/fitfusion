import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockPWS, mockTrend, mockUser } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const DimensionCard = ({ icon, label, score, color }) => (
    <View style={styles.dimensionCard}>
        <Text style={styles.dimensionIcon}>{icon}</Text>
        <Text style={styles.dimensionLabel}>{label}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{score}</Text>
        </View>
    </View>
);

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            {/* Header Row */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.greeting}>Hey, {mockUser.name.split(' ')[0]} 👋</Text>
                    <Text style={globalStyles.subtitle}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                </View>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{mockUser.initials}</Text>
                </View>
            </View>

            {/* PWS Hero Card */}
            <Card style={styles.heroCard}>
                <Text style={globalStyles.sectionLabel}>Personal Wellness Score</Text>
                <View style={styles.ringContainer}>
                    <AnimatedCircularProgress
                        size={160}
                        width={12}
                        fill={mockPWS.score}
                        tintColor={COLORS.accent}
                        backgroundColor={COLORS.bg}
                        rotation={270}
                        lineCap="round"
                    >
                        {() => (
                            <View style={styles.ringInner}>
                                <Text style={styles.ringScore}>{mockPWS.score}</Text>
                                <Text style={styles.ringMax}>/ 100</Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                </View>
                <Text style={styles.statusText}>Good</Text>
            </Card>

            {/* Dimension Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dimensionScroll}>
                <DimensionCard icon="🥗" label="Nutrition" score={mockPWS.nutrition} color={COLORS.accent} />
                <DimensionCard icon="⚡" label="Activity" score={mockPWS.activity} color={COLORS.amber} />
                <DimensionCard icon="😊" label="Mood" score={mockPWS.mood} color={COLORS.accent} />
                <DimensionCard icon="🌿" label="Environment" score={mockPWS.environment} color={COLORS.accent} />
            </ScrollView>

            {/* Smart Nudge Card */}
            <Card style={[styles.nudgeCard, styles.limeBorderLeft]}>
                <Text style={styles.nudgeText}>⚡ You haven't logged lunch yet. Stay fueled!</Text>
            </Card>

            {/* Burnout Alert */}
            <Card style={[styles.nudgeCard, styles.dangerBorderLeft, { marginTop: 15 }]}>
                <View style={styles.alertHeader}>
                    <Text style={styles.alertText}>
                        <Feather name="alert-triangle" color={COLORS.danger} size={16} /> Moderate burnout risk detected — low activity for 5 days.
                    </Text>
                    <Feather name="x" color={COLORS.muted} size={20} />
                </View>
            </Card>

            {/* Quick Log Row */}
            <View style={styles.quickLogRow}>
                <TouchableOpacity style={styles.quickLogBtn} onPress={() => navigation.navigate('Nutrition', { screen: 'MealLogScreen' })}>
                    <Text style={styles.quickLogText}>+ Meal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickLogBtn} onPress={() => navigation.navigate('Activity', { screen: 'ActivityLogScreen' })}>
                    <Text style={styles.quickLogText}>+ Workout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickLogBtn} onPress={() => navigation.navigate('Mood', { screen: 'MoodCheckInScreen' })}>
                    <Text style={styles.quickLogText}>+ Mood</Text>
                </TouchableOpacity>
            </View>

            {/* 7-Day Trend */}
            <Text style={globalStyles.sectionLabel}>This Week</Text>
            <LineChart
                data={{
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [{ data: mockTrend }]
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
                    propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.accent },
                    propsForBackgroundLines: { stroke: COLORS.cardBorder }
                }}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={false}
            />

            <TouchableOpacity onPress={() => navigation.navigate('WellnessInsightScreen')}>
                <Text style={styles.viewFullText}>View Full Insights →</Text>
            </TouchableOpacity>

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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        ...globalStyles.heading,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#0E0E0E',
        fontWeight: 'bold',
        fontSize: 18,
    },
    heroCard: {
        alignItems: 'center',
        marginBottom: 20,
    },
    ringContainer: {
        marginVertical: 15,
    },
    ringInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringScore: {
        fontSize: 42,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    ringMax: {
        fontSize: 16,
        color: COLORS.muted,
    },
    statusText: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    dimensionScroll: {
        marginBottom: 20,
    },
    dimensionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 15,
        marginRight: 10,
        alignItems: 'center',
        minWidth: 90,
    },
    dimensionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    dimensionLabel: {
        color: COLORS.muted,
        fontSize: 12,
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#0E0E0E',
        fontWeight: 'bold',
        fontSize: 12,
    },
    nudgeCard: {
        padding: 15,
    },
    limeBorderLeft: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
    },
    dangerBorderLeft: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },
    nudgeText: {
        color: COLORS.white,
        fontSize: 14,
        lineHeight: 20,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    alertText: {
        color: COLORS.danger,
        fontSize: 14,
        flex: 1,
        marginRight: 10,
        lineHeight: 20,
    },
    quickLogRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        marginBottom: 25,
    },
    quickLogBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 50,
        paddingVertical: 10,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    quickLogText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 14,
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
    viewFullText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    }
});

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import VitaLogo from '../../components/VitaLogo';

const screenWidth = Dimensions.get('window').width;

const ACTIVITIES = {
    'HIIT Training': 'activity', 'Morning Run': 'trending-up', 'Vinyasa Yoga': 'wind',
    'Weight Training': 'target', 'Running': 'trending-up', 'Yoga': 'wind',
    'Gym': 'target', 'Cycling': 'navigation', 'Walk': 'map-pin', 'Sport': 'award',
};

export default function ActivityHomeScreen({ navigation }) {
    const [dailyMinutes, setDailyMinutes] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [streak, setStreak] = useState(0);
    const [consistencyScore, setConsistencyScore] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const res = await api.get('/api/student/activity/weekly');
            setDailyMinutes(res.data.dailyMinutes || [0, 0, 0, 0, 0, 0, 0]);
            setStreak(res.data.streak || 0);
            setConsistencyScore(res.data.consistencyScore || 0);
            setRecentActivities(res.data.recentActivities || []);
        } catch (e) { }
    };

    const handleDeleteActivity = (activity) => {
        if (activity.id?.toString().startsWith('f')) return; // skip fallback items
        Alert.alert(
            'Delete Workout',
            `Remove "${activity.type}" from your history?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/api/student/activity/${activity.id}`);
                            fetchData(); // refresh list
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete activity.');
                        }
                    }
                }
            ]
        );
    };

    const totalSteps = dailyMinutes.reduce((a, b) => a + b, 0) * 200;
    const cLabel = consistencyScore >= 70 ? 'Resilient' : consistencyScore >= 40 ? 'Building' : 'Starting';

    const fallback = [
        { id: 'f1', type: 'HIIT Training', duration: '30 min', date: 'Yesterday' },
        { id: 'f2', type: 'Morning Run', duration: '45 min', date: '2 days ago' },
        { id: 'f3', type: 'Vinyasa Yoga', duration: '60 min', date: '3 days ago' },
    ];
    const activities = recentActivities.length > 0 ? recentActivities : fallback;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Header */}
                <View style={styles.headerRow}>
                    <VitaLogo size={22} fontSize={15} />
                    <Text style={styles.headerBadge}>Intelligence</Text>
                </View>

                {/* Streak */}
                <GlassCard glow style={styles.streakCard}>
                    <View style={styles.streakRow}>
                        <View style={styles.streakIconCircle}>
                            <Feather name="trending-up" size={20} color={COLORS.warning} />
                        </View>
                        <View>
                            <Text style={styles.streakTitle}>{streak > 0 ? streak : 15} Day Streak</Text>
                            <Text style={styles.streakSub}>Keep the momentum going!</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Steps */}
                <Text style={globalStyles.sectionLabel}>WEEKLY ACTIVITY</Text>
                <GlassCard style={styles.stepsCard}>
                    <View style={styles.stepsRow}>
                        <View style={styles.stepsIconCircle}>
                            <Feather name="activity" size={22} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.stepsVal}>{totalSteps > 0 ? totalSteps.toLocaleString() : '64,200'}</Text>
                            <Text style={styles.stepsSub}>Steps This Week</Text>
                        </View>
                    </View>
                    <View style={styles.conBadge}>
                        <Text style={styles.conText}>{cLabel}</Text>
                    </View>
                </GlassCard>

                {/* Chart */}
                <GlassCard noPad style={styles.chartWrap}>
                    <BarChart
                        data={{
                            labels: ["M", "T", "W", "T", "F", "S", "S"],
                            datasets: [{ data: dailyMinutes.map(d => d || 0) }],
                        }}
                        width={screenWidth - 56}
                        height={175}
                        yAxisSuffix="m"
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
                        showBarTops={false}
                        flatColor={true}
                    />
                </GlassCard>

                {/* Recent Workouts */}
                <Text style={[globalStyles.sectionLabel, { marginTop: 24 }]}>RECENT WORKOUTS</Text>
                <GlassCard noPad>
                    {activities.map((act, idx) => (
                        <TouchableOpacity
                            key={act.id}
                            onPress={() => act.id?.toString().startsWith('f') ? null : navigation.navigate('ActivityDetailScreen', { activity: act })}
                            onLongPress={() => handleDeleteActivity(act)}
                        >
                            <View style={[styles.actRow, idx < activities.length - 1 && styles.actBorder]}>
                                <View style={styles.actLeft}>
                                    <View style={styles.actIcon}>
                                        <Feather name={ACTIVITIES[act.type] || 'activity'} size={18} color={COLORS.accent} />
                                    </View>
                                    <View>
                                        <Text style={styles.actName}>{act.type}</Text>
                                        <Text style={styles.actMeta}>{act.duration} · {act.date}</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </GlassCard>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ActivityLogScreen')}
                activeOpacity={0.85}
            >
                <Feather name="plus" size={26} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
    headerBadge: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '500' },
    streakCard: { marginBottom: 20, borderLeftWidth: 3, borderLeftColor: COLORS.warning },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    streakIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 170, 44, 0.12)', justifyContent: 'center', alignItems: 'center' },
    streakTitle: { color: COLORS.warning, fontWeight: '700', fontSize: 18 },
    streakSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
    stepsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    stepsRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    stepsIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center' },
    stepsVal: { color: COLORS.white, fontSize: 28, fontWeight: '700', letterSpacing: -1 },
    stepsSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
    conBadge: { backgroundColor: COLORS.accentGlow, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.accentGlowMed },
    conText: { color: COLORS.accent, fontWeight: '700', fontSize: 12 },
    chartWrap: { marginTop: 4 },
    actRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
    actBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    actLeft: { flexDirection: 'row', alignItems: 'center' },
    actIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    actName: { color: COLORS.white, fontSize: 15, fontWeight: '600', marginBottom: 2 },
    actMeta: { color: COLORS.textSecondary, fontSize: 13 },
    fab: {
        position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29,
        backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14 },
            android: { elevation: 8 },
        }),
    },
});

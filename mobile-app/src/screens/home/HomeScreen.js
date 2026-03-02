import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import { mockPWS, mockTrend } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const FocusCard = ({ icon, label, score, color }) => (
    <View style={styles.focusCard}>
        <View style={[styles.focusIconCircle, { backgroundColor: color + '18' }]}>
            <Feather name={icon} size={18} color={color} />
        </View>
        <Text style={styles.focusLabel}>{label}</Text>
        <Text style={[styles.focusScore, { color }]}>{score}</Text>
    </View>
);

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const s = await AsyncStorage.getItem('userInfo');
                if (s) setUser(JSON.parse(s));
            } catch (e) { }
        };
        loadUser();
    }, []);

    const name = user?.firstName || 'User';
    const initials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
    const scoreLabel = mockPWS.score >= 70 ? 'Steady Growth' : mockPWS.score >= 50 ? 'Building Up' : 'Getting Started';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

            {/* ── Header ── */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.greeting}>Hey, {name} <Text style={{ fontSize: 20 }}>👋</Text></Text>
                    <Text style={styles.dateSub}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                </View>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
            </View>

            {/* ── Wellness Score Card ── */}
            <GlassCard glow style={styles.heroCard}>
                <View style={styles.heroRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.heroLabel}>WELLNESS SCORE</Text>
                        <Text style={styles.heroTitle}>{scoreLabel}</Text>
                    </View>
                    <AnimatedCircularProgress
                        size={78}
                        width={6}
                        fill={mockPWS.score}
                        tintColor={COLORS.accent}
                        backgroundColor={COLORS.border}
                        rotation={270}
                        lineCap="round"
                    >
                        {() => <Text style={styles.ringVal}>{mockPWS.score}</Text>}
                    </AnimatedCircularProgress>
                </View>
            </GlassCard>

            {/* ── Focus Areas ── */}
            <Text style={globalStyles.sectionLabel}>FOCUS AREAS</Text>
            <View style={styles.focusRow}>
                <FocusCard icon="heart" label="Nutrition" score={mockPWS.nutrition} color={COLORS.success} />
                <FocusCard icon="zap" label="Activity" score={mockPWS.activity} color={COLORS.warning} />
                <FocusCard icon="smile" label="Mood" score={mockPWS.mood} color={COLORS.accent} />
            </View>

            {/* ── Smart Nudge ── */}
            <GlassCard style={styles.nudgeCard}>
                <View style={styles.nudgeRow}>
                    <View style={styles.nudgeIcon}>
                        <Feather name="zap" size={16} color={COLORS.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nudgeTitle}>Smart Nudge</Text>
                        <Text style={styles.nudgeText}>
                            You're close to your daily Protein target. A quick bite from the mess could help.
                        </Text>
                    </View>
                </View>
            </GlassCard>

            <View style={styles.quickRow}>
                <TouchableOpacity style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}
                    onPress={() => navigation.navigate('Home', { screen: 'EnvironmentHubScreen' })}>
                    <LinearGradient colors={[COLORS.accentGlow, COLORS.accent]} style={styles.quickBtn}>
                        <Feather name="map" size={16} color="#FFF" />
                        <Text style={styles.quickText}>Campus Zones</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}
                    onPress={() => navigation.navigate('Home', { screen: 'WellnessEventsScreen' })}>
                    <LinearGradient colors={[COLORS.success + '80', COLORS.success]} style={styles.quickBtn}>
                        <Feather name="users" size={16} color="#FFF" />
                        <Text style={styles.quickText}>Wellness Events</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* ── 7-Day Trend ── */}
            <Text style={globalStyles.sectionLabel}>7-DAY TREND</Text>
            <GlassCard noPad style={styles.chartWrap}>
                <LineChart
                    data={{
                        labels: ["M", "T", "W", "T", "F", "S", "S"],
                        datasets: [{ data: mockTrend }],
                    }}
                    width={screenWidth - 56}
                    height={195}
                    chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: COLORS.cardSolid,
                    backgroundGradientTo: COLORS.cardSolid,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(163, 230, 53, ${opacity})`,
                    labelColor: () => COLORS.textMuted,
                    style: { borderRadius: 20 },
                    propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.accent },
                    propsForBackgroundLines: { stroke: COLORS.border },
                    }}
                    bezier
                    style={{ borderRadius: 20, padding: 8 }}
                    withInnerLines={true}
                    withOuterLines={false}
                />
            </GlassCard>

            <TouchableOpacity onPress={() => navigation.navigate('WellnessInsightScreen')} style={styles.linkRow}>
                <Text style={styles.linkText}>View Full Insights</Text>
                <Feather name="arrow-right" size={15} color={COLORS.accent} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    greeting: { color: COLORS.white, fontWeight: '700', fontSize: 24, letterSpacing: -0.5 },
    dateSub: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
    avatar: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: COLORS.accent,
        justifyContent: 'center', alignItems: 'center',
        ...Platform.select({ ios: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } }),
    },
    avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
    heroCard: { marginBottom: 0 },
    heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    heroLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
    heroTitle: { color: COLORS.white, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
    ringVal: { fontSize: 22, fontWeight: '700', color: COLORS.white },
    focusRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    focusCard: {
        flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
        alignItems: 'center', borderWidth: 1, borderColor: COLORS.glassBorder,
    },
    focusIconCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    focusLabel: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 6 },
    focusScore: { fontWeight: '700', fontSize: 18 },
    nudgeCard: { marginBottom: 20, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
    nudgeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    nudgeIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center' },
    nudgeTitle: { color: COLORS.white, fontWeight: '700', fontSize: 14, marginBottom: 4 },
    nudgeText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
    quickRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
    quickBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 15 },
    quickText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
    chartWrap: { marginTop: 4 },
    linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 10 },
    linkText: { color: COLORS.accent, fontWeight: '700', fontSize: 15 },
});

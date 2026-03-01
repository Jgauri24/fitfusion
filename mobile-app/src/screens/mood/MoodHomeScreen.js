import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import VitaLogo from '../../components/VitaLogo';
import { mockMoodTrend, mockJournals } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const MOODS = [
    { icon: 'frown', label: 'Low', color: COLORS.danger },
    { icon: 'meh', label: 'Meh', color: COLORS.warning },
    { icon: 'minus-circle', label: 'OK', color: COLORS.textSecondary },
    { icon: 'smile', label: 'Good', color: COLORS.info },
    { icon: 'sun', label: 'Great', color: COLORS.success },
];

export default function MoodHomeScreen({ navigation }) {
    const [todayMood, setTodayMood] = useState(null);
    const [moodTrend, setMoodTrend] = useState(mockMoodTrend);
    const [journals, setJournals] = useState(mockJournals);

    useFocusEffect(
        useCallback(() => {
            const fetchMood = async () => {
                try {
                    const res = await api.get('/api/student/mood/dashboard');
                    if (res.data.todayMood) setTodayMood(res.data.todayMood);
                    if (res.data.weeklyTrend?.length) setMoodTrend(res.data.weeklyTrend);
                    if (res.data.journals?.length) setJournals(res.data.journals);
                } catch (e) {}
            };
            fetchMood();
        }, [])
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={styles.scroll}>

            {/* Header */}
            <View style={styles.header}>
                <VitaLogo size={22} fontSize={15} />
            </View>

            <Text style={styles.heroTitle}>How are you feeling?</Text>
            <Text style={styles.heroSub}>Share your daily campus wellness pulse.</Text>

            {/* Mood Selector */}
            <View style={styles.moodRow}>
                {MOODS.map((m, i) => {
                    const selected = todayMood === (i + 1);
                    return (
                        <TouchableOpacity
                            key={m.label}
                            style={[styles.moodCircle, selected && styles.moodSelected]}
                            onPress={() => navigation.navigate('MoodCheckInScreen', { preSelectedMood: i + 1 })}
                            activeOpacity={0.75}
                        >
                            <Feather name={m.icon} size={24} color={selected ? COLORS.accent : COLORS.textSecondary} />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Mood Legend */}
            <Text style={globalStyles.sectionLabel}>MOODS</Text>
            <GlassCard noPad style={styles.moodList}>
                {MOODS.map((m, i) => (
                    <View key={m.label} style={[styles.moodItem, i < MOODS.length - 1 && styles.moodItemBorder]}>
                        <View style={[styles.moodItemIcon, { backgroundColor: m.color + '15' }]}>
                            <Feather name={m.icon} size={16} color={m.color} />
                        </View>
                        <Text style={styles.moodItemLabel}>{m.label}</Text>
                        <Text style={styles.moodItemDesc}>
                            {['Feeling down', 'Neutral', 'Alright', 'Feeling good', 'Feeling great'][i]}
                        </Text>
                    </View>
                ))}
            </GlassCard>

            {/* Trend Chart */}
            <Text style={globalStyles.sectionLabel}>7-DAY MOOD TREND</Text>
            <GlassCard noPad style={{ marginBottom: 16 }}>
                <LineChart
                    data={{
                        labels: ["M", "T", "W", "T", "F", "S", "S"],
                        datasets: [{ data: moodTrend }],
                    }}
                    width={screenWidth - 56}
                    height={180}
                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: COLORS.cardSolid,
                        backgroundGradientTo: COLORS.cardSolid,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(45, 127, 249, ${opacity})`,
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

            {/* Recent Journals */}
            <Text style={globalStyles.sectionLabel}>RECENT JOURNALS</Text>
            <GlassCard noPad>
                {journals.map((j, idx) => (
                    <TouchableOpacity
                        key={j.id}
                        onPress={() => navigation.navigate('JournalViewScreen', { journal: j })}
                    >
                        <View style={[styles.journalRow, idx < journals.length - 1 && styles.journalBorder]}>
                            <View style={styles.journalLeft}>
                                <View style={styles.journalIcon}>
                                    <Feather name="book-open" size={16} color={COLORS.accent} />
                                </View>
                                <View>
                                    <Text style={styles.journalTitle}>{j.title}</Text>
                                    <Text style={styles.journalDate}>{j.date}</Text>
                                </View>
                            </View>
                            <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
                        </View>
                    </TouchableOpacity>
                ))}
            </GlassCard>

            <TouchableOpacity onPress={() => navigation.navigate('MoodCheckInScreen')} style={styles.linkRow}>
                <Text style={styles.linkText}>Full Mood Check-In</Text>
                <Feather name="arrow-right" size={15} color={COLORS.accent} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
    header: { marginBottom: 24 },
    heroTitle: { color: COLORS.white, fontSize: 24, fontWeight: '700', marginBottom: 6, letterSpacing: -0.5 },
    heroSub: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 24 },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
    moodCircle: {
        flex: 1, height: 60, borderRadius: 18,
        borderWidth: 1.5, borderColor: COLORS.glassBorder,
        backgroundColor: COLORS.card,
        justifyContent: 'center', alignItems: 'center',
    },
    moodSelected: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.accentGlow,
    },
    moodList: { marginBottom: 20 },
    moodItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    moodItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    moodItemIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    moodItemLabel: { color: COLORS.white, fontWeight: '600', fontSize: 14, width: 50 },
    moodItemDesc: { color: COLORS.textSecondary, fontSize: 13 },
    journalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
    journalBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    journalLeft: { flexDirection: 'row', alignItems: 'center' },
    journalIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    journalTitle: { color: COLORS.white, fontSize: 14, fontWeight: '600', marginBottom: 2 },
    journalDate: { color: COLORS.textSecondary, fontSize: 12 },
    linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 10 },
    linkText: { color: COLORS.accent, fontWeight: '700', fontSize: 15 },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { TOP_PADDING } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import VitaLogo from '../../components/VitaLogo';

export default function AboutScreen({ navigation }) {
    return (
        <LinearGradient colors={['#080C06', '#0A1208', '#060A04']} style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>About VITA</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.logoContainer}>
                    <View style={styles.glow} />
                    <VitaLogo size={54} fontSize={32} layout="column" showSubtitle={true} />
                    <Text style={styles.versionBadge}>v1.0.0</Text>
                </View>

                <GlassCard style={styles.card}>
                    <Text style={styles.desc}>
                        VITA is a context-aware campus wellness ecosystem designed to integrate seamlessly
                        into your university life. Track nutrition, build activity streaks, and monitor
                        mood stability to maintain a balanced lifestyle.
                    </Text>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Text style={styles.sectionTitle}>Key Features</Text>
                    <View style={styles.featureRow}>
                        <Feather name="activity" size={18} color={COLORS.accent} />
                        <Text style={styles.featureText}>Smart Activity Tracking</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Feather name="pie-chart" size={18} color={COLORS.accent} />
                        <Text style={styles.featureText}>Nutrition Logging</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Feather name="smile" size={18} color={COLORS.accent} />
                        <Text style={styles.featureText}>Daily Mood Analysis</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <Feather name="shield" size={18} color={COLORS.accent} />
                        <Text style={styles.featureText}>Privacy First Architecture</Text>
                    </View>
                </GlassCard>

                <View style={styles.footer}>
                    <Text style={styles.credits}>Engineering & Design by{'\n'}Team TLE, Rishihood University</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: TOP_PADDING, paddingBottom: 20 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    scroll: { paddingHorizontal: 20, paddingBottom: 60 },
    logoContainer: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
    glow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: COLORS.accentGlowMed, top: -20 },
    versionBadge: { color: COLORS.textAccent, fontSize: 13, fontWeight: '700', marginTop: 12, backgroundColor: 'rgba(163, 230, 53, 0.1)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, overflow: 'hidden' },
    card: { marginBottom: 20 },
    desc: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 24, textAlign: 'center' },
    sectionTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 16 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    featureText: { color: COLORS.textPrimary, fontSize: 15 },
    footer: { alignItems: 'center', marginTop: 20 },
    credits: { color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
});

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import { GlassCard } from '../../components/GlassCard';

const MenuItem = ({ icon, label, onPress, color }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: (color || COLORS.accent) + '15' }]}>
                    <Feather name={icon} size={18} color={color || COLORS.accent} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={COLORS.textMuted} />
        </View>
    </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try {
                    const s = await AsyncStorage.getItem('userInfo');
                    if (s) setUser(JSON.parse(s));
                } catch (e) { }
            };
            load();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        navigation.replace('LoginScreen');
    };

    const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
    const initials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
    const email = user?.email || 'user@university.edu';

    // BMI Calculation
    let bmiValue = '--';
    let bmiLabel = 'Calculate in Setup';
    let bmiColor = COLORS.textMuted;

    if (user?.weight && user?.height) {
        const h = Number(user.height) / 100; // cm to m
        const w = Number(user.weight);
        if (h > 0 && w > 0) {
            const bmi = w / (h * h);
            bmiValue = bmi.toFixed(1);
            if (bmi < 18.5) { bmiLabel = 'Underweight'; bmiColor = COLORS.warning; }
            else if (bmi < 25) { bmiLabel = 'Normal Weight'; bmiColor = COLORS.success; }
            else if (bmi < 30) { bmiLabel = 'Overweight'; bmiColor = COLORS.warning; }
            else { bmiLabel = 'Obese'; bmiColor = COLORS.danger; }
        }
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={styles.scroll}>
            <Text style={styles.pageTitle}>Profile</Text>

            {/* Avatar + Info */}
            <View style={styles.profileCenter}>
                <View style={styles.avatarLarge}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userEmail}>{email}</Text>
                <Text style={styles.userSub}>{user?.branch || 'Department'} • {user?.hostel || 'Hostel'}</Text>
            </View>

            {/* BMI Calculator Card */}
            <GlassCard glow style={styles.bmiCard}>
                <View style={styles.bmiHeader}>
                    <View style={styles.bmiIconBox}>
                        <Feather name="activity" size={18} color={COLORS.accent} />
                    </View>
                    <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
                </View>
                <View style={styles.bmiRow}>
                    <View style={styles.bmiScoreBox}>
                        <Text style={styles.bmiScore}>{bmiValue}</Text>
                        <Text style={[styles.bmiLabel, { color: bmiColor }]}>{bmiLabel}</Text>
                    </View>
                    <View style={styles.bmiStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{user?.weight || '--'}<Text style={styles.statUnit}>kg</Text></Text>
                            <Text style={styles.statName}>Weight</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statVal}>{user?.height || '--'}<Text style={styles.statUnit}>cm</Text></Text>
                            <Text style={styles.statName}>Height</Text>
                        </View>
                    </View>
                </View>
            </GlassCard>

            {/* Demographics */}
            <View style={styles.demoGrid}>
                <GlassCard style={styles.demoBox} noPad>
                    <View style={{ padding: 16, alignItems: 'center' }}>
                        <Text style={styles.demoTitle}>Age</Text>
                        <Text style={styles.demoVal}>{user?.age || '--'}</Text>
                    </View>
                </GlassCard>
                <GlassCard style={styles.demoBox} noPad>
                    <View style={{ padding: 16, alignItems: 'center' }}>
                        <Text style={styles.demoTitle}>Gender</Text>
                        <Text style={styles.demoVal}>{user?.gender || '--'}</Text>
                    </View>
                </GlassCard>
                <GlassCard style={styles.demoBox} noPad>
                    <View style={{ padding: 16, alignItems: 'center' }}>
                        <Text style={styles.demoTitle}>Level</Text>
                        <Text style={[styles.demoVal, { fontSize: 13, marginTop: 4 }]}>{user?.fitnessLevel || '--'}</Text>
                    </View>
                </GlassCard>
            </View>

            {/* Menu */}
            <GlassCard noPad style={styles.menuCard}>
                <MenuItem icon="edit-3" label="Edit Profile" color={COLORS.success}
                    onPress={() => navigation.navigate('ProfileSetup', { isEditMode: true })} />
                <MenuItem icon="heart" label="Wellness Insights" color={COLORS.danger}
                    onPress={() => navigation.navigate('Home', { screen: 'WellnessInsightScreen' })} />
                <MenuItem icon="calendar" label="Mood Tracker" color={COLORS.accent}
                    onPress={() => navigation.navigate('Mood', { screen: 'MoodHomeScreen' })} />
                <MenuItem icon="bell" label="Smart Reminders" color={COLORS.warning}
                    onPress={() => navigation.navigate('NotificationSettingsScreen')} />
                <MenuItem icon="shield" label="Privacy & Security" color={COLORS.success}
                    onPress={() => navigation.navigate('AboutScreen')} />
            </GlassCard>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Feather name="log-out" size={16} color={COLORS.danger} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
    pageTitle: { color: COLORS.white, fontSize: 24, fontWeight: '700', marginBottom: 32, letterSpacing: -0.5 },
    profileCenter: { alignItems: 'center', marginBottom: 36 },
    avatarLarge: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16 },
            android: { elevation: 10 },
        }),
    },
    avatarText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
    userName: { color: COLORS.white, fontSize: 22, fontWeight: '700', marginBottom: 4 },
    userEmail: { color: COLORS.textSecondary, fontSize: 14 },
    menuCard: { marginBottom: 28 },
    menuItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 16, paddingHorizontal: 18,
        borderBottomWidth: 1, borderBottomColor: COLORS.divider,
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    menuIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    menuLabel: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderWidth: 1, borderColor: COLORS.danger + '40', borderRadius: 14, paddingVertical: 15,
        backgroundColor: COLORS.danger + '08',
    },
    logoutText: { color: COLORS.danger, fontWeight: '700', fontSize: 16 },

    userSub: { color: COLORS.accent, fontSize: 13, fontWeight: '600', marginTop: 8, textTransform: 'uppercase' },

    bmiCard: { marginBottom: 20, padding: 20 },
    bmiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    bmiIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.accent + '15', justifyContent: 'center', alignItems: 'center' },
    bmiTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    bmiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bmiScoreBox: { flex: 1 },
    bmiScore: { color: COLORS.white, fontSize: 38, fontWeight: '800', letterSpacing: -1 },
    bmiLabel: { fontSize: 14, fontWeight: '600', marginTop: 4 },
    bmiStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.glassBorder },
    statItem: { alignItems: 'center', minWidth: 50 },
    statVal: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    statUnit: { fontSize: 11, color: COLORS.textMuted, fontWeight: 'normal' },
    statName: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
    statDivider: { width: 1, height: 30, backgroundColor: COLORS.glassBorder, marginHorizontal: 12 },

    demoGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    demoBox: { flex: 1 },
    demoTitle: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
    demoVal: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});

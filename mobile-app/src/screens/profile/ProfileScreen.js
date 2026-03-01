import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
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

    useEffect(() => {
        const load = async () => {
            try {
                const s = await AsyncStorage.getItem('userInfo');
                if (s) setUser(JSON.parse(s));
            } catch (e) {}
        };
        load();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        navigation.replace('LoginScreen');
    };

    const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
    const initials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
    const email = user?.email || 'user@university.edu';

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
            </View>

            {/* Menu */}
            <GlassCard noPad style={styles.menuCard}>
                <MenuItem icon="heart" label="Health Insights" color={COLORS.danger}
                    onPress={() => navigation.navigate('Home', { screen: 'WellnessInsightScreen' })} />
                <MenuItem icon="calendar" label="Wellness Calendar" color={COLORS.accent}
                    onPress={() => {}} />
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
});

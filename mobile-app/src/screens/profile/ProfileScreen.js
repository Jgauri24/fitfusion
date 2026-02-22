import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockUser } from '../../constants/mockData';

const StatCard = ({ value, label }) => (
    <View style={styles.statCard}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const MenuListItem = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity onPress={onPress}>
        <Card style={styles.menuItem}>
            <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{icon}</Text>
                <Text style={[styles.menuLabel, danger && { color: COLORS.danger }]}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={danger ? COLORS.danger : COLORS.muted} />
        </Card>
    </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userInfoStr = await AsyncStorage.getItem('userInfo');
                if (userInfoStr) {
                    setUser(JSON.parse(userInfoStr));
                }
            } catch (error) {
                console.error("Failed to load user info", error);
            }
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out of VITA?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.clear();
                        navigation.replace('LoginScreen');
                    }
                }
            ]
        );
    };

    const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User';
    const initials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
    const email = user?.email || 'Student';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <View style={styles.avatarLarge}>
                    <Text style={styles.avatarTextLarge}>{initials}</Text>
                </View>
                <Text style={styles.userName}>{fullName}</Text>
                <Text style={styles.userDetails}>{email}</Text>
            </View>

            <View style={styles.statsRow}>
                <StatCard value="34" label="Meals" />
                <StatCard value="12" label="Workouts" />
                <StatCard value="7" label="Journals" />
            </View>

            <Text style={[globalStyles.sectionLabel, { marginTop: 30 }]}>SETTINGS</Text>
            <View style={styles.menuList}>
                <MenuListItem
                    icon="🔔"
                    label="Notification Preferences"
                    onPress={() => navigation.navigate('NotificationSettingsScreen')}
                />
                <MenuListItem
                    icon="🔒"
                    label="Privacy & Data"
                    onPress={() => Alert.alert('Privacy Info', 'Static screen placeholder.')}
                />
                <MenuListItem
                    icon="ℹ️"
                    label="About VITA"
                    onPress={() => navigation.navigate('AboutScreen')}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarTextLarge: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0E0E0E',
    },
    userName: {
        ...globalStyles.heading,
        fontSize: 24,
        marginBottom: 5,
    },
    userDetails: {
        color: COLORS.muted,
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    statValue: {
        color: COLORS.accent,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: COLORS.muted,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    menuList: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    menuLabel: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 40,
        marginBottom: 20,
    },
    logoutBtn: {
        paddingVertical: 15,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.danger,
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

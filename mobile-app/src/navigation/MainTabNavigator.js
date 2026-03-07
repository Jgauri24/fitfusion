import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, PanResponder, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeStack, NutritionStack, ActivityStack, MoodStack, ProfileStack } from './NestedStacks';

const Tab = createBottomTabNavigator();
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const FAB_SIZE = 54;

// ── Draggable Chat FAB (clamped to screen) ──
const FloatingChatButton = () => {
    const navigation = useNavigation();

    // Track absolute position (start bottom-right)
    const posX = useRef(SCREEN_W - FAB_SIZE - 16);
    const posY = useRef(SCREEN_H - FAB_SIZE - 100);
    const animX = useRef(new Animated.Value(posX.current)).current;
    const animY = useRef(new Animated.Value(posY.current)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gs) =>
                Math.abs(gs.dx) > 8 || Math.abs(gs.dy) > 8,
            onPanResponderMove: (_, gs) => {
                // Calculate new position clamped to screen
                const nx = Math.max(8, Math.min(SCREEN_W - FAB_SIZE - 8, posX.current + gs.dx));
                const ny = Math.max(40, Math.min(SCREEN_H - FAB_SIZE - 100, posY.current + gs.dy));
                animX.setValue(nx);
                animY.setValue(ny);
            },
            onPanResponderRelease: (_, gs) => {
                // Save final position
                posX.current = Math.max(8, Math.min(SCREEN_W - FAB_SIZE - 8, posX.current + gs.dx));
                posY.current = Math.max(40, Math.min(SCREEN_H - FAB_SIZE - 100, posY.current + gs.dy));
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.fab, { left: animX, top: animY }]}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate('ChatScreen')}
                activeOpacity={0.85}
            >
                <LinearGradient
                    colors={[COLORS.accent, COLORS.accentDark]}
                    style={styles.fabGradient}
                >
                    <Feather name="message-circle" size={22} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ── Gender-based Profile Avatar for Tab Bar ──
const ProfileAvatar = ({ focused }) => {
    const [gender, setGender] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem('userInfo');
                if (raw) {
                    const u = JSON.parse(raw);
                    setGender(u.gender?.toLowerCase() || null);
                }
            } catch (_) { }
        })();
    }, []);

    // Generic avatar icon

    return (
        <View style={[styles.avatarWrap, focused && styles.avatarFocused]}>
            <Ionicons name="person" size={20} color={COLORS.white} />
        </View>
    );
};

export default function MainTabNavigator() {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 16,
                        left: 20,
                        right: 20,
                        backgroundColor: COLORS.surfaceElevated,
                        borderTopWidth: 0,
                        borderRadius: 28,
                        height: 68,
                        paddingBottom: 10,
                        paddingTop: 10,
                        borderWidth: 1,
                        borderColor: COLORS.glassBorder,
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -8 },
                                shadowOpacity: 0.40,
                                shadowRadius: 20,
                            },
                            android: { elevation: 12 },
                        }),
                    },
                    tabBarActiveTintColor: COLORS.accent,
                    tabBarInactiveTintColor: COLORS.textMuted,
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                        letterSpacing: 0.3,
                    },
                    tabBarIcon: ({ color, focused }) => {
                        if (route.name === 'Profile') {
                            return <ProfileAvatar focused={focused} />;
                        }

                        let iconName;
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Nutrition') iconName = 'heart';
                        else if (route.name === 'Activity') iconName = 'zap';
                        else if (route.name === 'Mood') iconName = 'smile';

                        return (
                            <View style={[styles.tabIconWrap, focused && styles.tabIconActive]}>
                                <Feather name={iconName} size={22} color={color} />
                            </View>
                        );
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Nutrition" component={NutritionStack} />
                <Tab.Screen name="Activity" component={ActivityStack} />
                <Tab.Screen name="Mood" component={MoodStack} />
                <Tab.Screen name="Profile" component={ProfileStack} />
            </Tab.Navigator>
            <FloatingChatButton />
        </View>
    );
}

const styles = StyleSheet.create({
    tabIconWrap: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
    },
    tabIconActive: {
        backgroundColor: COLORS.accentGlow,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
            },
        }),
    },
    avatarWrap: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: COLORS.glass,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarFocused: {
        backgroundColor: COLORS.accentGlow,
        borderColor: COLORS.accent,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            },
        }),
    },
    avatarEmoji: {
        fontSize: 18,
    },
    fab: {
        position: 'absolute',
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
            },
            android: { elevation: 10 },
        }),
    },
    fabGradient: {
        width: FAB_SIZE, height: FAB_SIZE, borderRadius: FAB_SIZE / 2,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.accentGlowMed,
    },
});

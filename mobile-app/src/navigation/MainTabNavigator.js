import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeStack, NutritionStack, ActivityStack, MoodStack, ProfileStack } from './NestedStacks';

const Tab = createBottomTabNavigator();

const FloatingChatButton = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={styles.fab}
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
                            android: {
                                elevation: 12,
                            },
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
                        let iconName;
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Nutrition') iconName = 'heart';
                        else if (route.name === 'Activity') iconName = 'zap';
                        else if (route.name === 'Mood') iconName = 'smile';
                        else if (route.name === 'Profile') iconName = 'user';

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
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 100,
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
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accentGlowMed,
    },
});

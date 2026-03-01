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
                        backgroundColor: COLORS.surface,
                        borderTopColor: COLORS.glassBorder,
                        borderTopWidth: 1,
                        paddingBottom: 6,
                        paddingTop: 6,
                        height: 64,
                        ...Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
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
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Nutrition') iconName = 'heart';
                        else if (route.name === 'Activity') iconName = 'zap';
                        else if (route.name === 'Mood') iconName = 'smile';
                        else if (route.name === 'Profile') iconName = 'user';

                        return <Feather name={iconName} size={22} color={color} />;
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 140,
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
            },
            android: { elevation: 8 },
        }),
    },
    fabGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

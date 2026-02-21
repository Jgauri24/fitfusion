import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

import { HomeStack, NutritionStack, ActivityStack, MoodStack, ProfileStack } from './NestedStacks';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.cardBorder,
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.muted,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Nutrition') iconName = 'coffee';
                    else if (route.name === 'Activity') iconName = 'zap';
                    else if (route.name === 'Mood') iconName = 'sun';
                    else if (route.name === 'Profile') iconName = 'user';

                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Nutrition" component={NutritionStack} />
            <Tab.Screen name="Activity" component={ActivityStack} />
            <Tab.Screen name="Mood" component={MoodStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

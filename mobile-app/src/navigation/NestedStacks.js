import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Home Stack
import HomeScreen from '../screens/home/HomeScreen';
import WellnessInsightScreen from '../screens/home/WellnessInsightScreen';
// Nutrition Stack
import NutritionHomeScreen from '../screens/nutrition/NutritionHomeScreen';
import MealLogScreen from '../screens/nutrition/MealLogScreen';
import NutritionHistoryScreen from '../screens/nutrition/NutritionHistoryScreen';
// Activity Stack
import ActivityHomeScreen from '../screens/activity/ActivityHomeScreen';
import ActivityLogScreen from '../screens/activity/ActivityLogScreen';
import ActivityDetailScreen from '../screens/activity/ActivityDetailScreen';
// Mood Stack
import MoodHomeScreen from '../screens/mood/MoodHomeScreen';
import MoodCheckInScreen from '../screens/mood/MoodCheckInScreen';
import JournalEntryScreen from '../screens/mood/JournalEntryScreen';
import JournalViewScreen from '../screens/mood/JournalViewScreen';
// Profile Stack
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import AboutScreen from '../screens/profile/AboutScreen';

import EnvironmentHubScreen from '../screens/home/EnvironmentHubScreen';
import WellnessEventsScreen from '../screens/home/WellnessEventsScreen';
// Chat
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createStackNavigator();

export const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WellnessInsightScreen" component={WellnessInsightScreen} />
        <Stack.Screen name="EnvironmentHubScreen" component={EnvironmentHubScreen} />
        <Stack.Screen name="WellnessEventsScreen" component={WellnessEventsScreen} />
        <Stack.Screen name="MealLogScreen" component={MealLogScreen} />
        <Stack.Screen name="ActivityLogScreen" component={ActivityLogScreen} />
        <Stack.Screen name="MoodCheckInScreen" component={MoodCheckInScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
);

export const NutritionStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NutritionHomeScreen" component={NutritionHomeScreen} />
        <Stack.Screen name="MealLogScreen" component={MealLogScreen} />
        <Stack.Screen name="NutritionHistoryScreen" component={NutritionHistoryScreen} />
    </Stack.Navigator>
);

export const ActivityStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ActivityHomeScreen" component={ActivityHomeScreen} />
        <Stack.Screen name="ActivityLogScreen" component={ActivityLogScreen} />
        <Stack.Screen name="ActivityDetailScreen" component={ActivityDetailScreen} />
    </Stack.Navigator>
);

export const MoodStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MoodHomeScreen" component={MoodHomeScreen} />
        <Stack.Screen name="MoodCheckInScreen" component={MoodCheckInScreen} />
        <Stack.Screen name="JournalEntryScreen" component={JournalEntryScreen} />
        <Stack.Screen name="JournalViewScreen" component={JournalViewScreen} />
    </Stack.Navigator>
);

export const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
);

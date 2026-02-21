import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';

const ToggleRow = ({ icon, label, value, onValueChange }) => (
    <Card style={styles.toggleRow}>
        <View style={styles.toggleLeft}>
            <Text style={styles.toggleIcon}>{icon}</Text>
            <Text style={styles.toggleLabel}>{label}</Text>
        </View>
        <Switch
            trackColor={{ false: COLORS.cardBorder, true: 'rgba(200, 255, 87, 0.3)' }}
            thumbColor={value ? COLORS.accent : COLORS.muted}
            ios_backgroundColor={COLORS.cardBorder}
            onValueChange={onValueChange}
            value={value}
        />
    </Card>
);

export default function NotificationSettingsScreen({ navigation }) {
    const [meals, setMeals] = useState(true);
    const [activity, setActivity] = useState(true);
    const [burnout, setBurnout] = useState(true);
    const [environment, setEnvironment] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Preferences</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={globalStyles.sectionLabel}>NOTIFICATIONS</Text>

                <ToggleRow
                    icon="🍽️"
                    label="Meal Reminders"
                    value={meals}
                    onValueChange={setMeals}
                />
                <ToggleRow
                    icon="⚡"
                    label="Activity Nudges"
                    value={activity}
                    onValueChange={setActivity}
                />
                <ToggleRow
                    icon="🚨"
                    label="Burnout Alerts"
                    value={burnout}
                    onValueChange={setBurnout}
                />
                <ToggleRow
                    icon="🌿"
                    label="Environmental Alerts"
                    value={environment}
                    onValueChange={setEnvironment}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: COLORS.bg,
    },
    title: {
        ...globalStyles.heading,
        fontSize: 20,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginBottom: 15,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    toggleLabel: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    }
});

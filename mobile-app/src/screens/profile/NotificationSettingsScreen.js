import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';

const ToggleRow = ({ iconName, iconColor, label, value, onValueChange, isLast }) => (
    <View style={[styles.toggleRow, !isLast && styles.toggleBorder]}>
        <View style={styles.toggleLeft}>
            <View style={[styles.toggleIcon, { backgroundColor: (iconColor || COLORS.accent) + '15' }]}>
                <Feather name={iconName} size={16} color={iconColor || COLORS.accent} />
            </View>
            <Text style={styles.toggleLabel}>{label}</Text>
        </View>
        <Switch
            trackColor={{ false: COLORS.border, true: COLORS.accentGlowStrong }}
            thumbColor={value ? COLORS.accent : COLORS.textMuted}
            ios_backgroundColor={COLORS.border}
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);

export default function NotificationSettingsScreen({ navigation }) {
    const [meals, setMeals] = useState(true);
    const [activity, setActivity] = useState(true);
    const [burnout, setBurnout] = useState(true);
    const [environment, setEnvironment] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Preferences</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.content}>
                <Text style={globalStyles.sectionLabel}>NOTIFICATIONS</Text>
                <GlassCard noPad>
                    <ToggleRow iconName="clock" iconColor={COLORS.accent} label="Meal Reminders" value={meals} onValueChange={setMeals} />
                    <ToggleRow iconName="zap" iconColor={COLORS.warning} label="Activity Nudges" value={activity} onValueChange={setActivity} />
                    <ToggleRow iconName="alert-triangle" iconColor={COLORS.danger} label="Burnout Alerts" value={burnout} onValueChange={setBurnout} />
                    <ToggleRow iconName="wind" iconColor={COLORS.success} label="Environmental Alerts" value={environment} onValueChange={setEnvironment} isLast />
                </GlassCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    content: { paddingHorizontal: 20, paddingTop: 10 },
    toggleRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 18,
    },
    toggleBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    toggleLeft: { flexDirection: 'row', alignItems: 'center' },
    toggleIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    toggleLabel: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
});

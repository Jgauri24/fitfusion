import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { GlassCard } from '../../components/GlassCard';

const ICONS = { 'Running': 'trending-up', 'Run': 'trending-up', 'Walk': 'map-pin', 'Yoga': 'wind', 'Gym': 'target', 'Cycle': 'navigation', 'Sport': 'award' };

const IntensityBadge = ({ intensity }) => {
    let color = COLORS.textMuted;
    if (intensity === 'High') color = COLORS.danger;
    if (intensity === 'Moderate') color = COLORS.warning;

    return (
        <View style={[styles.intBadge, { borderColor: color, backgroundColor: color + '12' }]}>
            <Text style={[styles.intText, { color }]}>{intensity}</Text>
        </View>
    );
};

export default function ActivityDetailScreen({ route, navigation }) {
    const activity = route?.params?.activity || {
        type: 'Running', duration: '30 min', intensity: 'Moderate', date: 'Yesterday',
    };

    const handleDelete = () => {
        Alert.alert('Delete Activity', 'Remove this log? This will update your weekly score.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Activity Details</Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Feather name="trash-2" size={18} color={COLORS.danger} />
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <View style={styles.bigIcon}>
                    <Feather name={ICONS[activity.type] || 'activity'} size={48} color={COLORS.accent} />
                </View>

                <Text style={styles.name}>{activity.type}</Text>
                <Text style={styles.dur}>{activity.duration}</Text>

                <IntensityBadge intensity={activity.intensity || 'Moderate'} />

                <GlassCard style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DATE</Text>
                        <Text style={styles.infoVal}>{activity.date}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>NOTES</Text>
                        <Text style={styles.infoVal}>Felt great today. Pushed a little harder on the last stretch.</Text>
                    </View>
                </GlassCard>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Feather name="trash-2" size={16} color={COLORS.danger} />
                    <Text style={styles.deleteTxt}>Delete Entry</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    body: { flex: 1, paddingHorizontal: 20, paddingTop: 36, alignItems: 'center' },
    bigIcon: {
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: COLORS.accentGlow, borderWidth: 1, borderColor: COLORS.accentGlowMed,
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        ...Platform.select({ ios: { shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 } }),
    },
    name: { color: COLORS.white, fontSize: 30, fontWeight: '700', marginBottom: 4, letterSpacing: -0.5 },
    dur: { color: COLORS.textSecondary, fontSize: 18, marginBottom: 20 },
    intBadge: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginBottom: 32 },
    intText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    infoCard: { width: '100%' },
    infoRow: { marginVertical: 8 },
    infoLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
    infoVal: { color: COLORS.white, fontSize: 15, lineHeight: 23 },
    divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 12 },
    footer: { padding: 20, paddingBottom: 40 },
    deleteBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 15, borderRadius: 14, borderWidth: 1, borderColor: COLORS.danger + '40',
        backgroundColor: COLORS.danger + '08',
    },
    deleteTxt: { color: COLORS.danger, fontWeight: '700', fontSize: 16 },
});

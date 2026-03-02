import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const StatusIndicator = ({ density }) => {
    let color = COLORS.success;
    let text = "Not Crowded";
    if (density === 'MEDIUM') { color = COLORS.warning; text = "Moderately Busy"; }
    if (density === 'HIGH') { color = COLORS.danger; text = "Very Crowded"; }

    return (
        <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text style={[styles.statusText, { color }]}>{text}</Text>
        </View>
    );
};

export default function EnvironmentHubScreen({ navigation }) {
    const [zones, setZones] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadZones = async () => {
        try {
            setError(null);
            const res = await api.get('/api/student/environment');
            setZones(res.data);
        } catch (err) {
            setError("Failed to monitor campus zones.");
        }
    };

    useEffect(() => {
        loadZones();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadZones();
        setRefreshing(false);
    };

    return (
        <LinearGradient colors={['#080C06', '#0A1208', '#060A04']} style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Campus Monitor</Text>
                <TouchableOpacity onPress={loadZones} style={styles.refreshBtn}>
                    <Feather name="refresh-cw" size={20} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
            >
                <Text style={styles.subtitle}>Check real-time crowd density and weather conditions before heading out.</Text>

                {error && (
                    <GlassCard style={{ borderColor: COLORS.danger, marginBottom: 20 }}>
                        <Text style={{ color: COLORS.danger, textAlign: 'center' }}>{error}</Text>
                    </GlassCard>
                )}

                {zones.length === 0 && !error && !refreshing && (
                    <View style={styles.emptyState}>
                        <Feather name="map-pin" size={40} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
                        <Text style={{ color: COLORS.textSecondary }}>No zones monitored currently.</Text>
                    </View>
                )}

                {zones.map((zone) => (
                    <GlassCard key={zone.id} glow style={styles.zoneCard}>
                        <View style={styles.zoneHeader}>
                            <Text style={styles.zoneName}>{zone.zone}</Text>
                            <StatusIndicator density={zone.crowdDensity} />
                        </View>

                        <View style={styles.metricsRow}>
                            <View style={styles.metric}>
                                <Feather name="thermometer" size={16} color={COLORS.textMuted} />
                                <Text style={styles.metricVal}>{zone.temperature ? `${zone.temperature}°C` : '--'}</Text>
                            </View>
                            <View style={styles.metric}>
                                <Feather name="droplet" size={16} color={COLORS.textMuted} />
                                <Text style={styles.metricVal}>{zone.humidity ? `${zone.humidity}%` : '--'}</Text>
                            </View>
                            <View style={styles.metric}>
                                <Feather name="cloud-drizzle" size={16} color={COLORS.textMuted} />
                                <Text style={styles.metricVal}>{zone.rainfall != null ? `${zone.rainfall}mm` : '--'}</Text>
                            </View>
                            <View style={styles.metric}>
                                <Feather name="wind" size={16} color={COLORS.textMuted} />
                                <Text style={styles.metricVal}>AQI {zone.aqi || '--'}</Text>
                            </View>
                        </View>
                        <Text style={styles.updateTime}>
                            Last updated: {new Date(zone.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </GlassCard>
                ))}

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    refreshBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
    scroll: { padding: 24, paddingBottom: 60 },
    subtitle: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22, marginBottom: 24 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    zoneCard: { padding: 20, marginBottom: 16 },
    zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    zoneName: { color: COLORS.white, fontSize: 18, fontWeight: '700', flex: 1, marginRight: 12 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    metricsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 16 },
    metric: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metricVal: { color: COLORS.white, fontSize: 13, fontWeight: '500' },
    updateTime: { color: COLORS.textMuted, fontSize: 11, textAlign: 'right', marginTop: 12 }
});

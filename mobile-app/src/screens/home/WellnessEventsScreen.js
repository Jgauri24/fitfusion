import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { GlassCard } from '../../components/GlassCard';

export default function WellnessEventsScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingEvent, setLoadingEvent] = useState(null);

    const loadEvents = async () => {
        try {
            const res = await api.get('/api/student/wellness/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEvents();
        setRefreshing(false);
    };

    const handleAction = async (eventId, action) => {
        setLoadingEvent(eventId);
        try {
            if (action === 'JOIN') {
                await api.post(`/api/student/wellness/${eventId}/join`);
                Alert.alert("Joined!", "You're confirmed for this wellness event.");
            } else {
                await api.delete(`/api/student/wellness/${eventId}/leave`);
                Alert.alert("Left", "You are no longer attending this event.");
            }
            await loadEvents();
        } catch (err) {
            Alert.alert("Notice", err.response?.data?.message || "Action failed.");
        } finally {
            setLoadingEvent(null);
        }
    };

    return (
        <LinearGradient colors={['#080C06', '#0A1208', '#060A04']} style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Wellness Circles</Text>
                <TouchableOpacity onPress={loadEvents} style={styles.refreshBtn}>
                    <Feather name="refresh-cw" size={20} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
            >
                <Text style={styles.subtitle}>Join upcoming campus wellness camps, sessions, and group workouts.</Text>

                {events.length === 0 && !refreshing && (
                    <View style={styles.emptyState}>
                        <Feather name="calendar" size={40} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
                        <Text style={{ color: COLORS.textSecondary }}>No events currently planned.</Text>
                    </View>
                )}

                {events.map((ev) => (
                    <GlassCard key={ev.id} glow={ev.hasJoined} style={styles.eventCard}>
                        {ev.hasJoined && (
                            <View style={styles.joinedBadge}>
                                <Feather name="check" size={12} color={COLORS.success} />
                                <Text style={styles.joinedText}>Attending</Text>
                            </View>
                        )}

                        <View style={styles.eventHeader}>
                            <View style={styles.typeIcon}>
                                <Feather name={ev.type === 'YOGA' ? 'wind' : ev.type === 'COUNSELING' ? 'smile' : 'activity'} size={18} color={COLORS.accent} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.eventName}>{ev.name}</Text>
                                <Text style={styles.eventType}>{ev.type}</Text>
                            </View>
                        </View>

                        <Text style={styles.eventDesc}>{ev.description}</Text>

                        <View style={styles.detailsRow}>
                            <View style={styles.detail}>
                                <Feather name="map-pin" size={14} color={COLORS.textMuted} />
                                <Text style={styles.detailText}>{ev.location || 'TBA'}</Text>
                            </View>
                            <View style={styles.detail}>
                                <Feather name="clock" size={14} color={COLORS.textMuted} />
                                <Text style={styles.detailText}>{ev.durationMins} min</Text>
                            </View>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.detail}>
                                <Feather name="calendar" size={14} color={COLORS.textMuted} />
                                <Text style={styles.detailText}>
                                    {new Date(ev.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={styles.detail}>
                                <Feather name="users" size={14} color={COLORS.textMuted} />
                                <Text style={styles.detailText}>{ev.participantsCount}{ev.maxCapacity ? `/${ev.maxCapacity}` : ''} Filled</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <TouchableOpacity
                            style={[
                                styles.actionBtn,
                                ev.hasJoined ? styles.btnLeave : styles.btnJoin,
                                (ev.maxCapacity && ev.participantsCount >= ev.maxCapacity && !ev.hasJoined) && styles.btnFull
                            ]}
                            disabled={loadingEvent === ev.id || (ev.maxCapacity && ev.participantsCount >= ev.maxCapacity && !ev.hasJoined)}
                            onPress={() => handleAction(ev.id, ev.hasJoined ? 'LEAVE' : 'JOIN')}
                        >
                            <Text style={[styles.actionBtnText, ev.hasJoined && { color: COLORS.danger }]}>
                                {loadingEvent === ev.id ? 'Wait...' : ev.hasJoined ? 'Leave Event' : (ev.maxCapacity && ev.participantsCount >= ev.maxCapacity) ? 'Event Full' : 'Join Event'}
                            </Text>
                        </TouchableOpacity>
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

    eventCard: { padding: 20, marginBottom: 16, position: 'relative' },
    joinedBadge: {
        position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.success + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14, gap: 4
    },
    joinedText: { color: COLORS.success, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

    eventHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    typeIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.accent + '20', justifyContent: 'center', alignItems: 'center' },
    eventName: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
    eventType: { color: COLORS.accent, fontSize: 13, fontWeight: '600', marginTop: 2 },

    eventDesc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 20 },

    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    detail: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },

    actionBtn: { width: '100%', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 12 },
    btnJoin: { backgroundColor: COLORS.accent },
    btnLeave: { backgroundColor: COLORS.danger + '15', borderWidth: 1, borderColor: COLORS.danger + '40' },
    btnFull: { backgroundColor: COLORS.textMuted + '80' },
    actionBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 }
});

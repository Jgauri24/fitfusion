import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const ACTIVITY_TYPES = [
    { id: '1', name: 'Run', icon: 'trending-up' },
    { id: '2', name: 'Walk', icon: 'map-pin' },
    { id: '3', name: 'Yoga', icon: 'wind' },
    { id: '4', name: 'Gym', icon: 'target' },
    { id: '5', name: 'Cycle', icon: 'navigation' },
    { id: '6', name: 'Sport', icon: 'award' },
];

export default function ActivityLogScreen({ navigation }) {
    const [selectedType, setSelectedType] = useState('1');
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState('Moderate');
    const [notes, setNotes] = useState('');

    const handleSave = async () => {
        const sel = ACTIVITY_TYPES.find(t => t.id === selectedType);
        const cal = intensity === 'High' ? duration * 10 : intensity === 'Moderate' ? duration * 7 : duration * 4;
        try {
            await api.post('/api/student/activity/log', {
                activityType: sel?.name || 'Unknown',
                durationMins: duration,
                caloriesBurned: cal,
            });
            Toast.show({ type: 'success', text1: 'Workout Saved', text2: 'Your activity streak is building!', position: 'bottom', bottomOffset: 100 });
            navigation.goBack();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save.', position: 'bottom' });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Log Workout</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                <Text style={globalStyles.sectionLabel}>ACTIVITY TYPE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                    {ACTIVITY_TYPES.map(type => {
                        const isSelected = selectedType === type.id;
                        return (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => setSelectedType(type.id)}
                                style={[styles.typePill, isSelected ? styles.typePillActive : styles.typePillInactive]}
                                activeOpacity={0.75}
                            >
                                <Feather name={type.icon} size={16} color={isSelected ? '#FFF' : COLORS.textSecondary} />
                                <Text style={[styles.typeName, { color: isSelected ? '#FFF' : COLORS.white }]}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <Text style={[globalStyles.sectionLabel, { marginTop: 36 }]}>DURATION</Text>
                <View style={styles.sliderWrap}>
                    <Text style={styles.durationBig}>{duration} <Text style={styles.durationUnit}>min</Text></Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={10}
                        maximumValue={120}
                        step={5}
                        value={duration}
                        onValueChange={setDuration}
                        minimumTrackTintColor={COLORS.accent}
                        maximumTrackTintColor={COLORS.border}
                        thumbTintColor={COLORS.accent}
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLbl}>10 min</Text>
                        <Text style={styles.sliderLbl}>120 min</Text>
                    </View>
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 36 }]}>INTENSITY</Text>
                <View style={styles.intensityRow}>
                    {['Low', 'Moderate', 'High'].map(level => {
                        const sel = intensity === level;
                        return (
                            <TouchableOpacity
                                key={level}
                                onPress={() => setIntensity(level)}
                                style={[styles.intensityBtn, sel && styles.intensityActive]}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.intensityText, sel && styles.intensityTextActive]}>{level}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 36 }]}>DATE</Text>
                <View style={styles.dateChip}>
                    <Feather name="calendar" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.dateText}>
                        Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 36 }]}>NOTES</Text>
                <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="How did it feel?"
                        placeholderTextColor={COLORS.textMuted}
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.85}
                    style={{ borderRadius: 14, overflow: 'hidden', marginTop: 36, marginBottom: 40 }}
                >
                    <LinearGradient
                        colors={[COLORS.accent, COLORS.accentDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.saveBtn}
                    >
                        <Text style={styles.saveBtnText}>Save Activity</Text>
                        <Feather name="check" size={18} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    scroll: { paddingHorizontal: 20, paddingBottom: 20 },
    typeScroll: { flexGrow: 0, marginBottom: 10 },
    typePill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 30, marginRight: 10, borderWidth: 1.5 },
    typePillActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
    typePillInactive: { backgroundColor: COLORS.glass, borderColor: COLORS.glassBorder },
    typeName: { fontSize: 14, fontWeight: '600' },
    sliderWrap: { alignItems: 'center', marginTop: 10 },
    durationBig: { color: COLORS.white, fontSize: 52, fontWeight: '700', marginBottom: 16, letterSpacing: -2 },
    durationUnit: { fontSize: 20, color: COLORS.textMuted, fontWeight: '500' },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginTop: -2 },
    sliderLbl: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
    intensityRow: { flexDirection: 'row', gap: 10 },
    intensityBtn: { flex: 1, paddingVertical: 15, backgroundColor: COLORS.glass, borderWidth: 1.5, borderColor: COLORS.glassBorder, borderRadius: 14, alignItems: 'center' },
    intensityActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentGlow },
    intensityText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700' },
    intensityTextActive: { color: COLORS.accent },
    dateChip: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: COLORS.glass, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 30, borderWidth: 1, borderColor: COLORS.glassBorder },
    dateText: { color: COLORS.white, fontSize: 14, fontWeight: '500' },
    inputWrap: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 16, overflow: 'hidden' },
    notesInput: { padding: 16, color: COLORS.white, fontSize: 15, minHeight: 110, textAlignVertical: 'top' },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 17 },
    saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
});

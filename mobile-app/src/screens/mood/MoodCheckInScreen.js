import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const MOODS = [
    { icon: 'frown', label: 'Low' },
    { icon: 'meh', label: 'Meh' },
    { icon: 'minus-circle', label: 'OK' },
    { icon: 'smile', label: 'Good' },
    { icon: 'sun', label: 'Great' },
];

export default function MoodCheckInScreen({ navigation }) {
    const [selectedMood, setSelectedMood] = useState(2);
    const [note, setNote] = useState('');

    const handleSave = async () => {
        try {
            await api.post('/api/student/mood/checkin', { moodScore: selectedMood + 1, note });
            Toast.show({
                type: 'success',
                text1: 'Mood Saved',
                text2: 'Your well-being matters.',
                position: 'bottom',
                bottomOffset: 100,
            });
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save mood.',
                position: 'bottom',
            });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Mood Check-in</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.prompt}>How are you feeling?</Text>

                <View style={styles.moodRow}>
                    {MOODS.map((m, index) => {
                        const isSelected = selectedMood === index;
                        return (
                            <TouchableOpacity
                                key={m.label}
                                style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
                                onPress={() => setSelectedMood(index)}
                                activeOpacity={0.75}
                            >
                                <Feather
                                    name={m.icon}
                                    size={28}
                                    color={isSelected ? COLORS.accent : COLORS.textSecondary}
                                />
                                <Text style={[styles.moodLabel, isSelected && { color: COLORS.accent }]}>
                                    {m.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>NOTES (OPTIONAL)</Text>
                <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="What's on your mind?"
                        placeholderTextColor={COLORS.textMuted}
                        multiline
                        numberOfLines={4}
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.85}
                    style={{ borderRadius: 16, overflow: 'hidden', marginTop: 36 }}
                >
                    <LinearGradient
                        colors={[COLORS.accent, COLORS.accentDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.saveBtn}
                    >
                        <Text style={styles.saveBtnText}>Save Mood</Text>
                        <Feather name="check" size={18} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
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
    content: { paddingHorizontal: 20, paddingTop: 20 },
    prompt: { color: COLORS.white, fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 36, letterSpacing: -0.5 },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    moodBtn: {
        flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 18,
        borderWidth: 1.5, borderColor: COLORS.glassBorder, backgroundColor: COLORS.card,
    },
    moodBtnSelected: {
        borderColor: COLORS.accent, backgroundColor: COLORS.accentGlow,
    },
    moodLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', marginTop: 6, letterSpacing: 0.3 },
    inputWrap: {
        backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 18, overflow: 'hidden',
    },
    notesInput: {
        padding: 16, color: COLORS.white, fontSize: 15, minHeight: 120, textAlignVertical: 'top',
    },
    saveBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 17,
    },
    saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
});

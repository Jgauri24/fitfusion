import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const MOODS = ['😔', '😟', '😐', '🙂', '😄'];

export default function MoodCheckInScreen({ navigation }) {
    const [selectedMood, setSelectedMood] = useState(2); // Default Neutral
    const [note, setNote] = useState('');

    const handleSave = () => {
        Toast.show({
            type: 'success',
            text1: 'Mood Saved 🌿',
            text2: 'Your well-being matters.',
            position: 'bottom',
            bottomOffset: 100,
        });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Mood Check-in</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.promptText}>How are you feeling?</Text>

                <View style={styles.emojiRow}>
                    {MOODS.map((emoji, index) => {
                        const isSelected = selectedMood === index;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.emojiBtn,
                                    isSelected && styles.emojiBtnSelected
                                ]}
                                onPress={() => setSelectedMood(index)}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>ADD LECTURE / CAMPUS NOTES (OPTIONAL)</Text>
                <TextInput
                    style={styles.notesInput}
                    placeholder="What's on your mind?"
                    placeholderTextColor={COLORS.cardBorder}
                    multiline
                    numberOfLines={4}
                    value={note}
                    onChangeText={setNote}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={globalStyles.buttonText}>Save Mood</Text>
                </TouchableOpacity>
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
    promptText: {
        ...globalStyles.heading,
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 40,
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    emojiBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.cardBorder,
    },
    emojiBtnSelected: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(200, 255, 87, 0.1)',
        transform: [{ scale: 1.15 }],
    },
    emojiText: {
        fontSize: 32,
    },
    notesInput: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 12,
        padding: 15,
        color: COLORS.white,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    saveButton: {
        ...globalStyles.pillButton,
        marginTop: 40,
    }
});

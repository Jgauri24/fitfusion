import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const ACTIVITY_TYPES = [
    { id: '1', name: 'Run', icon: '🏃' },
    { id: '2', name: 'Walk', icon: '🚶' },
    { id: '3', name: 'Yoga', icon: '🧘' },
    { id: '4', name: 'Gym', icon: '🏋️' },
    { id: '5', name: 'Cycle', icon: '🚴' },
    { id: '6', name: 'Sport', icon: '🏸' },
];

export default function ActivityLogScreen({ navigation }) {
    const [selectedType, setSelectedType] = useState('1');
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState('Moderate');
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        Toast.show({
            type: 'success',
            text1: 'Workout Saved ⚡',
            text2: 'Your activity streak is looking good!',
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
                <Text style={styles.title}>Log Workout</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

                <Text style={globalStyles.sectionLabel}>ACTIVITY TYPE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                    {ACTIVITY_TYPES.map(type => {
                        const isSelected = selectedType === type.id;
                        return (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => setSelectedType(type.id)}
                                style={[
                                    styles.typePill,
                                    isSelected ? styles.typePillActive : styles.typePillInactive
                                ]}
                            >
                                <Text style={styles.typeIcon}>{type.icon}</Text>
                                <Text style={[
                                    styles.typeName,
                                    { color: isSelected ? '#0E0E0E' : COLORS.white }
                                ]}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>DURATION</Text>
                <View style={styles.sliderContainer}>
                    <Text style={styles.durationLarge}>{duration} <Text style={{ fontSize: 20, color: COLORS.muted }}>min</Text></Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={10}
                        maximumValue={120}
                        step={5}
                        value={duration}
                        onValueChange={setDuration}
                        minimumTrackTintColor={COLORS.accent}
                        maximumTrackTintColor={COLORS.cardBorder}
                        thumbTintColor={COLORS.accent}
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabelText}>10 min</Text>
                        <Text style={styles.sliderLabelText}>120 min</Text>
                    </View>
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>INTENSITY</Text>
                <View style={styles.intensityRow}>
                    {['Low', 'Moderate', 'High'].map(level => {
                        const isSelected = intensity === level;
                        return (
                            <TouchableOpacity
                                key={level}
                                onPress={() => setIntensity(level)}
                                style={[
                                    styles.intensityBtn,
                                    isSelected && styles.intensityBtnActive
                                ]}
                            >
                                <Text style={[
                                    styles.intensityText,
                                    isSelected && styles.intensityTextActive
                                ]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>DATE</Text>
                <TouchableOpacity style={styles.dateChip}>
                    <Feather name="calendar" size={16} color={COLORS.muted} style={{ marginRight: 10 }} />
                    <Text style={styles.dateText}>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </TouchableOpacity>

                <Text style={[globalStyles.sectionLabel, { marginTop: 40 }]}>NOTES</Text>
                <TextInput
                    style={styles.notesInput}
                    placeholder="How did it feel?"
                    placeholderTextColor={COLORS.cardBorder}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={globalStyles.buttonText}>Save Activity</Text>
                </TouchableOpacity>

            </ScrollView>
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
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    typeScroll: {
        flexGrow: 0,
        marginBottom: 10,
    },
    typePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        marginRight: 10,
        borderWidth: 1,
    },
    typePillActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    typePillInactive: {
        backgroundColor: COLORS.bg,
        borderColor: COLORS.cardBorder,
    },
    typeIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    typeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    durationLarge: {
        color: COLORS.white,
        fontSize: 56,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 15,
        marginTop: -5,
    },
    sliderLabelText: {
        color: COLORS.muted,
        fontSize: 12,
    },
    intensityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    intensityBtn: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    intensityBtnActive: {
        borderColor: COLORS.accent,
    },
    intensityText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    intensityTextActive: {
        color: COLORS.accent,
    },
    dateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: COLORS.card,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    dateText: {
        color: COLORS.white,
        fontSize: 14,
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

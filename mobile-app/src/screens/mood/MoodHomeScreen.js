import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockMoodTrend, mockJournals } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const MOODS = ['😔', '😟', '😐', '🙂', '😄'];

export default function MoodHomeScreen({ navigation }) {
    const [selectedMood, setSelectedMood] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    const handleSaveMood = () => {
        if (selectedMood === null) return;
        setIsLogged(true);
        Toast.show({
            type: 'success',
            text1: 'Mood Checked-In 🌿',
            text2: 'Thanks for taking a moment for yourself.',
            position: 'bottom',
            bottomOffset: 100,
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <Text style={globalStyles.heading}>Mind & Mood</Text>
            </View>

            {/* Today's Check-in Card */}
            <Card style={styles.checkinCard}>
                <Text style={styles.checkinSub}>How are you feeling today?</Text>

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
                                onPress={() => !isLogged && setSelectedMood(index)}
                                disabled={isLogged}
                            >
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {!isLogged ? (
                    <TouchableOpacity
                        style={[styles.saveBtn, selectedMood === null && { opacity: 0.5 }]}
                        onPress={handleSaveMood}
                        disabled={selectedMood === null}
                    >
                        <Text style={globalStyles.buttonText}>Save Check-in</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.loggedText}>Logged at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                )}
            </Card>

            <Text style={globalStyles.sectionLabel}>MOOD TREND</Text>
            <LineChart
                data={{
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [{ data: mockMoodTrend }]
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: COLORS.bg,
                    backgroundGradientFrom: COLORS.bg,
                    backgroundGradientTo: COLORS.bg,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(200, 255, 87, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.accent },
                    propsForBackgroundLines: { stroke: COLORS.cardBorder }
                }}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={false}
            />

            {/* Variance Badge Card */}
            <Card style={styles.varianceCard}>
                <Text style={styles.varianceText}>😌 Low Variance — Mood Stable</Text>
            </Card>

            <Text style={[globalStyles.sectionLabel, { marginTop: 30 }]}>RECENT JOURNALS</Text>

            <View style={styles.journalList}>
                {mockJournals.map((journal) => (
                    <TouchableOpacity
                        key={journal.id}
                        onPress={() => navigation.navigate('JournalViewScreen', { journal })}
                    >
                        <View style={styles.journalCard}>
                            <View style={styles.journalHeader}>
                                <View style={styles.dateChip}>
                                    <Text style={styles.dateChipText}>{journal.date}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color={COLORS.muted} />
                            </View>
                            <Text style={styles.journalTitle}>{journal.title}</Text>
                            <Text style={styles.journalPreview}>{journal.preview}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={globalStyles.pillButton}
                onPress={() => navigation.navigate('JournalEntryScreen')}
            >
                <Text style={globalStyles.buttonText}>+ New Journal</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 20,
    },
    checkinCard: {
        alignItems: 'center',
        marginBottom: 20,
    },
    checkinSub: {
        color: COLORS.muted,
        fontSize: 16,
        marginBottom: 20,
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    emojiBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emojiBtnSelected: {
        borderColor: COLORS.accent,
        transform: [{ scale: 1.1 }],
    },
    emojiText: {
        fontSize: 28,
    },
    saveBtn: {
        ...globalStyles.pillButton,
        width: '100%',
    },
    loggedText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
    varianceCard: {
        backgroundColor: 'rgba(200, 255, 87, 0.1)',
        borderColor: COLORS.accent,
        marginTop: 10,
        alignItems: 'center',
        padding: 15,
    },
    varianceText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 16,
    },
    journalList: {
        marginBottom: 20,
    },
    journalCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateChip: {
        backgroundColor: COLORS.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateChipText: {
        color: COLORS.mutedLight,
        fontSize: 12,
        fontWeight: 'bold',
    },
    journalTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    journalPreview: {
        color: COLORS.muted,
        fontSize: 14,
    }
});

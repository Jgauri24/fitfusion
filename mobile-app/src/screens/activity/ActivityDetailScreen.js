import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';

const IntensityBadge = ({ intensity }) => {
    let color = COLORS.muted;
    if (intensity === 'High') color = COLORS.accent;
    if (intensity === 'Moderate') color = COLORS.amber;

    return (
        <View style={[styles.intensityBadge, { borderColor: color }]}>
            <Text style={[styles.intensityText, { color }]}>{intensity}</Text>
        </View>
    );
};

export default function ActivityDetailScreen({ route, navigation }) {
    // Use fallback data if navigated without params natively during development
    const activity = route?.params?.activity || {
        type: "Running", duration: "30 min", intensity: "Moderate", date: "Yesterday", icon: "🏃"
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Activity",
            "Are you sure you want to remove this log? This will update your weekly consistency score.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => navigation.goBack()
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Activity Details</Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Feather name="trash-2" size={20} color={COLORS.danger} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconLarge}>{activity.icon}</Text>
                </View>

                <Text style={styles.nameText}>{activity.type}</Text>
                <Text style={styles.durationText}>{activity.duration}</Text>

                <View style={styles.badgeContainer}>
                    <IntensityBadge intensity={activity.intensity} />
                </View>

                <Card style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={globalStyles.sectionLabel}>DATE</Text>
                        <Text style={styles.infoValue}>{activity.date}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={globalStyles.sectionLabel}>NOTES</Text>
                        <Text style={styles.infoValue}>Felt great today. Pushed a little harder on the last stretch.</Text>
                    </View>
                </Card>

            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteText}>Delete Entry</Text>
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
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(200, 255, 87, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconLarge: {
        fontSize: 60,
    },
    nameText: {
        ...globalStyles.heading,
        fontSize: 32,
        marginBottom: 5,
    },
    durationText: {
        color: COLORS.white,
        fontSize: 20,
        marginBottom: 20,
    },
    badgeContainer: {
        marginBottom: 40,
    },
    intensityBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    intensityText: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoCard: {
        width: '100%',
    },
    infoRow: {
        marginVertical: 10,
    },
    infoValue: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 24,
        marginTop: 5,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.cardBorder,
        marginVertical: 15,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    deleteButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.danger,
        alignItems: 'center',
    },
    deleteText: {
        color: COLORS.danger,
        fontWeight: 'bold',
        fontSize: 16,
    }
});

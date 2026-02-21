import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function JournalViewScreen({ route, navigation }) {
    const journal = route?.params?.journal || {
        id: 1, title: 'Sample Journal', date: 'Today', full: 'No content loaded.'
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Journal",
            "Are you sure you want to delete this encrypted entry? This cannot be undone.",
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
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

                <View style={styles.metaRow}>
                    <View style={styles.lockBadge}>
                        <Feather name="lock" size={12} color={COLORS.accent} />
                    </View>
                    <Text style={styles.dateText}>{journal.date}</Text>
                </View>

                <Text style={styles.titleText}>{journal.title}</Text>

                <Text style={styles.bodyText}>{journal.full}</Text>

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
    deleteText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    lockBadge: {
        backgroundColor: 'rgba(200, 255, 87, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    dateText: {
        color: COLORS.muted,
        fontSize: 14,
    },
    titleText: {
        ...globalStyles.heading,
        fontSize: 28,
        marginBottom: 30,
        lineHeight: 36,
    },
    bodyText: {
        color: COLORS.mutedLight,
        fontSize: 18,
        lineHeight: 28,
    }
});

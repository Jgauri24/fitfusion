import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { GlassCard } from '../../components/GlassCard';

export default function JournalViewScreen({ route, navigation }) {
    const journal = route?.params?.journal || {
        id: 1, title: 'Sample Journal', date: 'Today', full: 'No content loaded.',
    };

    const handleDelete = () => {
        Alert.alert('Delete Journal', 'Delete this encrypted entry? This cannot be undone.', [
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
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteLink}>Delete</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
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
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    },
    deleteLink: { color: COLORS.danger, fontSize: 15, fontWeight: '700' },
    scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    lockBadge: { backgroundColor: COLORS.accentGlow, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginRight: 10 },
    dateText: { color: COLORS.textSecondary, fontSize: 14 },
    titleText: { color: COLORS.white, fontSize: 28, fontWeight: '700', marginBottom: 28, lineHeight: 36, letterSpacing: -0.5 },
    bodyText: { color: COLORS.textSecondary, fontSize: 17, lineHeight: 28 },
});

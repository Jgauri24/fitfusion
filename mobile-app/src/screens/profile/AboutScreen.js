import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function AboutScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>About VITA</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>VITA</Text>
                    <View style={styles.dot} />
                </View>
                <Text style={styles.version}>Version 1.0.0</Text>

                <Text style={styles.description}>
                    VITA is a context-aware campus wellness system designed to integrate seamlessly into your university life.
                    By tracking nutrition, building activity streaks, and monitoring mood stability, VITA helps you maintain a
                    balanced and healthy lifestyle amidst academic pressures.
                </Text>

                <Text style={styles.credits}>
                    Built by Team TLE, Rishihood University
                </Text>
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
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100, // offset header
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
        letterSpacing: 2,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.accent,
        marginLeft: 5,
    },
    version: {
        color: COLORS.muted,
        fontSize: 16,
        marginBottom: 40,
    },
    description: {
        color: COLORS.mutedLight,
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
        marginBottom: 40,
    },
    credits: {
        color: COLORS.muted,
        fontSize: 14,
        fontStyle: 'italic',
    }
});

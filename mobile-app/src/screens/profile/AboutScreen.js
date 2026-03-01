import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import VitaLogo from '../../components/VitaLogo';

export default function AboutScreen({ navigation }) {
    return (
        <LinearGradient colors={['#060B18', '#0B1530', '#060B18']} style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>About VITA</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.body}>
                {/* Ambient glow */}
                <View style={styles.glow} />

                <VitaLogo size={64} fontSize={40} layout="column" />
                <Text style={styles.version}>Version 1.0.0</Text>

                <Text style={styles.desc}>
                    VITA is a context-aware campus wellness system designed to integrate seamlessly
                    into your university life. Track nutrition, build activity streaks, and monitor
                    mood stability to maintain a balanced lifestyle.
                </Text>

                <Text style={styles.credits}>Built by Team TLE, Rishihood University</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    body: { flex: 1, paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
    glow: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: COLORS.accentGlow },
    version: { color: COLORS.textSecondary, fontSize: 15, marginTop: 14, marginBottom: 40 },
    desc: { color: COLORS.textSecondary, fontSize: 16, lineHeight: 26, textAlign: 'center', marginBottom: 40 },
    credits: { color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic' },
});

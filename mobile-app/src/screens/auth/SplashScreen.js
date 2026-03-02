import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';
import VitaLogo from '../../components/VitaLogo';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('OnboardingScreen');
        }, 2200);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['#050608', '#020308', '#050608']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            {/* Ambient glow */}
            <View style={styles.ambientGlow} />

            <VitaLogo size={72} fontSize={40} layout="column" />
            <Text style={styles.tagline}>Your Campus. Your Wellness.</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ambientGlow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.accentGlow,
        top: '35%',
        alignSelf: 'center',
    },
    tagline: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: 20,
        letterSpacing: 1,
        fontWeight: '500',
    }
});

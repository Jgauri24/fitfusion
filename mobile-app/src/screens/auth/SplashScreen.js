import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('OnboardingScreen');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>VITA</Text>
                <View style={styles.dot} />
            </View>
            <Text style={styles.tagline}>Your Campus. Your Wellness.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
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
    tagline: {
        color: COLORS.muted,
        fontSize: 16,
        marginTop: 10,
    }
});

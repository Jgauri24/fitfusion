import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    // Animations
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(20)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslateY = useRef(new Animated.Value(12)).current;
    const ringScale = useRef(new Animated.Value(0.5)).current;
    const ringOpacity = useRef(new Animated.Value(0)).current;
    const ring2Scale = useRef(new Animated.Value(0.4)).current;
    const ring2Opacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const bottomOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Staggered entrance
        Animated.sequence([
            // 1. Rings expand outward
            Animated.parallel([
                Animated.timing(ringOpacity, { toValue: 0.35, duration: 400, useNativeDriver: true }),
                Animated.timing(ringScale, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(ring2Opacity, { toValue: 0.2, duration: 500, delay: 150, useNativeDriver: true }),
                Animated.timing(ring2Scale, { toValue: 1, duration: 800, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            // 2. Logo scales in with bounce
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            // 3. Title slides up
            Animated.parallel([
                Animated.timing(titleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.timing(titleTranslateY, { toValue: 0, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            // 4. Subtitle fades in
            Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            // 5. Tagline slides up
            Animated.parallel([
                Animated.timing(taglineOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(taglineTranslateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(bottomOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Continuous pulse on the glow
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();

        const timer = setTimeout(() => {
            navigation.replace('OnboardingScreen');
        }, 2800);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['#050804', '#0A1208', '#080C06']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.container}
        >
            {/* Decorative particles */}
            <View style={[styles.particle, { top: '15%', left: '12%' }]} />
            <View style={[styles.particle, { top: '25%', right: '15%', width: 3, height: 3 }]} />
            <View style={[styles.particle, { bottom: '30%', left: '22%', width: 2, height: 2 }]} />
            <View style={[styles.particle, { bottom: '20%', right: '18%' }]} />
            <View style={[styles.particle, { top: '45%', left: '8%', width: 2, height: 2 }]} />
            <View style={[styles.particle, { top: '60%', right: '10%', width: 3, height: 3 }]} />

            {/* Expanding ring 2 (larger, fainter) */}
            <Animated.View style={[styles.ring, styles.ringOuter, {
                opacity: ring2Opacity,
                transform: [{ scale: ring2Scale }],
            }]} />

            {/* Expanding ring 1 */}
            <Animated.View style={[styles.ring, {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
            }]} />

            {/* Pulsing ambient glow */}
            <Animated.View style={[styles.ambientGlow, {
                transform: [{ scale: pulseAnim }],
            }]} />

            {/* Logo Icon */}
            <Animated.View style={{
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
                marginBottom: 24,
            }}>
                <View style={styles.logoContainer}>
                    <Svg width={80} height={80} viewBox="0 0 32 32" fill="none">
                        <Defs>
                            <RadialGradient id="glow" cx="22" cy="15" r="14" gradientUnits="userSpaceOnUse">
                                <Stop offset="0" stopColor={COLORS.accent} stopOpacity="0.4" />
                                <Stop offset="1" stopColor={COLORS.accent} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="22" cy="15" r="14" fill="url(#glow)" />
                        <Path d="M10 6 L16 26 L12 26 L6 6 Z" fill={COLORS.white} />
                        <Path
                            d="M22 6 C22 12 18 15 12 15 C18 15 22 18 22 24 C22 18 26 15 32 15 C26 15 22 12 22 6 Z"
                            fill={COLORS.accent}
                        />
                    </Svg>
                </View>
            </Animated.View>

            {/* Brand Text */}
            <Animated.Text style={[styles.brandTitle, {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
            }]}>
                VITA
            </Animated.Text>

            <Animated.Text style={[styles.brandSubtitle, { opacity: subtitleOpacity }]}>
                Intelligence
            </Animated.Text>

            {/* Tagline */}
            <Animated.View style={{
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
                marginTop: 32,
                alignItems: 'center',
            }}>
                <View style={styles.taglineDivider} />
                <Text style={styles.tagline}>Your Campus. Your Wellness.</Text>
            </Animated.View>

            {/* Bottom branding */}
            <Animated.View style={[styles.bottomSection, { opacity: bottomOpacity }]}>
                <Text style={styles.bottomText}>FitFusion</Text>
                <View style={styles.dotSeparator} />
                <Text style={styles.bottomText}>Campus Wellness Platform</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.accent,
        opacity: 0.25,
    },
    ring: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    ringOuter: {
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    ambientGlow: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: COLORS.accentGlowMed,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.glass,
        borderWidth: 1.5,
        borderColor: COLORS.glassBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandTitle: {
        color: COLORS.white,
        fontSize: 48,
        fontWeight: '800',
        letterSpacing: 14,
    },
    brandSubtitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 6,
        marginTop: 4,
    },
    taglineDivider: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.accent,
        borderRadius: 1,
        marginBottom: 16,
        opacity: 0.6,
    },
    tagline: {
        color: COLORS.textSecondary,
        fontSize: 14,
        letterSpacing: 1.5,
        fontWeight: '500',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomText: {
        color: COLORS.textMuted,
        fontSize: 11,
        letterSpacing: 0.5,
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: 8,
    },
});

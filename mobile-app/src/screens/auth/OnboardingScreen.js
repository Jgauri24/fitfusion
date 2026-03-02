import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import VitaLogo from '../../components/VitaLogo';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Your Journey Starts Here',
        subtitle: 'Premium campus wellness intelligence for university students.',
        icon: 'compass',
        iconLib: 'feather',
    },
    {
        key: '2',
        title: 'Track Everything',
        subtitle: 'Nutrition, activity, mood — all in one place. Build habits that stick.',
        icon: 'bar-chart-2',
        iconLib: 'feather',
    },
    {
        key: '3',
        title: 'Stay Ahead',
        subtitle: 'Smart nudges, burnout detection, and personalized wellness scores.',
        icon: 'shield',
        iconLib: 'feather',
    },
];

const SlideIcon = ({ name }) => (
    <View style={styles.iconCircle}>
        <Feather name={name} size={36} color={COLORS.accent} />
    </View>
);

export default function OnboardingScreen({ navigation }) {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        setCurrentPage(Math.round(xOffset / width));
    };

    return (
        <LinearGradient
            colors={['#080C06', '#0A1208', '#060A04']}
            style={styles.container}
        >
            <View style={styles.topBar}>
                <VitaLogo size={24} fontSize={16} />
            </View>

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.pager}
            >
                {slides.map((slide) => (
                    <View key={slide.key} style={[styles.slide, { width }]}>
                        <GlassCard glow style={styles.slideCard}>
                            <SlideIcon name={slide.icon} />
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.subtitle}>{slide.subtitle}</Text>
                        </GlassCard>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.dotsRow}>
                    {slides.map((_, idx) => (
                        <View
                            key={idx.toString()}
                            style={[
                                styles.dot,
                                currentPage === idx ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => navigation.replace('LoginScreen')}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={[COLORS.accent, COLORS.accentDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ctaGradient}
                    >
                        <Text style={styles.ctaText}>Get Started</Text>
                        <Feather name="arrow-right" size={18} color="#FFFFFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 10,
    },
    pager: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    slideCard: {
        alignItems: 'center',
        padding: 44,
        width: '100%',
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: COLORS.accentGlow,
        borderWidth: 1.5,
        borderColor: COLORS.accentGlowMed,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 23,
    },
    footer: {
        paddingHorizontal: 28,
        paddingBottom: 50,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 28,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.accent,
        width: 28,
    },
    inactiveDot: {
        backgroundColor: COLORS.textMuted,
        width: 6,
    },
    ctaButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 17,
    },
    ctaText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 17,
        letterSpacing: 0.3,
    },
});

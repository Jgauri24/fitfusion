import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Track What You Eat',
        subtitle: 'Log campus meals and stay nutritionally aware',
        icon: '🥗',
    },
    {
        key: '2',
        title: 'Move Every Day',
        subtitle: 'Build activity streaks that keep you consistent',
        icon: '⚡',
    },
    {
        key: '3',
        title: 'Know Your Mind',
        subtitle: 'Journal your mood and detect early burnout',
        icon: '🌿',
    },
];

export default function OnboardingScreen({ navigation }) {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(xOffset / width);
        setCurrentPage(pageIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.pagerView}
            >
                {slides.map((slide) => (
                    <View key={slide.key} style={[styles.slide, { width }]}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.icon}>{slide.icon}</Text>
                        </View>
                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={styles.subtitle}>{slide.subtitle}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.dotsContainer}>
                    {slides.map((_, idx) => (
                        <View
                            key={idx.toString()}
                            style={[
                                styles.dot,
                                currentPage === idx ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>

                {currentPage === slides.length - 1 && (
                    <TouchableOpacity
                        style={globalStyles.pillButton}
                        onPress={() => navigation.replace('LoginScreen')}
                    >
                        <Text style={globalStyles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    pagerView: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(200, 255, 87, 0.1)', // lime-tinted dark circle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        fontSize: 50,
    },
    title: {
        ...globalStyles.heading,
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        ...globalStyles.subtitle,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.accent,
    },
    inactiveDot: {
        backgroundColor: '#333333',
    }
});

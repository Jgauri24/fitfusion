import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * GlassCard — Premium glassmorphism card with lime glow edge.
 * @param {boolean} glow - Adds stronger lime glow shadow
 * @param {boolean} noPad - Removes padding (for list cards)
 */
export const GlassCard = ({ children, style, glow, noPad, ...props }) => {
    return (
        <View
            style={[
                styles.card,
                glow && styles.glowCard,
                noPad && styles.noPad,
                style,
            ]}
            {...props}
        >
            {/* Top highlight shimmer */}
            <View style={styles.highlight} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        padding: 18,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.30,
                shadowRadius: 20,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    glowCard: {
        borderColor: COLORS.accentGlowMed,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.20,
                shadowRadius: 24,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    noPad: {
        padding: 0,
    },
    highlight: {
        position: 'absolute',
        top: 0,
        left: 24,
        right: 24,
        height: 1,
        backgroundColor: COLORS.glassHighlight,
        borderRadius: 1,
    },
});

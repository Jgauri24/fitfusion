import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * GlassCard — Premium glassmorphism card with electric blue glow edge.
 * @param {boolean} glow - Adds stronger blue glow shadow
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
            {/* Top highlight */}
            <View style={styles.highlight} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        padding: 18,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    glowCard: {
        borderColor: COLORS.accentGlowMed,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    noPad: {
        padding: 0,
    },
    highlight: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 1,
        backgroundColor: COLORS.glassHighlight,
        borderRadius: 1,
    },
});

import React from 'react';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * VitaLogo — Neon brand mark with lime accent, matching app theme.
 */
export default function VitaLogo({
    size = 32,
    fontSize = 22,
    showText = true,
    layout = 'row',
}) {
    const isColumn = layout === 'column';

    return (
        <View style={[styles.container, isColumn && styles.containerColumn]}>
            <View style={styles.iconWrap}>
                <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
                    <Defs>
                        <RadialGradient id="glow" cx="22" cy="15" r="14" gradientUnits="userSpaceOnUse">
                            <Stop offset="0" stopColor={COLORS.accent} stopOpacity="0.3" />
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
            {showText && (
                <Text style={[styles.text, { fontSize }, isColumn && styles.textColumn]}>
                    VITA
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    containerColumn: {
        flexDirection: 'column',
        gap: 14,
    },
    iconWrap: {
        // subtle glow behind icon
    },
    text: {
        color: COLORS.white,
        fontWeight: '800',
        letterSpacing: 4,
    },
    textColumn: {
        letterSpacing: 6,
    },
});

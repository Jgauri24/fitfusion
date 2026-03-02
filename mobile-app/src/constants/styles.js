import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './theme';

export const globalStyles = StyleSheet.create({
    // ── Containers ──
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    paddedContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 20,
    },

    // ── Glass Card ──
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        padding: 18,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.10,
                shadowRadius: 20,
            },
            android: {
                elevation: 6,
            },
        }),
    },

    // ── Typography ──
    heading: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 24,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 15,
        lineHeight: 22,
    },

    // ── Buttons ──
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    pillButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.accent,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.40,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
        }),
    },

    // ── Section Label ──
    sectionLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 12,
    },
});

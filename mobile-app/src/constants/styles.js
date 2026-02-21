import { StyleSheet } from 'react-native';
import { COLORS } from './theme';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    paddedContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        padding: 15,
    },
    heading: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 24,
    },
    subtitle: {
        color: COLORS.muted,
        fontSize: 16,
    },
    buttonText: {
        color: '#0E0E0E',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    pillButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionLabel: {
        color: COLORS.muted,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
});

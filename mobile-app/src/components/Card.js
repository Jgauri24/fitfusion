import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const Card = ({ children, style, ...props }) => {
    return (
        <View style={[styles.card, style]} {...props}>
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
});

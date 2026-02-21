import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../constants/styles';

export const Card = ({ children, style, ...props }) => {
    return (
        <View style={[globalStyles.card, style]} {...props}>
            {children}
        </View>
    );
};

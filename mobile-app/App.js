import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
    return (
        <>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
            <Toast />
            <StatusBar style="light" />
        </>
    );
}

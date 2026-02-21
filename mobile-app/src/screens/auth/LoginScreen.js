import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>VITA</Text>
                    <View style={styles.dot} />
                </View>
                <Text style={globalStyles.subtitle}>Welcome back</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor={COLORS.muted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.muted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[globalStyles.pillButton, styles.loginButton]}
                    onPress={() => navigation.replace('MainApp')}
                >
                    <Text style={globalStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={globalStyles.subtitle}>New here? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                    <Text style={styles.signupText}>Create account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.paddedContainer,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 50,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
        letterSpacing: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginLeft: 4,
    },
    form: {
        marginBottom: 30,
    },
    input: {
        backgroundColor: COLORS.card,
        color: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 12,
        marginBottom: 30,
    },
    passwordInput: {
        flex: 1,
        color: COLORS.white,
        padding: 15,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 15,
    },
    loginButton: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

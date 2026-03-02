import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import VitaLogo from '../../components/VitaLogo';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));

            if (user.age && user.weight && user.height) {
                navigation.replace('MainApp');
            } else {
                navigation.replace('ProfileSetup');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to login. Check credentials.';
            Alert.alert('Login Failed', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#050608', '#020308', '#050608']} style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <VitaLogo size={26} fontSize={17} />
            </View>

            <View style={styles.content}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSub}>Your campus wellness intelligence, reinstated.</Text>

                {/* Email */}
                <Text style={styles.inputLabel}>UNIVERSITY EMAIL</Text>
                <View style={styles.inputWrap}>
                    <Feather name="mail" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="name@university.edu"
                        placeholderTextColor={COLORS.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Password */}
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrap}>
                    <Feather name="lock" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                        <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.85}
                    style={{ borderRadius: 14, overflow: 'hidden', marginTop: 8 }}
                >
                    <LinearGradient
                        colors={isLoading ? [COLORS.textMuted, COLORS.textMuted] : [COLORS.accent, COLORS.accentDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.loginBtn}
                    >
                        <Text style={styles.loginBtnText}>
                            {isLoading ? 'Signing in...' : 'Login to VITA'}
                        </Text>
                        {!isLoading && <Feather name="arrow-right" size={18} color="#FFF" />}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.signupRow}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    welcomeTitle: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    welcomeSub: {
        color: COLORS.textSecondary,
        fontSize: 15,
        marginBottom: 36,
        lineHeight: 22,
    },
    inputLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        borderRadius: 14,
        marginBottom: 18,
        paddingHorizontal: 14,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: COLORS.white,
        paddingVertical: 15,
        fontSize: 15,
    },
    eyeBtn: {
        padding: 8,
    },
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 17,
        borderRadius: 14,
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '700',
    },
});

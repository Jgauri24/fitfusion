import { TOP_PADDING } from '../../constants/styles';
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

            if (user.role === 'ADMIN') {
                throw new Error("Admin access is restricted to the Web Dashboard.");
            }

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));

            // Only show profile setup once — if user skipped or completed it before, go straight to app
            const setupDone = await AsyncStorage.getItem('profileSetupDone');
            if (setupDone || (user.age && user.weight && user.height)) {
                await AsyncStorage.setItem('profileSetupDone', 'true');
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
        <LinearGradient colors={['#080C06', '#0A1208', '#060A04']} style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <VitaLogo size={26} fontSize={17} showSubtitle={true} />
            </View>

            <View style={styles.content}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSub}>Your campus wellness platform, reinstated.</Text>

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
                    style={{ borderRadius: 16, overflow: 'hidden', marginTop: 8 }}
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



            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: TOP_PADDING,
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
        borderRadius: 16,
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
        borderRadius: 16,
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.3,
    },


});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function SignupScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hostel, setHostel] = useState('');
    const [branch, setBranch] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={globalStyles.subtitle}>Join your campus wellness journey</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={COLORS.muted}
                    value={fullName}
                    onChangeText={setFullName}
                />

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

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={hostel}
                        onValueChange={(itemValue) => setHostel(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={COLORS.white}
                    >
                        <Picker.Item label="Select Hostel" value="" color={COLORS.muted} />
                        <Picker.Item label="Hostel A" value="Hostel A" color={COLORS.bg} />
                        <Picker.Item label="Hostel B" value="Hostel B" color={COLORS.bg} />
                        <Picker.Item label="Hostel C" value="Hostel C" color={COLORS.bg} />
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={branch}
                        onValueChange={(itemValue) => setBranch(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={COLORS.white}
                    >
                        <Picker.Item label="Select Branch" value="" color={COLORS.muted} />
                        <Picker.Item label="CS & AI" value="CS & AI" color={COLORS.bg} />
                        <Picker.Item label="CSE & DS" value="CSE & DS" color={COLORS.bg} />
                    </Picker>
                </View>

                <TouchableOpacity
                    style={[globalStyles.pillButton, styles.signupButton]}
                    onPress={() => navigation.replace('MainApp')}
                >
                    <Text style={globalStyles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={globalStyles.subtitle}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.paddedContainer,
    },
    scrollContent: {
        paddingVertical: 50,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        ...globalStyles.heading,
        fontSize: 28,
        marginBottom: 5,
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
        marginBottom: 15,
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
    pickerContainer: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        color: COLORS.white,
    },
    signupButton: {
        width: '100%',
        marginTop: 15,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

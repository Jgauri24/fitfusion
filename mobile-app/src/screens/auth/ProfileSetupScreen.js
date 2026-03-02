import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import api from '../../utils/api';

const IIT_HOSTELS = [
    'Rajiv Bhawan', 'Azad Bhawan', 'Jawahar Bhawan', 'Radhakrishnan Bhawan',
    'Govind Bhawan', 'Ganga Bhawan', 'Sarojini Bhawan', 'Kasturba Bhawan',
    'Cautley Bhawan', 'Ravindra Bhawan', 'RKB (New)', 'Other'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const SelectButton = ({ active, label, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.selectBtn, active && styles.selectBtnActive]}
        activeOpacity={0.7}
    >
        <Text style={[styles.selectBtnText, active && styles.selectBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
);

const DropdownPicker = ({ label, value, options, onSelect, placeholder }) => {
    const [visible, setVisible] = useState(false);
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.dropdownText, !value && { color: COLORS.textMuted }]}>
                    {value || placeholder}
                </Text>
                <Feather name="chevron-down" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.modalItem, value === item && styles.modalItemActive]}
                                    onPress={() => { onSelect(item); setVisible(false); }}
                                >
                                    <Text style={[styles.modalItemText, value === item && styles.modalItemTextActive]}>
                                        {item}
                                    </Text>
                                    {value === item && <Feather name="check" size={16} color={COLORS.accent} />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default function ProfileSetupScreen({ navigation, route }) {
    const isEditMode = route?.params?.isEditMode;

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [hostel, setHostel] = useState('');
    const [branch, setBranch] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [dietaryPref, setDietaryPref] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const loadInfo = async () => {
                try {
                    const s = await AsyncStorage.getItem('userInfo');
                    if (s) {
                        const parsed = JSON.parse(s);
                        if (parsed.age) setAge(parsed.age.toString());
                        if (parsed.gender) setGender(parsed.gender);
                        if (parsed.height) setHeight(parsed.height.toString());
                        if (parsed.weight) setWeight(parsed.weight.toString());
                        if (parsed.hostel) setHostel(parsed.hostel);
                        if (parsed.branch) setBranch(parsed.branch);
                        if (parsed.academicYear) setAcademicYear(parsed.academicYear?.toString());
                        if (parsed.fitnessLevel) setFitnessLevel(parsed.fitnessLevel);
                        if (parsed.dietaryPref) setDietaryPref(parsed.dietaryPref);
                    }
                } catch (e) { }
            };
            loadInfo();
        }
    }, [isEditMode]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const data = {
                ...(age && { age: parseInt(age) }),
                ...(gender && { gender }),
                ...(height && { height: parseFloat(height) }),
                ...(weight && { weight: parseFloat(weight) }),
                ...(hostel && { hostel }),
                ...(branch && { branch }),
                ...(academicYear && { academicYear }),
                ...(fitnessLevel && { fitnessLevel }),
                ...(dietaryPref && { dietaryPref })
            };

            const res = await api.put('/api/auth/profile', data);

            // Update local storage user info
            const existingCache = await AsyncStorage.getItem('userInfo');
            if (existingCache) {
                const parsed = JSON.parse(existingCache);
                await AsyncStorage.setItem('userInfo', JSON.stringify({ ...parsed, ...res.data.user }));
            }

            Alert.alert("Success", isEditMode ? "Profile updated successfully!" : "Profile setup complete!");
            if (isEditMode) {
                navigation.goBack();
            } else {
                navigation.replace('MainApp');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update profile details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#050608', '#020308']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Back button in edit mode */}
                {isEditMode && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                )}

                <View style={styles.header}>
                    <Text style={styles.title}>{isEditMode ? 'Edit Profile' : 'Complete Your Profile'}</Text>
                    <Text style={styles.subtitle}>{isEditMode ? 'Update your basic details.' : 'Help us personalize your wellness insights.'}</Text>
                </View>

                {/* Demographics */}
                <Text style={styles.sectionTitle}>Basic Info</Text>
                <View style={styles.row}>
                    <View style={styles.inputWrapHalf}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput style={styles.input} placeholder="e.g. 20" placeholderTextColor={COLORS.textMuted} value={age} onChangeText={setAge} keyboardType="numeric" />
                    </View>
                    <View style={styles.inputWrapHalf}>
                        <DropdownPicker
                            label="Gender"
                            value={gender}
                            options={GENDER_OPTIONS}
                            onSelect={setGender}
                            placeholder="Select Gender"
                        />
                    </View>
                </View>

                {/* Body Metrics */}
                <Text style={styles.sectionTitle}>Body Metrics</Text>
                <View style={styles.row}>
                    <View style={styles.inputWrapHalf}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput style={styles.input} placeholder="175" placeholderTextColor={COLORS.textMuted} value={height} onChangeText={setHeight} keyboardType="numeric" />
                    </View>
                    <View style={styles.inputWrapHalf}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput style={styles.input} placeholder="70" placeholderTextColor={COLORS.textMuted} value={weight} onChangeText={setWeight} keyboardType="numeric" />
                    </View>
                </View>

                {/* Campus Info */}
                <Text style={styles.sectionTitle}>Campus Details</Text>
                <View style={styles.inputWrap}>
                    <DropdownPicker
                        label="Hostel (Bhawan)"
                        value={hostel}
                        options={IIT_HOSTELS}
                        onSelect={setHostel}
                        placeholder="Select your Bhawan"
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.inputWrapHalf}>
                        <Text style={styles.label}>Branch</Text>
                        <TextInput style={styles.input} placeholder="CSE, EE, etc." placeholderTextColor={COLORS.textMuted} value={branch} onChangeText={setBranch} />
                    </View>
                    <View style={styles.inputWrapHalf}>
                        <Text style={styles.label}>Academic Year</Text>
                        <TextInput style={styles.input} placeholder="1, 2, 3, 4" placeholderTextColor={COLORS.textMuted} value={academicYear} onChangeText={setAcademicYear} keyboardType="numeric" />
                    </View>
                </View>

                {/* Fitness & Diet */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <Text style={styles.label}>Fitness Level</Text>
                <View style={styles.rowWrap}>
                    <SelectButton active={fitnessLevel === 'BEGINNER'} label="Beginner" onPress={() => setFitnessLevel('BEGINNER')} />
                    <SelectButton active={fitnessLevel === 'INTERMEDIATE'} label="Intermediate" onPress={() => setFitnessLevel('INTERMEDIATE')} />
                    <SelectButton active={fitnessLevel === 'ADVANCED'} label="Advanced" onPress={() => setFitnessLevel('ADVANCED')} />
                </View>

                <Text style={[styles.label, { marginTop: 16 }]}>Dietary Preference</Text>
                <View style={styles.rowWrap}>
                    <SelectButton active={dietaryPref === 'VEGETARIAN'} label="Vegetarian" onPress={() => setDietaryPref('VEGETARIAN')} />
                    <SelectButton active={dietaryPref === 'VEGAN'} label="Vegan" onPress={() => setDietaryPref('VEGAN')} />
                    <SelectButton active={dietaryPref === 'NON_VEGETARIAN'} label="Non-Veg" onPress={() => setDietaryPref('NON_VEGETARIAN')} />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={isLoading}>
                    <LinearGradient colors={[COLORS.accent, COLORS.accentDark]} style={styles.submitGradient}>
                        <Text style={styles.submitText}>{isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Complete Setup')}</Text>
                        {!isLoading && <Feather name="check" size={18} color="#FFF" />}
                    </LinearGradient>
                </TouchableOpacity>

                {!isEditMode && (
                    <TouchableOpacity onPress={() => navigation.replace('MainApp')} style={styles.skipBtn}>
                        <Text style={styles.skipText}>Skip for now</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 24, paddingTop: 60, paddingBottom: 60 },
    backBtn: { marginBottom: 10 },
    header: { marginBottom: 32 },
    title: { color: COLORS.white, fontSize: 28, fontWeight: '700', marginBottom: 8 },
    subtitle: { color: COLORS.textSecondary, fontSize: 15 },
    sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 16 },
    row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    inputWrap: { marginBottom: 16 },
    inputWrapHalf: { flex: 1 },
    label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1, borderColor: COLORS.divider, borderRadius: 12,
        color: COLORS.white, padding: 14, fontSize: 15
    },
    dropdownBtn: {
        backgroundColor: COLORS.surface,
        borderWidth: 1, borderColor: COLORS.divider, borderRadius: 12,
        padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    dropdownText: { color: COLORS.white, fontSize: 15 },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', padding: 30,
    },
    modalContent: {
        backgroundColor: COLORS.surface, borderRadius: 16, padding: 20,
        width: '100%', maxHeight: 400,
        borderWidth: 1, borderColor: COLORS.divider,
    },
    modalTitle: { color: COLORS.white, fontSize: 18, fontWeight: '700', marginBottom: 16 },
    modalItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 12,
        borderBottomWidth: 1, borderBottomColor: COLORS.divider,
    },
    modalItemActive: { backgroundColor: COLORS.accent + '15', borderRadius: 10 },
    modalItemText: { color: COLORS.white, fontSize: 16 },
    modalItemTextActive: { color: COLORS.accent, fontWeight: '600' },
    selectBtn: {
        paddingVertical: 10, paddingHorizontal: 16,
        borderRadius: 20, borderWidth: 1, borderColor: COLORS.divider,
        backgroundColor: COLORS.surface,
    },
    selectBtnActive: {
        borderColor: COLORS.accent, backgroundColor: COLORS.accent + '20',
    },
    selectBtnText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
    selectBtnTextActive: { color: COLORS.accent, fontWeight: '600' },
    submitBtn: { marginTop: 40, borderRadius: 14, overflow: 'hidden' },
    submitGradient: {
        padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8
    },
    submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    skipBtn: { marginTop: 20, alignItems: 'center' },
    skipText: { color: COLORS.textMuted, fontSize: 14 }
});

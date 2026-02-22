import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';

export default function JournalEntryScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSave = async () => {
        if (!title && !body) return;
        try {
            await api.post('/api/student/mood/journal', { title, body });
            Toast.show({
                type: 'success',
                text1: 'Journal Saved',
                text2: 'Entry securely stored.',
                position: 'bottom',
                bottomOffset: 100,
            });
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save journal. Please try again.',
                position: 'bottom',
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>New Entry</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={styles.keyboardAvoid}
            >
                <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

                    <TextInput
                        style={styles.titleInput}
                        placeholder="Title"
                        placeholderTextColor={COLORS.muted}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={styles.bodyInput}
                        placeholder="Write your thoughts..."
                        placeholderTextColor={COLORS.cardBorder}
                        multiline
                        value={body}
                        onChangeText={setBody}
                        autoFocus
                    />

                    <View style={styles.lockContainer}>
                        <Feather name="lock" size={12} color={COLORS.muted} />
                        <Text style={styles.lockText}>Encrypted & Private</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, (!title && !body) && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={!title && !body}
                    >
                        <Text style={globalStyles.buttonText}>Save Entry</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: COLORS.bg,
    },
    title: {
        ...globalStyles.heading,
        fontSize: 20,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    titleInput: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    bodyInput: {
        color: COLORS.white,
        fontSize: 16,
        lineHeight: 24,
        minHeight: 250,
        textAlignVertical: 'top',
    },
    lockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    lockText: {
        color: COLORS.muted,
        fontSize: 12,
        marginLeft: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    saveButton: {
        ...globalStyles.pillButton,
    },
    disabledButton: {
        backgroundColor: COLORS.cardBorder,
        opacity: 0.5,
    }
});

import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, ScrollView, StyleSheet,
    TouchableOpacity, KeyboardAvoidingView, Platform,
    ActivityIndicator, Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';

const QUICK_PROMPTS = [
    { icon: '🍎', text: 'What should I eat for protein?' },
    { icon: '🏋️', text: 'Quick 15-min workout for hostel room' },
    { icon: '😴', text: 'How to sleep better during exams?' },
    { icon: '🧘', text: 'Stress management tips for students' },
];

const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot, delay) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                ])
            ).start();
        };
        animate(dot1, 0);
        animate(dot2, 150);
        animate(dot3, 300);
    }, []);

    return (
        <View style={styles.typingRow}>
            <View style={styles.botBubble}>
                <View style={{ flexDirection: 'row', gap: 4, paddingVertical: 4 }}>
                    {[dot1, dot2, dot3].map((dot, i) => (
                        <Animated.View
                            key={i}
                            style={[styles.typingDot, { opacity: dot }]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    const sendMessage = async (text) => {
        const userMsg = text || input.trim();
        if (!userMsg || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const res = await api.post('/api/student/chat', {
                message: userMsg,
                history: newMessages.slice(-10)
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I couldn\'t connect right now. Please try again. 🙏'
            }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.surface, COLORS.bg]}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.botAvatar}>
                        <Text style={{ fontSize: 18 }}>🤖</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Sprout</Text>
                        <Text style={styles.headerSub}>Wellness • Fitness • Nutrition</Text>
                    </View>
                </View>
                <View style={{ width: 40 }} />
            </LinearGradient>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.chatArea}
                    contentContainerStyle={styles.chatContent}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    {/* Welcome message */}
                    {messages.length === 0 && (
                        <View style={styles.welcomeContainer}>
                            <View style={styles.welcomeIcon}>
                                <Text style={{ fontSize: 40 }}>🌿</Text>
                            </View>
                            <Text style={styles.welcomeTitle}>Hi! I'm Sprout</Text>
                            <Text style={styles.welcomeSub}>
                                Ask me anything about fitness, nutrition, sleep, stress management, or campus wellness.
                            </Text>

                            <Text style={[styles.welcomeSub, { marginTop: 20, fontSize: 12, fontWeight: '600', color: COLORS.textMuted }]}>
                                QUICK PROMPTS
                            </Text>
                            {QUICK_PROMPTS.map((p, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.quickPrompt}
                                    onPress={() => sendMessage(p.text)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{ fontSize: 16 }}>{p.icon}</Text>
                                    <Text style={styles.quickPromptText}>{p.text}</Text>
                                    <Feather name="arrow-right" size={14} color={COLORS.accent} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <View
                            key={idx}
                            style={msg.role === 'user' ? styles.userRow : styles.botRow}
                        >
                            {msg.role === 'assistant' && (
                                <View style={styles.botAvatarSmall}>
                                    <Text style={{ fontSize: 12 }}>🤖</Text>
                                </View>
                            )}
                            <View style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
                                <Text style={msg.role === 'user' ? styles.userText : styles.botText}>
                                    {msg.content}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {isLoading && <TypingIndicator />}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask about wellness, diet, fitness..."
                        placeholderTextColor={COLORS.textMuted}
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={500}
                        onSubmitEditing={() => sendMessage()}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnDisabled]}
                        onPress={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Feather name="send" size={18} color={!input.trim() ? COLORS.textMuted : '#FFF'} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    botAvatar: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: COLORS.accentGlow, borderWidth: 1, borderColor: COLORS.accent + '40',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
    headerSub: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '500' },

    chatArea: { flex: 1 },
    chatContent: { paddingHorizontal: 16, paddingVertical: 16, flexGrow: 1 },

    welcomeContainer: { alignItems: 'center', paddingTop: 30, paddingBottom: 20 },
    welcomeIcon: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    welcomeTitle: { color: COLORS.white, fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    welcomeSub: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 21, paddingHorizontal: 20 },

    quickPrompt: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.glassBorder,
        borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16,
        marginTop: 8, width: '100%',
    },
    quickPromptText: { flex: 1, color: COLORS.white, fontSize: 14, fontWeight: '500' },

    userRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
    botRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 12, gap: 8 },
    typingRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 12, gap: 8 },

    botAvatarSmall: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center',
        marginTop: 4,
    },
    userBubble: {
        backgroundColor: COLORS.accent, borderRadius: 18,
        borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 16,
        maxWidth: '80%',
    },
    botBubble: {
        backgroundColor: COLORS.card, borderRadius: 18,
        borderBottomLeftRadius: 4, paddingVertical: 10, paddingHorizontal: 16,
        maxWidth: '80%', borderWidth: 1, borderColor: COLORS.glassBorder,
    },
    userText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
    botText: { color: COLORS.white, fontSize: 15, lineHeight: 22 },

    typingDot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent,
    },

    inputBar: {
        flexDirection: 'row', alignItems: 'flex-end', gap: 8,
        paddingHorizontal: 16, paddingVertical: 12,
        borderTopWidth: 1, borderTopColor: COLORS.glassBorder, backgroundColor: COLORS.surface,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    },
    input: {
        flex: 1, color: COLORS.white, fontSize: 15,
        backgroundColor: COLORS.glass, borderRadius: 20,
        paddingHorizontal: 16, paddingVertical: 10,
        maxHeight: 100, borderWidth: 1, borderColor: COLORS.glassBorder,
    },
    sendBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center',
    },
    sendBtnDisabled: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder },
});

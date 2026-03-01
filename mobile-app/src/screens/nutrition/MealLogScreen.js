import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';
import { mockCanteenItems } from '../../constants/mockData';

const MealTypeBtn = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.mealTypeBtn, active && styles.mealTypeBtnActive]}
        activeOpacity={0.7}
    >
        <Text style={[styles.mealTypeTxt, active && styles.mealTypeTxtActive]}>{label}</Text>
    </TouchableOpacity>
);

export default function MealLogScreen({ navigation, route }) {
    const [mealType, setMealType] = useState(route?.params?.mealType || 'Breakfast');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [customName, setCustomName] = useState('');
    const [customKcal, setCustomKcal] = useState('');
    const [nextCustomId, setNextCustomId] = useState(1000);

    // API search state
    const [apiResults, setApiResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimer = useRef(null);

    // Debounced API search
    const handleSearchChange = (text) => {
        setSearchQuery(text);
        if (searchTimer.current) clearTimeout(searchTimer.current);

        if (text.trim().length < 2) {
            setApiResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        searchTimer.current = setTimeout(async () => {
            try {
                const res = await api.get(`/api/student/nutrition/search?q=${encodeURIComponent(text.trim())}`);
                setApiResults(res.data.items || []);
            } catch (e) {
                setApiResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 600);
    };

    // Combine mock canteen items with API results
    const filteredCanteen = mockCanteenItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayItems = searchQuery.trim().length >= 2
        ? [...filteredCanteen, ...apiResults]
        : mockCanteenItems;

    const addItem = (item) => {
        const existing = selectedItems.find(i => i.id === item.id);
        if (existing) {
            setSelectedItems(selectedItems.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ));
        } else {
            setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
        }
    };

    const addCustomItem = () => {
        if (!customName.trim() || !customKcal.trim()) return;
        const kcal = parseInt(customKcal);
        const estProtein = Math.round((kcal * 0.20) / 4);
        const estCarbs = Math.round((kcal * 0.50) / 4);
        const estFats = Math.round((kcal * 0.30) / 9);

        const newItem = {
            id: nextCustomId,
            name: customName.trim(),
            kcal, protein: estProtein, carbs: estCarbs, fats: estFats,
            icon: '✏️', quantity: 1
        };
        setSelectedItems([...selectedItems, newItem]);
        setNextCustomId(nextCustomId + 1);
        setCustomName('');
        setCustomKcal('');
    };

    const removeItem = (id) => {
        setSelectedItems(selectedItems.map(i =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0));
    };

    const totalKcal = selectedItems.reduce((sum, item) => sum + ((item.kcal || 0) * item.quantity), 0);
    const totalProtein = selectedItems.reduce((sum, item) => sum + ((item.protein || 0) * item.quantity), 0);
    const totalCarbs = selectedItems.reduce((sum, item) => sum + ((item.carbs || 0) * item.quantity), 0);
    const totalFats = selectedItems.reduce((sum, item) => sum + ((item.fats || 0) * item.quantity), 0);

    const handleLogMeal = async () => {
        if (totalKcal === 0) return;
        try {
            await api.post('/api/student/nutrition/log', {
                mealType,
                foodItems: selectedItems.map(i => i.name),
                calories: totalKcal,
                protein: totalProtein,
                carbs: totalCarbs,
                fats: totalFats
            });
            Toast.show({
                type: 'success',
                text1: 'Meal Logged 🎉',
                text2: `${totalKcal} kcal added to ${mealType}`,
                position: 'bottom',
                bottomOffset: 100,
            });
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to log meal.',
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
                <Text style={styles.title}>Log Meal</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

                {/* Meal Type Selector */}
                <View style={styles.mealTypeRow}>
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(type => (
                        <MealTypeBtn
                            key={type}
                            label={type}
                            active={mealType === type}
                            onPress={() => setMealType(type)}
                        />
                    ))}
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search any food (e.g. paneer tikka)..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                    {isSearching && <ActivityIndicator size="small" color={COLORS.accent} style={{ marginRight: 10 }} />}
                </View>

                {searchQuery.trim().length >= 2 && apiResults.length > 0 && (
                    <View style={styles.apiBadge}>
                        <Feather name="globe" size={12} color={COLORS.accent} />
                        <Text style={styles.apiBadgeText}>Live nutrition data from CalorieNinjas</Text>
                    </View>
                )}

                {/* Food Results */}
                <GlassCard noPad style={{ marginBottom: 16 }}>
                    {displayItems.length === 0 ? (
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <Feather name="search" size={24} color={COLORS.textMuted} />
                            <Text style={{ color: COLORS.textSecondary, marginTop: 8, textAlign: 'center', fontSize: 14 }}>
                                No results found. Try a different search or add a custom food below.
                            </Text>
                        </View>
                    ) : (
                        displayItems.map((item, idx) => {
                            const inCart = selectedItems.find(i => i.id === item.id);
                            return (
                                <TouchableOpacity key={item.id} onPress={() => addItem(item)} activeOpacity={0.7}>
                                    <View style={[styles.foodRow, idx < displayItems.length - 1 && styles.foodBorder]}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <Text style={styles.foodIcon}>{item.icon || '🍽️'}</Text>
                                                <Text style={styles.foodName}>{item.name}</Text>
                                                {item.source === 'api' && (
                                                    <View style={styles.liveTag}>
                                                        <Text style={styles.liveTagText}>API</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.foodMacro}>
                                                {item.kcal} kcal • P:{item.protein}g C:{item.carbs}g F:{item.fats}g
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            {inCart && (
                                                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.qtyBtn}>
                                                    <Feather name="minus" size={14} color={COLORS.danger} />
                                                </TouchableOpacity>
                                            )}
                                            {inCart && <Text style={styles.qtyText}>{inCart.quantity}</Text>}
                                            <TouchableOpacity onPress={() => addItem(item)} style={[styles.qtyBtn, { backgroundColor: COLORS.accentGlow }]}>
                                                <Feather name="plus" size={14} color={COLORS.accent} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </GlassCard>

                {/* Custom Food */}
                <Text style={globalStyles.sectionLabel}>ADD CUSTOM FOOD</Text>
                <GlassCard style={{ marginBottom: 16 }}>
                    <View style={styles.customRow}>
                        <TextInput
                            style={[styles.customInput, { flex: 2 }]}
                            placeholder="Food name"
                            placeholderTextColor={COLORS.textMuted}
                            value={customName}
                            onChangeText={setCustomName}
                        />
                        <TextInput
                            style={[styles.customInput, { flex: 1 }]}
                            placeholder="kcal"
                            placeholderTextColor={COLORS.textMuted}
                            value={customKcal}
                            onChangeText={setCustomKcal}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={[styles.customAddBtn, (!customName.trim() || !customKcal.trim()) && { opacity: 0.4 }]}
                            onPress={addCustomItem}
                            disabled={!customName.trim() || !customKcal.trim()}
                        >
                            <Feather name="plus" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </GlassCard>

                {/* Selected Items Summary */}
                {selectedItems.length > 0 && (
                    <>
                        <Text style={globalStyles.sectionLabel}>YOUR MEAL</Text>
                        <GlassCard noPad style={{ marginBottom: 16 }}>
                            {selectedItems.map((item, idx) => (
                                <View key={item.id} style={[styles.summaryRow, idx < selectedItems.length - 1 && styles.foodBorder]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.foodName}>{item.name} × {item.quantity}</Text>
                                        <Text style={styles.foodMacro}>{(item.kcal * item.quantity)} kcal</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                                        <Feather name="x" size={18} color={COLORS.danger} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{totalKcal} kcal</Text>
                            </View>
                            <View style={styles.macroSummary}>
                                <Text style={styles.macroChip}>P: {Math.round(totalProtein)}g</Text>
                                <Text style={styles.macroChip}>C: {Math.round(totalCarbs)}g</Text>
                                <Text style={styles.macroChip}>F: {Math.round(totalFats)}g</Text>
                            </View>
                        </GlassCard>
                    </>
                )}

                {/* Log Button */}
                <TouchableOpacity
                    style={[styles.logBtn, totalKcal === 0 && styles.logBtnDisabled]}
                    onPress={handleLogMeal}
                    disabled={totalKcal === 0}
                    activeOpacity={0.85}
                >
                    <Feather name="check-circle" size={18} color={totalKcal === 0 ? COLORS.textMuted : '#FFF'} />
                    <Text style={[styles.logBtnText, totalKcal === 0 && { color: COLORS.textMuted }]}>
                        Log {mealType} • {totalKcal} kcal
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    },
    title: { color: COLORS.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    mealTypeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    mealTypeBtn: {
        flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.glassBorder, backgroundColor: COLORS.card,
    },
    mealTypeBtnActive: {
        borderColor: COLORS.accent, backgroundColor: COLORS.accentGlow,
    },
    mealTypeTxt: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
    mealTypeTxtActive: { color: COLORS.accent, fontWeight: '700' },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.glassBorder,
        borderRadius: 14, marginBottom: 12, paddingHorizontal: 14,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, color: COLORS.white, paddingVertical: 14, fontSize: 15 },

    apiBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginBottom: 10, paddingLeft: 4,
    },
    apiBadgeText: { color: COLORS.accent, fontSize: 11, fontWeight: '600' },

    foodRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 16,
    },
    foodBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    foodIcon: { fontSize: 16 },
    foodName: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
    foodMacro: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },

    liveTag: {
        backgroundColor: COLORS.accent + '20', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
    },
    liveTagText: { color: COLORS.accent, fontSize: 9, fontWeight: '800' },

    qtyBtn: {
        width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.glassBorder, backgroundColor: COLORS.surface,
    },
    qtyText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

    customRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    customInput: {
        backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.divider,
        borderRadius: 10, color: COLORS.white, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    },
    customAddBtn: {
        width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center',
        backgroundColor: COLORS.accent,
    },

    summaryRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 16,
    },
    totalRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: COLORS.divider,
    },
    totalLabel: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
    totalValue: { color: COLORS.accent, fontSize: 18, fontWeight: '800' },
    macroSummary: {
        flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 14,
    },
    macroChip: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },

    logBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.accent, paddingVertical: 16, borderRadius: 14, marginTop: 8,
    },
    logBtnDisabled: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder },
    logBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

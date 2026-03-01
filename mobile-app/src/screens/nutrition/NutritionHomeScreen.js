import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { GlassCard } from '../../components/GlassCard';

const MacroBar = ({ label, icon, current, max }) => {
    const pct = Math.min((current / max) * 100, 100);
    return (
        <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
                <View style={styles.macroLabelRow}>
                    <Feather name={icon} size={13} color={COLORS.textSecondary} />
                    <Text style={styles.macroLabel}>{label}</Text>
                </View>
                <Text style={styles.macroVal}>{current}g / {max}g</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
        </View>
    );
};

const MEALS = [
    { key: 'Breakfast', icon: 'sunrise' },
    { key: 'Lunch', icon: 'sun' },
    { key: 'Dinner', icon: 'moon' },
    { key: 'Snacks', icon: 'coffee' },
];

const CALORIE_GOAL = 2000;

export default function NutritionHomeScreen({ navigation }) {
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFats, setTotalFats] = useState(0);
    const [meals, setMeals] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                try {
                    const res = await api.get('/api/student/nutrition/today');
                    setTotalCalories(res.data.totalCalories || 0);
                    setTotalProtein(res.data.totalProtein || 0);
                    setTotalCarbs(res.data.totalCarbs || 0);
                    setTotalFats(res.data.totalFats || 0);
                    setMeals(res.data.meals || []);
                } catch (e) { }
            };
            fetch();
        }, [])
    );

    const getMealData = (type) => {
        const found = meals.find(m => m?.mealType?.trim().toLowerCase() === type.trim().toLowerCase());
        return found ? { sub: `${Math.round(found.calories)} kcal logged`, kcal: Math.round(found.calories), done: true } : null;
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={styles.scroll}>

            <View style={styles.headerRow}>
                <Text style={globalStyles.heading}>Today's Nutrition</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NutritionHistoryScreen')} style={styles.historyLink}>
                    <Text style={styles.historyText}>History</Text>
                    <Feather name="arrow-right" size={14} color={COLORS.accent} />
                </TouchableOpacity>
            </View>

            {/* Calorie Ring */}
            <GlassCard glow style={styles.calorieCard}>
                <AnimatedCircularProgress
                    size={180}
                    width={14}
                    fill={Math.min((totalCalories / CALORIE_GOAL) * 100, 100)}
                    tintColor={COLORS.accent}
                    backgroundColor={COLORS.border}
                    rotation={270}
                    lineCap="round"
                >
                    {() => (
                        <View style={styles.calorieInner}>
                            <Text style={styles.calorieNum}>{Math.round(totalCalories)}</Text>
                            <Text style={styles.calorieSub}>/ {CALORIE_GOAL} kcal</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>

                <View style={styles.macros}>
                    <MacroBar label="Protein" icon="droplet" current={Math.round(totalProtein)} max={60} />
                    <MacroBar label="Carbs" icon="layers" current={Math.round(totalCarbs)} max={250} />
                    <MacroBar label="Fats" icon="disc" current={Math.round(totalFats)} max={65} />
                </View>
            </GlassCard>

            {/* Meals */}
            <Text style={globalStyles.sectionLabel}>MEALS</Text>
            <GlassCard noPad>
                {MEALS.map(({ key, icon }, idx) => {
                    const data = getMealData(key);
                    return (
                        <View key={key} style={[styles.mealRow, idx < MEALS.length - 1 && styles.mealBorder]}>
                            <View style={styles.mealLeft}>
                                <View style={styles.mealIcon}>
                                    <Feather name={icon} size={20} color={COLORS.accent} />
                                </View>
                                <View>
                                    <Text style={styles.mealName}>{key}</Text>
                                    <Text style={styles.mealSub}>{data ? data.sub : 'Not logged yet'}</Text>
                                </View>
                            </View>
                            {data ? (
                                <View style={styles.mealCheck}>
                                    <Text style={styles.mealKcal}>{data.kcal}</Text>
                                    <Feather name="check-circle" size={18} color={COLORS.success} />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={() => navigation.navigate('MealLogScreen', { mealType: key })}
                                    activeOpacity={0.75}
                                >
                                    <Feather name="plus" size={14} color={COLORS.accent} />
                                    <Text style={styles.addText}>Add</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </GlassCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 },
    historyLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    historyText: { color: COLORS.accent, fontSize: 15, fontWeight: '700' },
    calorieCard: { alignItems: 'center', paddingVertical: 32, marginBottom: 4 },
    calorieInner: { alignItems: 'center' },
    calorieNum: { fontSize: 48, fontWeight: '700', color: COLORS.white, letterSpacing: -2 },
    calorieSub: { fontSize: 15, color: COLORS.textSecondary },
    macros: { width: '100%', marginTop: 26, paddingHorizontal: 8 },
    macroRow: { marginBottom: 16 },
    macroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
    macroLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    macroLabel: { color: COLORS.white, fontSize: 14, fontWeight: '500' },
    macroVal: { color: COLORS.textSecondary, fontSize: 13 },
    track: { height: 5, backgroundColor: COLORS.border, borderRadius: 3 },
    fill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
    mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18 },
    mealBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
    mealLeft: { flexDirection: 'row', alignItems: 'center' },
    mealIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accentGlow, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    mealName: { color: COLORS.white, fontSize: 16, fontWeight: '600', marginBottom: 2 },
    mealSub: { color: COLORS.textSecondary, fontSize: 13 },
    mealCheck: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    mealKcal: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.accent + '50', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.accentGlow },
    addText: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
});

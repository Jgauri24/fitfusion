import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';

const MacroBar = ({ label, current, max }) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
        <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{label}</Text>
                <Text style={styles.macroScore}>{current}g / {max}g</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${percentage}%` }]} />
            </View>
        </View>
    );
};

const MealCard = ({ icon, name, subtitle, kcal, isLogged, onAdd }) => (
    <View style={styles.mealCard}>
        <View style={styles.mealLeft}>
            <View style={styles.mealIconCircle}>
                <Text style={styles.mealIcon}>{icon}</Text>
            </View>
            <View>
                <Text style={styles.mealName}>{name}</Text>
                <Text style={styles.mealSubtitle}>{subtitle}</Text>
            </View>
        </View>
        <View style={styles.mealRight}>
            {isLogged ? (
                <>
                    <Text style={styles.mealKcal}>{kcal} kcal</Text>
                    <Feather name="check" size={20} color={COLORS.accent} style={{ marginLeft: 10 }} />
                </>
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Text style={styles.addText}>+ Add</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const CALORIE_GOAL = 2000;

const MEAL_TYPES = [
    { key: 'Breakfast', icon: '🍳' },
    { key: 'Lunch', icon: '🍛' },
    { key: 'Dinner', icon: '🍽️' },
    { key: 'Snacks', icon: '🍎' },
];

export default function NutritionHomeScreen({ navigation }) {
    const [totalCalories, setTotalCalories] = useState(0);
    const [meals, setMeals] = useState([]);

    const fetchNutrition = async () => {
        try {
            const res = await api.get('/api/student/nutrition/today');
            setTotalCalories(res.data.totalCalories || 0);
            setMeals(res.data.meals || []);
        } catch (e) {
            console.error('Failed to fetch nutrition:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNutrition();
        }, [])
    );

    const getMealData = (mealType) => {
        const found = meals.find(m => m.mealType === mealType);
        return found ? { subtitle: `${Math.round(found.calories)} kcal logged`, kcal: Math.round(found.calories), isLogged: true } : null;
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <Text style={globalStyles.heading}>Today&apos;s Nutrition</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NutritionHistoryScreen')}>
                    <Text style={styles.historyLink}>History →</Text>
                </TouchableOpacity>
            </View>

            <Card style={styles.calorieCard}>
                <AnimatedCircularProgress
                    size={180}
                    width={15}
                    fill={Math.min((totalCalories / CALORIE_GOAL) * 100, 100)}
                    tintColor={COLORS.accent}
                    backgroundColor={COLORS.bg}
                    rotation={270}
                    lineCap="round"
                >
                    {() => (
                        <View style={styles.calorieInner}>
                            <Text style={styles.calorieText}>{Math.round(totalCalories)}</Text>
                            <Text style={styles.calorieMuted}>/ {CALORIE_GOAL} kcal</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>

                <View style={styles.macrosContainer}>
                    <MacroBar label="Protein" current={Math.round(totalCalories * 0.03)} max={60} />
                    <MacroBar label="Carbs" current={Math.round(totalCalories * 0.12)} max={250} />
                    <MacroBar label="Fats" current={Math.round(totalCalories * 0.03)} max={65} />
                </View>
            </Card>

            <Text style={globalStyles.sectionLabel}>MEALS</Text>
            <View style={styles.mealsList}>
                {MEAL_TYPES.map(({ key, icon }) => {
                    const data = getMealData(key);
                    return (
                        <MealCard
                            key={key}
                            icon={icon}
                            name={key}
                            subtitle={data ? data.subtitle : 'Not logged yet'}
                            kcal={data?.kcal}
                            isLogged={!!data}
                            onAdd={() => navigation.navigate('MealLogScreen')}
                        />
                    );
                })}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.container,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    historyLink: {
        color: COLORS.accent,
        fontSize: 16,
        fontWeight: 'bold',
    },
    calorieCard: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 20,
    },
    calorieInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    calorieText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    calorieMuted: {
        fontSize: 16,
        color: COLORS.muted,
    },
    macrosContainer: {
        width: '100%',
        marginTop: 30,
        paddingHorizontal: 10,
    },
    macroRow: {
        marginBottom: 15,
    },
    macroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    macroLabel: {
        color: COLORS.white,
        fontSize: 14,
    },
    macroScore: {
        color: COLORS.mutedLight,
        fontSize: 14,
    },
    track: {
        height: 6,
        backgroundColor: COLORS.bg,
        borderRadius: 3,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 3,
    },
    mealsList: {
        marginTop: 10,
    },
    mealCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    mealIcon: {
        fontSize: 24,
    },
    mealName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    mealSubtitle: {
        color: COLORS.muted,
        fontSize: 14,
    },
    mealRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealKcal: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    addButton: {
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    addText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 14,
    }
});

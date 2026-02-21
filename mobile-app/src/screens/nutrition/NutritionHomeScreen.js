import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Feather } from '@expo/vector-icons';
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

export default function NutritionHomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            <View style={styles.header}>
                <Text style={globalStyles.heading}>Today's Nutrition</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NutritionHistoryScreen')}>
                    <Text style={styles.historyLink}>History →</Text>
                </TouchableOpacity>
            </View>

            <Card style={styles.calorieCard}>
                <AnimatedCircularProgress
                    size={180}
                    width={15}
                    fill={(1450 / 2000) * 100}
                    tintColor={COLORS.accent}
                    backgroundColor={COLORS.bg}
                    rotation={270}
                    lineCap="round"
                >
                    {() => (
                        <View style={styles.calorieInner}>
                            <Text style={styles.calorieText}>1450</Text>
                            <Text style={styles.calorieMuted}>/ 2000 kcal</Text>
                        </View>
                    )}
                </AnimatedCircularProgress>

                <View style={styles.macrosContainer}>
                    <MacroBar label="Protein" current={45} max={60} />
                    <MacroBar label="Carbs" current={180} max={250} />
                    <MacroBar label="Fats" current={40} max={65} />
                </View>
            </Card>

            <Text style={globalStyles.sectionLabel}>MEALS</Text>
            <View style={styles.mealsList}>
                <MealCard
                    icon="🍳" name="Breakfast" subtitle="Poha + Chai" kcal={380} isLogged={true}
                />
                <MealCard
                    icon="🍛" name="Lunch" subtitle="Dal Rice + Salad" kcal={620} isLogged={true}
                />
                <MealCard
                    icon="🍽️" name="Dinner" subtitle="Not logged yet" isLogged={false}
                    onAdd={() => navigation.navigate('MealLogScreen')}
                />
                <MealCard
                    icon="🍎" name="Snacks" subtitle="Not logged yet" isLogged={false}
                    onAdd={() => navigation.navigate('MealLogScreen')}
                />
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

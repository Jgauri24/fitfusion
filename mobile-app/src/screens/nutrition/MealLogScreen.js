import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockCanteenItems } from '../../constants/mockData';

export default function MealLogScreen({ navigation }) {
    const [mealType, setMealType] = useState('Dinner');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const filteredItems = mockCanteenItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const removeItem = (id) => {
        setSelectedItems(selectedItems.map(i =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0));
    };

    const totalKcal = selectedItems.reduce((sum, item) => sum + (item.kcal * item.quantity), 0);

    const handleLogMeal = async () => {
        if (totalKcal === 0) return;
        try {
            await api.post('/api/student/nutrition/log', {
                mealType,
                foodItems: selectedItems.map(i => i.name),
                calories: totalKcal,
            });
            Toast.show({
                type: 'success',
                text1: 'Meal Logged 🎉',
                text2: `Successfully added ${totalKcal} kcal to ${mealType}`,
                position: 'bottom',
                bottomOffset: 100,
            });
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to log meal. Please try again.',
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

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={mealType}
                        onValueChange={setMealType}
                        dropdownIconColor={COLORS.white}
                    >
                        <Picker.Item label="Breakfast" value="Breakfast" color={COLORS.bg} />
                        <Picker.Item label="Lunch" value="Lunch" color={COLORS.bg} />
                        <Picker.Item label="Snacks" value="Snacks" color={COLORS.bg} />
                        <Picker.Item label="Dinner" value="Dinner" color={COLORS.bg} />
                    </Picker>
                </View>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color={COLORS.muted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search campus food..."
                        placeholderTextColor={COLORS.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <Text style={globalStyles.sectionLabel}>MENU</Text>
                {filteredItems.map(item => (
                    <TouchableOpacity key={`menu-${item.id}`} onPress={() => addItem(item)}>
                        <Card style={styles.menuItem}>
                            <View style={styles.menuLeft}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <View>
                                    <Text style={styles.menuName}>{item.name}</Text>
                                    <Text style={styles.menuKcal}>{item.kcal} kcal</Text>
                                </View>
                            </View>
                            <Feather name="plus-circle" size={24} color={COLORS.accent} />
                        </Card>
                    </TouchableOpacity>
                ))}

                {selectedItems.length > 0 && (
                    <>
                        <Text style={[globalStyles.sectionLabel, { marginTop: 30 }]}>SELECTED ITEMS</Text>
                        {selectedItems.map(item => (
                            <View key={`selected-${item.id}`} style={styles.selectedItemRow}>
                                <Text style={styles.selectedName}>{item.name}</Text>
                                <View style={styles.stepperContainer}>
                                    <TouchableOpacity style={styles.stepperBtn} onPress={() => removeItem(item.id)}>
                                        <Feather name="minus" size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <Text style={styles.stepperQty}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.stepperBtn} onPress={() => addItem(item)}>
                                        <Feather name="plus" size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.selectedKcal}>{item.kcal * item.quantity} kcal</Text>
                            </View>
                        ))}
                    </>
                )}

            </ScrollView>

            {/* Bottom Floating Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{totalKcal} <Text style={{ fontSize: 14 }}>kcal</Text></Text>
                </View>
                <TouchableOpacity
                    style={[styles.logButton, totalKcal === 0 && styles.disabledButton]}
                    onPress={handleLogMeal}
                    disabled={totalKcal === 0}
                >
                    <Text style={globalStyles.buttonText}>Log Meal</Text>
                </TouchableOpacity>
            </View>
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
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pickerContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        marginBottom: 15,
        overflow: 'hidden',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: COLORS.white,
        paddingVertical: 15,
        fontSize: 16,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 15,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    menuName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuKcal: {
        color: COLORS.muted,
        fontSize: 14,
        marginTop: 2,
    },
    selectedItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    selectedName: {
        color: COLORS.white,
        fontSize: 16,
        flex: 1,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
        borderRadius: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginHorizontal: 15,
    },
    stepperBtn: {
        padding: 5,
    },
    stepperQty: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
    },
    selectedKcal: {
        color: COLORS.accent,
        fontWeight: 'bold',
        width: 60,
        textAlign: 'right',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        color: COLORS.muted,
        fontSize: 14,
        textTransform: 'uppercase',
    },
    totalValue: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    logButton: {
        ...globalStyles.pillButton,
        paddingHorizontal: 40,
    },
    disabledButton: {
        backgroundColor: COLORS.cardBorder,
        opacity: 0.5,
    }
});

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/styles';
import { Card } from '../../components/Card';
import { mockWeekly, mockActivities } from '../../constants/mockData';

const screenWidth = Dimensions.get('window').width;

const IntensityBadge = ({ intensity }) => {
    let color = COLORS.muted;
    if (intensity === 'High') color = COLORS.accent;
    if (intensity === 'Moderate') color = COLORS.amber;

    return (
        <View style={[styles.intensityBadge, { borderColor: color }]}>
            <Text style={[styles.intensityText, { color }]}>{intensity}</Text>
        </View>
    );
};

export default function ActivityHomeScreen({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={globalStyles.heading}>Activity</Text>
                </View>

                {/* Streak Card */}
                <Card style={styles.streakCard}>
                    <Text style={styles.flameIcon}>🔥</Text>
                    <Text style={styles.streakTitle}>4 Day Streak</Text>
                    <Text style={styles.streakMuted}>Keep it going!</Text>
                </Card>

                {/* Consistency Score Card */}
                <Card style={styles.consistencyCard}>
                    <Text style={styles.consistencyTitle}>Consistency Score: <Text style={{ color: COLORS.white }}>65</Text></Text>
                    <Text style={styles.consistencyWarning}>Needs Improvement</Text>
                </Card>

                <Text style={globalStyles.sectionLabel}>THIS WEEK (MINUTES)</Text>
                <View style={styles.chartCard}>
                    <BarChart
                        data={{
                            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            datasets: [{ data: mockWeekly }]
                        }}
                        width={screenWidth - 40}
                        height={220}
                        yAxisSuffix="m"
                        chartConfig={{
                            backgroundColor: COLORS.card,
                            backgroundGradientFrom: COLORS.card,
                            backgroundGradientTo: COLORS.card,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(200, 255, 87, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForBackgroundLines: { stroke: COLORS.cardBorder }
                        }}
                        style={styles.chart}
                        showBarTops={false}
                        flatColor={true}
                    />
                </View>

                <Text style={[globalStyles.sectionLabel, { marginTop: 30 }]}>RECENT WORKOUTS</Text>
                <View style={styles.activitiesList}>
                    {mockActivities.map(act => (
                        <TouchableOpacity
                            key={act.id}
                            onPress={() => navigation.navigate('ActivityDetailScreen', { activity: act })}
                        >
                            <View style={styles.activityCard}>
                                <View style={styles.activityLeft}>
                                    <View style={styles.activityIconCircle}>
                                        <Text style={styles.activityIcon}>{act.icon}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.activityName}>{act.type}</Text>
                                        <Text style={styles.activityDuration}>{act.duration} • {act.date}</Text>
                                    </View>
                                </View>
                                <IntensityBadge intensity={act.intensity} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ActivityLogScreen')}
            >
                <Feather name="plus" size={30} color="#0E0E0E" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    streakCard: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 15,
    },
    flameIcon: {
        fontSize: 64,
        marginBottom: 10,
    },
    streakTitle: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    streakMuted: {
        color: COLORS.muted,
        fontSize: 16,
    },
    consistencyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
    },
    consistencyTitle: {
        color: COLORS.muted,
        fontSize: 16,
    },
    consistencyWarning: {
        color: COLORS.amber,
        fontWeight: 'bold',
        fontSize: 14,
    },
    chartCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingTop: 15,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    chart: {
        borderRadius: 16,
    },
    activitiesList: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
    },
    activityCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activityIcon: {
        fontSize: 24,
    },
    activityName: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    activityDuration: {
        color: COLORS.muted,
        fontSize: 14,
    },
    intensityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    intensityText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});

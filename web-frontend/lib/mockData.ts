// ============================
// FitFusion Admin - Mock Data
// ============================

// ---------- Users ----------
export interface User {
    id: string;
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    hostel: string;
    branch: string;
    year: number;
    fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    dietaryPref: string;
    lastActive: string;
    caloriesAvg: number;
    stepsAvg: number;
    wellnessScore: number;
}

export const users: User[] = [
    { id: 'U001', name: 'Aarav Sharma', age: 20, gender: 'Male', height: 175, weight: 72, hostel: 'Rajendra Bhawan', branch: 'CSE', year: 2, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '2 hours ago', caloriesAvg: 2200, stepsAvg: 8500, wellnessScore: 78 },
    { id: 'U002', name: 'Priya Patel', age: 19, gender: 'Female', height: 162, weight: 55, hostel: 'Sarojini Bhawan', branch: 'ECE', year: 1, fitnessLevel: 'Beginner', dietaryPref: 'Vegan', lastActive: '30 min ago', caloriesAvg: 1800, stepsAvg: 6200, wellnessScore: 82 },
    { id: 'U003', name: 'Rohan Gupta', age: 21, gender: 'Male', height: 180, weight: 78, hostel: 'Govind Bhawan', branch: 'ME', year: 3, fitnessLevel: 'Advanced', dietaryPref: 'Non-Vegetarian', lastActive: '1 hour ago', caloriesAvg: 2800, stepsAvg: 12000, wellnessScore: 91 },
    { id: 'U004', name: 'Ananya Singh', age: 20, gender: 'Female', height: 165, weight: 58, hostel: 'Sarojini Bhawan', branch: 'CSE', year: 2, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '4 hours ago', caloriesAvg: 1950, stepsAvg: 7800, wellnessScore: 75 },
    { id: 'U005', name: 'Kabir Mehta', age: 22, gender: 'Male', height: 172, weight: 68, hostel: 'Jawahar Bhawan', branch: 'EE', year: 4, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '15 min ago', caloriesAvg: 2100, stepsAvg: 9200, wellnessScore: 85 },
    { id: 'U006', name: 'Diya Agarwal', age: 19, gender: 'Female', height: 158, weight: 52, hostel: 'Kasturba Bhawan', branch: 'BT', year: 1, fitnessLevel: 'Beginner', dietaryPref: 'Vegetarian', lastActive: '6 hours ago', caloriesAvg: 1700, stepsAvg: 5800, wellnessScore: 68 },
    { id: 'U007', name: 'Arjun Reddy', age: 21, gender: 'Male', height: 178, weight: 75, hostel: 'Rajendra Bhawan', branch: 'Civil', year: 3, fitnessLevel: 'Advanced', dietaryPref: 'Non-Vegetarian', lastActive: '45 min ago', caloriesAvg: 2600, stepsAvg: 11000, wellnessScore: 88 },
    { id: 'U008', name: 'Neha Joshi', age: 20, gender: 'Female', height: 160, weight: 54, hostel: 'Sarojini Bhawan', branch: 'IT', year: 2, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '3 hours ago', caloriesAvg: 1850, stepsAvg: 7200, wellnessScore: 79 },
    { id: 'U009', name: 'Vikram Thakur', age: 23, gender: 'Male', height: 182, weight: 82, hostel: 'Govind Bhawan', branch: 'ME', year: 4, fitnessLevel: 'Advanced', dietaryPref: 'Non-Vegetarian', lastActive: '20 min ago', caloriesAvg: 3000, stepsAvg: 13500, wellnessScore: 93 },
    { id: 'U010', name: 'Ishita Verma', age: 19, gender: 'Female', height: 163, weight: 56, hostel: 'Kasturba Bhawan', branch: 'CH', year: 1, fitnessLevel: 'Beginner', dietaryPref: 'Vegan', lastActive: '1 day ago', caloriesAvg: 1650, stepsAvg: 4900, wellnessScore: 62 },
    { id: 'U011', name: 'Siddharth Kumar', age: 21, gender: 'Male', height: 170, weight: 65, hostel: 'Cautley Bhawan', branch: 'CSE', year: 3, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '5 hours ago', caloriesAvg: 2050, stepsAvg: 8100, wellnessScore: 76 },
    { id: 'U012', name: 'Riya Kapoor', age: 20, gender: 'Female', height: 167, weight: 60, hostel: 'Sarojini Bhawan', branch: 'EE', year: 2, fitnessLevel: 'Intermediate', dietaryPref: 'Vegetarian', lastActive: '2 hours ago', caloriesAvg: 1900, stepsAvg: 7500, wellnessScore: 81 },
];

// ---------- Food & Nutrition ----------
export interface FoodItem {
    id: string;
    name: string;
    category: string;
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    portion: string;
}

export const foodItems: FoodItem[] = [
    { id: 'F001', name: 'Paneer Butter Masala', category: 'Main Course', meal: 'Lunch', calories: 350, protein: 18, carbs: 20, fats: 22, portion: '200g' },
    { id: 'F002', name: 'Roti (Whole Wheat)', category: 'Bread', meal: 'Lunch', calories: 120, protein: 4, carbs: 25, fats: 1, portion: '1 piece' },
    { id: 'F003', name: 'Dal Tadka', category: 'Main Course', meal: 'Dinner', calories: 180, protein: 12, carbs: 26, fats: 4, portion: '200ml' },
    { id: 'F004', name: 'Steamed Rice', category: 'Rice', meal: 'Lunch', calories: 206, protein: 4, carbs: 45, fats: 0.4, portion: '150g' },
    { id: 'F005', name: 'Aloo Paratha', category: 'Bread', meal: 'Breakfast', calories: 280, protein: 6, carbs: 38, fats: 12, portion: '1 piece' },
    { id: 'F006', name: 'Mixed Veg Curry', category: 'Main Course', meal: 'Dinner', calories: 150, protein: 5, carbs: 18, fats: 7, portion: '200g' },
    { id: 'F007', name: 'Masala Dosa', category: 'South Indian', meal: 'Breakfast', calories: 250, protein: 6, carbs: 35, fats: 10, portion: '1 piece' },
    { id: 'F008', name: 'Chole Bhature', category: 'Main Course', meal: 'Lunch', calories: 450, protein: 14, carbs: 55, fats: 20, portion: '1 plate' },
    { id: 'F009', name: 'Idli Sambhar', category: 'South Indian', meal: 'Breakfast', calories: 180, protein: 7, carbs: 32, fats: 2, portion: '3 pieces' },
    { id: 'F010', name: 'Chicken Biryani', category: 'Rice', meal: 'Lunch', calories: 400, protein: 22, carbs: 50, fats: 14, portion: '250g' },
    { id: 'F011', name: 'Fruit Salad', category: 'Snack', meal: 'Snack', calories: 95, protein: 1, carbs: 24, fats: 0.3, portion: '150g' },
    { id: 'F012', name: 'Protein Shake', category: 'Beverage', meal: 'Snack', calories: 220, protein: 30, carbs: 12, fats: 5, portion: '300ml' },
];

// ---------- Fitness Activities ----------
export interface Activity {
    id: string;
    type: string;
    participants: number;
    avgDuration: number;
    caloriesBurned: number;
    trending: boolean;
    category: string;
}

export const activities: Activity[] = [
    { id: 'A001', type: 'Gym Workout', participants: 340, avgDuration: 65, caloriesBurned: 450, trending: true, category: 'Strength' },
    { id: 'A002', type: 'Running', participants: 280, avgDuration: 40, caloriesBurned: 380, trending: true, category: 'Cardio' },
    { id: 'A003', type: 'Yoga', participants: 195, avgDuration: 50, caloriesBurned: 180, trending: false, category: 'Flexibility' },
    { id: 'A004', type: 'Cricket', participants: 160, avgDuration: 90, caloriesBurned: 350, trending: true, category: 'Sports' },
    { id: 'A005', type: 'Badminton', participants: 145, avgDuration: 55, caloriesBurned: 320, trending: false, category: 'Sports' },
    { id: 'A006', type: 'Swimming', participants: 110, avgDuration: 45, caloriesBurned: 400, trending: true, category: 'Cardio' },
    { id: 'A007', type: 'Cycling', participants: 125, avgDuration: 50, caloriesBurned: 350, trending: false, category: 'Cardio' },
    { id: 'A008', type: 'Football', participants: 98, avgDuration: 75, caloriesBurned: 420, trending: false, category: 'Sports' },
    { id: 'A009', type: 'Meditation', participants: 220, avgDuration: 25, caloriesBurned: 40, trending: true, category: 'Wellness' },
    { id: 'A010', type: 'HIIT Training', participants: 85, avgDuration: 30, caloriesBurned: 380, trending: false, category: 'Strength' },
];

// ---------- Mental Wellness ----------
export interface WellnessEntry {
    date: string;
    avgMood: number; // 1-5
    journalEntries: number;
    circleParticipants: number;
    stressLevel: number; // 1-10
    sleepAvg: number; // hours
}

export const wellnessData: WellnessEntry[] = [
    { date: 'Mon', avgMood: 3.8, journalEntries: 45, circleParticipants: 28, stressLevel: 5.2, sleepAvg: 6.8 },
    { date: 'Tue', avgMood: 3.5, journalEntries: 52, circleParticipants: 32, stressLevel: 6.1, sleepAvg: 6.5 },
    { date: 'Wed', avgMood: 4.1, journalEntries: 38, circleParticipants: 35, stressLevel: 4.8, sleepAvg: 7.1 },
    { date: 'Thu', avgMood: 3.9, journalEntries: 41, circleParticipants: 30, stressLevel: 5.5, sleepAvg: 6.9 },
    { date: 'Fri', avgMood: 4.3, journalEntries: 60, circleParticipants: 42, stressLevel: 4.2, sleepAvg: 7.3 },
    { date: 'Sat', avgMood: 4.5, journalEntries: 72, circleParticipants: 55, stressLevel: 3.5, sleepAvg: 8.1 },
    { date: 'Sun', avgMood: 4.2, journalEntries: 65, circleParticipants: 48, stressLevel: 3.8, sleepAvg: 7.8 },
];

export const moodDistribution = [
    { mood: '😊 Happy', percentage: 35, color: 'var(--green)' },
    { mood: '😌 Calm', percentage: 25, color: 'var(--accent)' },
    { mood: '😐 Neutral', percentage: 20, color: 'var(--yellow)' },
    { mood: '😰 Anxious', percentage: 12, color: 'var(--orange)' },
    { mood: '😞 Low', percentage: 8, color: 'var(--red)' },
];

// ---------- Environmental ----------
export interface EnvironmentZone {
    id: string;
    zone: string;
    aqi: number;
    aqiStatus: string;
    noiseDb: number;
    crowdDensity: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    lastUpdated: string;
}

export const environmentData: EnvironmentZone[] = [
    { id: 'E001', zone: 'Main Ground', aqi: 85, aqiStatus: 'Moderate', noiseDb: 45, crowdDensity: 'Low', temperature: 24, humidity: 62, rainfall: 0, lastUpdated: '5 min ago' },
    { id: 'E002', zone: 'Library Area', aqi: 42, aqiStatus: 'Good', noiseDb: 30, crowdDensity: 'Medium', temperature: 22, humidity: 55, rainfall: 0, lastUpdated: '3 min ago' },
    { id: 'E003', zone: 'Sports Complex', aqi: 95, aqiStatus: 'Moderate', noiseDb: 65, crowdDensity: 'High', temperature: 26, humidity: 58, rainfall: 0, lastUpdated: '2 min ago' },
    { id: 'E004', zone: 'Academic Block', aqi: 55, aqiStatus: 'Good', noiseDb: 40, crowdDensity: 'High', temperature: 23, humidity: 60, rainfall: 0, lastUpdated: '7 min ago' },
    { id: 'E005', zone: 'Hostel Zone (North)', aqi: 72, aqiStatus: 'Moderate', noiseDb: 50, crowdDensity: 'Medium', temperature: 25, humidity: 64, rainfall: 0, lastUpdated: '4 min ago' },
    { id: 'E006', zone: 'Hostel Zone (South)', aqi: 68, aqiStatus: 'Moderate', noiseDb: 48, crowdDensity: 'Medium', temperature: 25, humidity: 65, rainfall: 0, lastUpdated: '6 min ago' },
    { id: 'E007', zone: 'Mess Area', aqi: 78, aqiStatus: 'Moderate', noiseDb: 70, crowdDensity: 'High', temperature: 27, humidity: 70, rainfall: 0, lastUpdated: '1 min ago' },
    { id: 'E008', zone: 'Gym / Pool Area', aqi: 50, aqiStatus: 'Good', noiseDb: 55, crowdDensity: 'Medium', temperature: 24, humidity: 58, rainfall: 0, lastUpdated: '8 min ago' },
];

// ---------- Dashboard Stats ----------
export const dashboardStats = {
    totalUsers: 2847,
    activeToday: 1205,
    avgCalories: 2150,
    wellnessScore: 78,
    totalActivities: 15840,
    messServings: 8520,
};

// ---------- Weekly Activity Trends ----------
export const weeklyActivityTrend = [
    { day: 'Mon', count: 420 },
    { day: 'Tue', count: 380 },
    { day: 'Wed', count: 510 },
    { day: 'Thu', count: 460 },
    { day: 'Fri', count: 540 },
    { day: 'Sat', count: 670 },
    { day: 'Sun', count: 590 },
];

// ---------- Nutrition by Meal ----------
export const nutritionByMeal = [
    { meal: 'Breakfast', avgCalories: 450, color: 'var(--accent)' },
    { meal: 'Lunch', avgCalories: 720, color: 'var(--blue)' },
    { meal: 'Snacks', avgCalories: 280, color: 'var(--orange)' },
    { meal: 'Dinner', avgCalories: 650, color: 'var(--purple)' },
];

// ---------- Hostel Comparison ----------
export const hostelComparison = [
    { hostel: 'Rajendra', avgSteps: 8900, avgCalories: 2300, wellnessScore: 80, activeUsers: 185 },
    { hostel: 'Govind', avgSteps: 9500, avgCalories: 2450, wellnessScore: 85, activeUsers: 210 },
    { hostel: 'Jawahar', avgSteps: 7800, avgCalories: 2100, wellnessScore: 74, activeUsers: 165 },
    { hostel: 'Cautley', avgSteps: 8200, avgCalories: 2200, wellnessScore: 77, activeUsers: 155 },
    { hostel: 'Sarojini', avgSteps: 7200, avgCalories: 1900, wellnessScore: 82, activeUsers: 190 },
    { hostel: 'Kasturba', avgSteps: 6900, avgCalories: 1850, wellnessScore: 79, activeUsers: 145 },
];

// ---------- Analytics ----------
export const monthlyTrends = [
    { month: 'Sep', users: 1200, activities: 8500, meals: 35000 },
    { month: 'Oct', users: 1650, activities: 11200, meals: 42000 },
    { month: 'Nov', users: 2100, activities: 13800, meals: 48000 },
    { month: 'Dec', users: 1800, activities: 10500, meals: 38000 },
    { month: 'Jan', users: 2500, activities: 14600, meals: 52000 },
    { month: 'Feb', users: 2847, activities: 15840, meals: 55000 },
];

export const departmentStats = [
    { dept: 'CSE', users: 520, avgFitness: 82, engagement: 88 },
    { dept: 'ECE', users: 380, avgFitness: 78, engagement: 75 },
    { dept: 'ME', users: 420, avgFitness: 85, engagement: 82 },
    { dept: 'EE', users: 310, avgFitness: 76, engagement: 70 },
    { dept: 'Civil', users: 280, avgFitness: 80, engagement: 72 },
    { dept: 'BT', users: 190, avgFitness: 74, engagement: 68 },
    { dept: 'CH', users: 165, avgFitness: 73, engagement: 65 },
    { dept: 'IT', users: 340, avgFitness: 81, engagement: 85 },
];

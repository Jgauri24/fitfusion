import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Centralized API client.
 * Automatically detects your Mac's IP from the Expo dev server manifest,
 * attaches the JWT token to every request, and handles errors.
 */

// Automatically detect the dev server IP so you never have to hardcode it again
const getBaseUrl = () => {
    // In development, Expo exposes the host IP via the manifest
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        return `http://${ip}:8080`;
    }
    // Fallback
    if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
    return 'http://localhost:8080';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        console.error('Failed to get token for API request', e);
    }
    return config;
});

export default api;

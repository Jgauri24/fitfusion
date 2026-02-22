import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:8080', // the backend runs on port 8080
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject JWT token into the headers of every request
api.interceptors.request.use(
    (config) => {
        // Only run on the client side where window is defined
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Interceptor to handle global api errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                // Could optionally redirect to login here, but NextJS makes that complex inside non-components
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

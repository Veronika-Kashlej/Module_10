import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

authAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email: string, password: string) =>
        authAxios.post(`/api/login`, { email, password }),

    signup: (email: string, password: string) =>
        authAxios.post(`/api/signup`, { email, password }),

    logout: () => authAxios.post(`/api/logout`),

    getMe: () => authAxios.get(`/api/me`),
};

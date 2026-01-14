import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
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

api.interceptors.response.use(
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

export const postsAPI = {
    // Post
    getPosts: () => api.get(`/api/posts`),
    createPost: (data: { title: string; content: string; image?: string }) =>
        api.post(`/api/posts`, data),
    getUser: (userId: number) => api.get(`/api/users/${userId}`),
    uploadImage: (formData: FormData) =>
        api.post(`/api/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    // Comments
    getComments: (postId: number) => api.get(`/api/posts/${postId}/comments`),
    createComment: (data: { postId: number; text: string }) =>
        api.post(`/api/comments`, data),
    deleteComment: (commentId: number) =>
        api.delete(`/api/comments/${commentId}`),

    // Likes and dislikes
    likePost: (postId: number) => api.post(`/api/like`, { postId }),
    dislikePost: (postId: number) => api.post(`/api/dislike`, { postId }),
    getCurrentUsersLikedPosts: () => api.get(`/api/me/likes`),
};

export const authAPI = {
    login: (email: string, password: string) =>
        api.post(`/api/login`, { email, password }),

    signup: (email: string, password: string) =>
        api.post(`/api/signup`, { email, password }),

    logout: () => api.post(`/api/logout`),

    getMe: () => api.get(`/api/me`),
};

export const profileApi = {
    getSuggestedUsers: () => api.get(`/api/getSuggested`),
    getCommunities: () => api.get(`/api/groups`),
    updateProfile: (data: {
        username?: string;
        email?: string;
        description?: string;
        profileImage?: string;
    }) => api.put(`/api/profile`, data),
    getPosts: () => api.get(`/api/me/posts`),
    getComments: () => api.get(`/api/me/comments`),
    getLikes: () => api.get(`/api/me/likes`),
};

export default api;

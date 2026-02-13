import axios, { AxiosError, AxiosResponse } from 'axios';
import { postsAPI, profileApi } from './api';
import { authAPI } from './authApi';

export const createMockAuth = (overrides = {}) => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    const mockSignUp = jest.fn().mockResolvedValue({});
    const mockSignOut = jest.fn().mockResolvedValue({});
    const mockCheckAuth = jest.fn().mockResolvedValue({});
    const mockClearError = jest.fn();

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        checkAuth: mockCheckAuth,
        clearError: mockClearError,
        getUser: () => null,
        getToken: () => null,
        ...overrides,
    };
};

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockLocalStorage = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

const mockLocation = {
    href: '',
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

const createSuccessResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
});

const createErrorResponse = (status: number, data?: any): AxiosError => {
    const error = new Error('Request failed') as AxiosError;
    error.response = {
        data,
        status,
        statusText: 'Error',
        headers: {},
        config: {} as any,
    };
    return error;
};

describe('API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockClear();
        mockLocalStorage.removeItem.mockClear();
        mockLocation.href = '';
    });

    describe('Posts API Functions', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValue(createSuccessResponse({}));
            mockedAxios.post.mockResolvedValue(createSuccessResponse({}));
            mockedAxios.put.mockResolvedValue(createSuccessResponse({}));
            mockedAxios.delete.mockResolvedValue(createSuccessResponse({}));
        });

        test('getPosts should call axios.get with correct URL', async () => {
            const mockResponse = { data: [{ id: 1, title: 'Test Post' }] };
            mockedAxios.get.mockResolvedValueOnce(
                mockResponse as AxiosResponse
            );

            await postsAPI.getPosts();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/posts');
        });

        test('createPost should call axios.post with correct data', async () => {
            const postData = { title: 'New Post', content: 'Content' };
            const mockResponse = { data: { id: 1, ...postData } };
            mockedAxios.post.mockResolvedValueOnce(
                mockResponse as AxiosResponse
            );

            await postsAPI.createPost(postData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/posts',
                postData
            );
        });

        test('getUser should call axios.get with userId', async () => {
            const userId = 123;
            await postsAPI.getUser(userId);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                `/api/users/${userId}`
            );
        });

        test('uploadImage should call axios.post with FormData', async () => {
            const formData = new FormData();
            await postsAPI.uploadImage(formData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/upload-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
        });

        test('getComments should call axios.get with postId', async () => {
            const postId = 1;
            await postsAPI.getComments(postId);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                `/api/posts/${postId}/comments`
            );
        });

        test('createComment should call axios.post with comment data', async () => {
            const commentData = { postId: 1, text: 'New comment' };
            await postsAPI.createComment(commentData);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/comments',
                commentData
            );
        });

        test('deleteComment should call axios.delete with commentId', async () => {
            const commentId = 1;
            await postsAPI.deleteComment(commentId);

            expect(mockedAxios.delete).toHaveBeenCalledWith(
                `/api/comments/${commentId}`
            );
        });

        test('likePost should call axios.post with postId', async () => {
            const postId = 1;
            await postsAPI.likePost(postId);

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/like', {
                postId,
            });
        });

        test('dislikePost should call axios.post with postId', async () => {
            const postId = 1;
            await postsAPI.dislikePost(postId);

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/dislike', {
                postId,
            });
        });

        test('getCurrentUsersLikedPosts should call axios.get', async () => {
            await postsAPI.getCurrentUsersLikedPosts();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/me/likes');
        });
    });

    describe('Auth API Functions', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValue(createSuccessResponse({}));
            mockedAxios.post.mockResolvedValue(createSuccessResponse({}));
        });

        test('login should call axios.post with credentials', async () => {
            const credentials = {
                email: 'test@test.com',
                password: 'password123',
            };
            await authAPI.login(credentials.email, credentials.password);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/login',
                credentials
            );
        });

        test('signup should call axios.post with signup data', async () => {
            const signupData = {
                email: 'new@test.com',
                password: 'password123',
            };
            await authAPI.signup(signupData.email, signupData.password);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/signup',
                signupData
            );
        });

        test('logout should call axios.post', async () => {
            await authAPI.logout();

            expect(mockedAxios.post).toHaveBeenCalledWith('/api/logout');
        });

        test('getMe should call axios.get', async () => {
            await authAPI.getMe();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/me');
        });
    });

    describe('Profile API Functions', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValue(createSuccessResponse({}));
            mockedAxios.put.mockResolvedValue(createSuccessResponse({}));
        });

        test('getSuggestedUsers should call axios.get', async () => {
            await profileApi.getSuggestedUsers();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/getSuggested');
        });

        test('getCommunities should call axios.get', async () => {
            await profileApi.getCommunities();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/groups');
        });

        test('updateProfile should call axios.put with profile data', async () => {
            const profileData = {
                username: 'newUsername',
                description: 'New bio',
            };
            await profileApi.updateProfile(profileData);

            expect(mockedAxios.put).toHaveBeenCalledWith(
                '/api/profile',
                profileData
            );
        });

        test('getPosts should call axios.get', async () => {
            await profileApi.getPosts();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/me/posts');
        });

        test('getComments should call axios.get', async () => {
            await profileApi.getComments();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/me/comments');
        });

        test('getLikes should call axios.get', async () => {
            await profileApi.getLikes();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/me/likes');
        });
    });

    describe('Error Handling', () => {
        test('should reject on network error', async () => {
            const networkError = new Error('Network Error');
            mockedAxios.get.mockRejectedValueOnce(networkError);

            await expect(postsAPI.getPosts()).rejects.toThrow('Network Error');
        });

        test('should reject on 404 error', async () => {
            const error = createErrorResponse(404, { error: 'Not found' });
            mockedAxios.get.mockRejectedValueOnce(error);

            await expect(postsAPI.getPosts()).rejects.toThrow('Request failed');
        });
    });
});

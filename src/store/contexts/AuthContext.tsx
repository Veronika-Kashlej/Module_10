import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { AuthResponse, User } from "../types";

const mockUser: User = {
  email: "user@example.com",
  username: "John Doe",
  profilePhoto: "https://i.pravatar.cc/150?img=1",
};

const mockCredentials = {
  email: "user@example.com",
  password: "password123",
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  getCurrentUser: () => User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [refreshPromise, setRefreshPromise] = useState<Promise<
    string | null
  > | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      if (accessToken && userStr) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userStr));
      }
    };

    checkAuth();
  }, []);

  const getTokens = () => ({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  const setTokens = (
    accessToken: string,
    refreshToken: string,
    userData: User
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      throw new Error("Password is required");
    }
    if (password.includes(" ")) {
      throw new Error("Spaces aren't allowed");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (!/\d/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
    if (!/[a-zA-Z]/.test(password)) {
      throw new Error("Password must contain at least one letter");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      throw new Error("Email is required");
    }
    if (email.includes(" ")) {
      throw new Error("Spaces aren't allowed");
    }
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    validateEmail(email);
    validatePassword(password);

    // Mock success response
    const mockResponse: AuthResponse = {
      accessToken: `mock_access_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      user: { ...mockUser, email, username: email.split("@")[0] },
    };

    setTokens(
      mockResponse.accessToken,
      mockResponse.refreshToken,
      mockResponse.user
    );
    return mockResponse;
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // server request simulation

    validateEmail(email);
    validatePassword(password);

    if (
      email !== mockCredentials.email ||
      password !== mockCredentials.password
    ) {
      throw new Error("Invalid email or password");
    }

    // Mock success response
    const mockResponse: AuthResponse = {
      accessToken: `mock_access_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      user: mockUser,
    };

    setTokens(
      mockResponse.accessToken,
      mockResponse.refreshToken,
      mockResponse.user
    );
    return mockResponse;
  };

  const signOut = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // server request simulation
    clearTokens();
  };

  const refreshToken = async (): Promise<string | null> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    const promise = (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // server request

      const { refreshToken: storedRefreshToken } = getTokens();

      if (!storedRefreshToken) {
        clearTokens();
        return null;
      }

      const newAccessToken = `mock_new_access_${Date.now()}`;
      localStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    })();

    setRefreshPromise(promise);

    try {
      return await promise;
    } finally {
      setRefreshPromise(null);
    }
  };

  const makeRequest = async (
    url: string,
    options: RequestInit,
    token: string | null
  ): Promise<Response> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // server request simulation

    // Mock response
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: "Mock response" }),
      text: async () => "Mock response",
      clone: function () {
        return this;
      },
    } as Response;
  };

  const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    let { accessToken } = getTokens();

    let response = await makeRequest(url, options, accessToken);

    if (response.status === 401) {
      const newToken = await refreshToken();

      if (newToken) {
        response = await makeRequest(url, options, newToken);
      } else {
        throw new Error("Authentication failed");
      }
    }

    return response;
  };

  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    signUp,
    signIn,
    signOut,
    refreshToken,
    fetchWithAuth,
    getCurrentUser,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

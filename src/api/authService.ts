import { AuthResponse, mockCredentials, mockUser } from "./mockData";

class AuthService {
  private refreshPromise: Promise<string | null> | null = null;

  private getTokens() {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(mockUser));
  }

  private clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  async signUp(email: string, password: string) {
    this.validateEmail(email);
    this.validatePassword(password);

    // Mock succes response
    const mockResponse: AuthResponse = {
      accessToken: `mock_access_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      user: { ...mockUser, email, username: email.split("@")[0] },
    };

    this.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
    return mockResponse;
  }

  async signIn(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //server request

    this.validateEmail(email);
    this.validatePassword(password);

    if (
      email !== mockCredentials.email ||
      password !== mockCredentials.password
    ) {
      throw new Error("Invalid email or password");
    }

    //Mock success response
    const mockResponse: AuthResponse = {
      accessToken: `mock_access_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      user: mockUser,
    };

    this.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
    return mockResponse;
  }

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //server request
    this.clearTokens();
  }

  async refreshToken() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //server request

      const { refreshToken } = this.getTokens();

      if (!refreshToken) {
        this.clearTokens();
        return null;
      }

      const newAccessToken = `mock_new_access_${Date.now()}`;
      localStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async makeRequest(
    url: string,
    options: RequestInit,
    token: string | null
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //server request

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

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
  }

  async fetchWithAuth(url: string, options: RequestInit = {}) {
    let { accessToken } = this.getTokens();

    let response = await this.makeRequest(url, options, accessToken);

    if (response.status === 401) {
      const newToken = await this.refreshToken();

      if (newToken) {
        response = await this.makeRequest(url, options, newToken);
      } else {
        throw new Error("Authentication failed");
      }
    }

    return response;
  }

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  private validatePassword(password: string) {
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
  }

  private validateEmail(email: string) {
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
  }
}

export const authService = new AuthService();

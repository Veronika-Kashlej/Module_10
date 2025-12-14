export interface User {
  email: string;
  username: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const mockUser: User = {
  email: "user@example.com",
  username: "John Doe",
  avatar: "https://i.pravatar.cc/150?img=1",
};

export const mockCredentials = {
  email: "user@example.com",
  password: "password123",
};

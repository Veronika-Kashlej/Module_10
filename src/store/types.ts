export interface Post {
  id: number;
  username: string;
  timeAgo: string;
  description: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  imageUrl?: string;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
}

export interface User {
  email: string;
  profilePhoto: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Post {
  authorId: number;
  authorPhoto: string;
  commentsCount: number;
  content: string;
  creationDate: string;
  id: number;
  image?: string;
  likesCount: number;
  modifiedDate: string;
  title: string;
  likedByUsers: User[];
}

export interface LikedPost {
  id: number;
  postId: number;
  userId: number;
  creationDate: string;
}

export interface User {
  creationDate: string;
  description: string;
  email: string;
  firstName: string;
  id: number;
  lastLogin: string;
  modifiedDate: string;
  profileImage: string;
  secondName: string;
  username: string;
}

export interface SuggestedPeople {
  description: string;
  firstName: string;
  secondName: string;
  id: number;
  photo: string;
  username: string;
}

export interface Community {
  id: number;
  photo: string;
  title: string;
  membersCount: number;
}

export interface Comment {
  authorId: number;
  creationDate: string;
  id: number;
  text: string;
  modifiedDate: string;
  postId: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface StatisticsCard {
  title: string;
  count: number;
  progress: string;
}

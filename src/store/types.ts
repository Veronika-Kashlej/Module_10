export interface Post {
  id: number;
  username: string;
  timeAgo: string;
  description: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
}

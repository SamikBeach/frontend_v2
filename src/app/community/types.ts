export interface UserProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export interface Book {
  title: string;
  author: string;
  coverImage: string;
}

export interface Post {
  id: number;
  category: string;
  author: UserProfile;
  timestamp: string;
  content: string;
  book?: Book;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Comment {
  id: number;
  postId: number;
  author: UserProfile;
  content: string;
  timestamp: string;
  likes: number;
}

export interface ReadingGroup {
  id: number;
  name: string;
  members: number;
  image: string;
  description: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  subcategories?: Array<{
    id: string;
    name: string;
  }>;
}

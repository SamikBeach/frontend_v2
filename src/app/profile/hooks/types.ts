// Book 타입 정의
export type Book = {
  id: number | string;
  title: string;
  author: string;
  coverImage: string;
  rating?: number;
  category?: string;
  subcategory?: string;
  reviews?: number;
  description?: string;
  publishDate?: string;
  publisher?: string;
};

// 리뷰 타입 정의
export type Review = {
  id: number | string;
  book: {
    title: string;
    author: string;
    coverImage: string;
  };
  rating: number;
  content: string;
  date: string;
  likes: number;
  comments: number;
};

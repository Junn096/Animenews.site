export interface Post {
  id: string;
  title: string;
  description: string;
  content?: string; // Full content of the post
  category: 'Anime News' | 'Manga News' | 'Reviews' | 'Release Dates' | 'General';
  imageUrl: string;
  publishDate: string; // ISO String
  views: number;
  likes: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bookmarks: string[]; // Post IDs
  likedPosts: string[]; // Post IDs
}

export interface VisitorStats {
  viewsCount: number;
}

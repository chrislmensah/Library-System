export type BookFilter = "popular" | "most-liked" | "most-read" | "most-viewed" | "latest";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
  isFree: boolean;
  stats: {
    likes: number;
    reads: number;
    views: number;
  };
  addedAt: string; // ISO date
}
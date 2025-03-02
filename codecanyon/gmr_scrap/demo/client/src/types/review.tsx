import { GeoPoint, Timestamp } from "firebase/firestore";

export interface IReview {
  id?: string;
  address: string;
  createdAt: Timestamp;
  extendedUrl: string;
  rating: number;
  reviewId: string;
  reviews: number;
  screenshot: string;
  title: string;
  type: "info" | "comments";
  updatedAt: Timestamp;
  url: string;
  userId: string;
  limit?: number;
  sortBy?: "Most relevant" | "Newest" | "Highest rating" | "Lowest rating";
  extractImageUrls?: boolean;
  extractVideoUrls?: boolean;
  extractOwnerResponse?: boolean;
  status?: string;
  totalReviews?: number;
  totalImages?: number;
  totalVideos?: number;
  totalOwnerReviews?: number;
  csvUrl?: string;
  jsonUrl?: string;
  location?: GeoPoint;
}
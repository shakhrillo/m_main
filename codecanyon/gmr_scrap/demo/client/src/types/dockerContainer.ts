import { GeoPoint, Timestamp } from "firebase/firestore";
import { IDockerMachine } from "./dockerMachine";

export interface IDockerContainer {
  address?: string;
  createdAt?: Timestamp;
  extendedUrl?: string;
  id?: string;
  keywords?: string[];
  location?: GeoPoint;
  machine?: IDockerMachine;
  rating?: number;
  reviewId?: string;
  reviews?: number;
  screenshot?: string;
  status?: string;
  title?: string;
  type?: "info" | "comments";
  updatedAt?: Timestamp;
  url?: string;
  uid?: string;

  limit?: number;
  sortBy?: "Most relevant" | "Newest" | "Highest rating" | "Lowest rating";
  extractImageUrls?: boolean;
  extractVideoUrls?: boolean;
  extractOwnerResponse?: boolean;

  totalReviews?: number;
  totalImages?: number;
  totalVideos?: number;
  totalOwnerReviews?: number;

  outputAs?: "json" | "csv";
  csvUrl?: string;
  jsonUrl?: string;
}

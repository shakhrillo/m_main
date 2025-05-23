import type { GeoPoint, Timestamp } from "firebase/firestore";
import type { IDockerMachine } from "./dockerMachine";

interface IPrice {
  review?: number;
  image?: number;
  video?: number;
  response?: number;
}

interface IBrowser {
  browserName: string;
  browserVersion: string;
  platformName: string;
  platformVersion: string;
}

export interface IDockerContainer {
  address?: string;
  createdAt?: Timestamp;
  extendedUrl?: string;
  id?: string;
  keywords?: string[];
  location?: GeoPoint;
  machine?: IDockerMachine;
  machineId?: string;
  containerId?: string;
  tag?: string;
  rating?: number;
  reviewId?: string;
  reviews?: number;
  screenshot?: string;
  status?: string;
  title?: string;
  type?: "info" | "comments" | "places";
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
  Action?: string;
  maxSpentPointsDefault: number;
  maxSpentPoints: number;
  totalSpentPoints: number;
  price: IPrice;
  browser?: IBrowser;
  totalPlaces?: number;
}
